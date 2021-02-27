import { getConnection, getRepository } from "typeorm";
import { Request, Response, NextFunction } from "express";
import { Users } from "../entity/Users";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as config from "../../authconfig.json";
import * as fs from "fs";

import { decodeAndParseJson, JWK, JWKS } from "../utils/AuthHelper";

const PUB_KEY = fs.readFileSync(__dirname + '/../../wishr_public.pem', 'utf-8')
const PRIV_KEY = fs.readFileSync(__dirname + '/../../wishr_private.pem', 'utf-8')

export class UsersController {
  private entityManager = getConnection().manager;

  // Get all users
  async getAllUsers(request: Request, response: Response, next: NextFunction) {
    return await this.entityManager
      .createQueryBuilder(Users, "user")
      .getMany();
  }

  // Get a user object via searching by username
  async getUserByUsername(request: Request, response: Response, next: NextFunction) {
    let user = await this.entityManager
      .createQueryBuilder(Users, "user")
      .where("user.username = :username", { username: request.params.username })
      .getOne();

    // Put the call in a variable because it hangs otherwise.
    // With this, it still returns an existing user, but now
    // if you ask for a nonexistant user, it will return {}
    return (user !== null && user !== undefined) ? user : {};
  }

  // Get a user object via searching by email
  async getUserByEmail(request: Request, response: Response, next: NextFunction) {
    let user = await this.entityManager
      .createQueryBuilder(Users, "user")
      .where("user.email = :email", { email: request.params.email })
      .getOne();

    // Put the call in a variable because it hangs otherwise.
    // With this, it still returns an existing user, but now
    // if you ask for a nonexistant user, it will return {}
    return (user !== null && user !== undefined) ? user : {};
  }

  // Function used when a login is requested. Similar points to the
  // getUserbyEmail function, however, with tokens and such on the response
  async login(request: Request, response: Response, next: NextFunction) {
    console.log(`UserController - login - Logging in user ${request.body.username}`);
    let user = await this.entityManager
      .createQueryBuilder(Users, "user")
      .where("user.username = :username", { username: request.body.username })
      .getOne();

    if (user === null || user === undefined) {
      console.log(`UserController - login - Failed login of user ${request.body.username}`);
      return { isAuthenticated: false, token: null, user: null, error: 'User does not exist.' };
    } else {
      const correctPassword = bcrypt.compareSync(request.body.password, user.password);
      if (!correctPassword) {
        return { isAuthenticated: false, token: null, user: null, error: 'Password is incorrect.' };
      }

      const token = jwt.sign({ id: user.id, email: user.email, user_role: user.user_role }, PRIV_KEY, { expiresIn: 86400, algorithm: 'RS256' });
      console.log(`UserController - login - Successful login of user ${request.body.username}`);
      return {
        isAuthenticated: true,
        token: token,
        user: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_role: user.user_role
        }
      };
    }
  }

  // Register a user and return the status of the registration
  async register(request: Request, response: Response, next: NextFunction) {
    console.log(`UserController - addUser - Adding new user ${request.body.username}`);
    let hashedPassword = bcrypt.hashSync(request.body.password, 10);

    // Honestly, I'm not sure whats going on here. It seems that sometimes
    // the password is inserted, sometimes its not. I'm not sure why, so 
    // I've decided to do use hashSync instead (for now)
	/*
    let hashError = false;
    let hashedPassword = '';
    bcrypt.hashSync(request.body.password, 10, async function(err, hash) {
      hashedPassword = hash;
      if (err) {
        hashError = true;
      }
    });

    if (hashError) {
      console.error(`ERROR: addUser/bcrypt.hash: Error occured during hashing.`);
      return { error: 'An error occured.' };
    }
	*/

    let errorOccured = false;
    let userAddResponse = await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values({
        username: request.body.username,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        password: hashedPassword,
        date_of_birth: request.body.dob,
        email: request.body.email,
        is_active: true
      })
      .execute()
      .catch((err: any) => {
        console.error(`ERROR: Error occured while adding user ${request.body.username} to the database. Reason is: ${err}`);
        errorOccured = true;
        return { error: `${err}`, identifiers: [{ id: null }] }
      });

    if (errorOccured) return { error: 'An error has occured.', reason: userAddResponse };
    else return { message: 'Success' };
  }

  // Function to validate a users JWT to make sure they're allowed to keep doing
  // whatever they need to do
  async validateJWT(request: Request, response: Response, next: NextFunction) {
    console.log(`UserController - validateJWT - Validating token: ${request.body.token}`);
    let validation = jwt.verify(request.body.token, PUB_KEY, { algorithms: ['RS256'] }, (err, payload) => {
      if (err && err.name === 'TokenExpiredError') return { success: false, error: 'Your token has expired.' }
      if (err && err.name === 'JsonWebTokenError') return { success: false, error: 'Malformed JWT token.' }
      if (!err) return { success: true }
    })

    return validation
  }
}
