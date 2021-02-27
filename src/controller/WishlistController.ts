import { getConnection } from "typeorm";
import { Request, Response, NextFunction } from "express";

import { Wishlist } from "../entity/Wishlist";
import { Users } from "../entity/Users";
import { Item } from "../entity/Item";

export class WishlistController {
  private entityManager = getConnection().manager;

  // GET all wishlists for a given username
  async getWishlistsByUsername(request: Request, response: Response, next: NextFunction) {
    console.log(`WishlistController - getWishlistsByUsername - Getting all wishlists for user ${request.params.username}`);
    let user = await this.entityManager
      .createQueryBuilder(Users, "user")
      .where("user.username = :username", { username: request.params.username })
      .getOne();

    if (user === null || user === undefined) return { error: "Error retrieving user information." };

    try {
      let wishlists = await this.entityManager
        .createQueryBuilder(Wishlist, "wishlist")
        .where("wishlist.owner = :id", { id: user.id })
        .getMany();

      return (wishlists !== null && wishlists !== undefined) ? wishlists : [];
    } catch (e) {
      console.log(e);
      return { error: e };
    };
  }

  // GET a wishlist for a user given a user ID and a title
  async getWishlistByUsernameAndName(request: Request, response: Response, next: NextFunction) {
    console.log(`WishlistController - getWishlistsByUsernameAndName - Getting wishlist "${request.params.name}" for user ${request.params.username}`);
    let user = await this.entityManager
      .createQueryBuilder(Users, "user")
      .where("user.username = :username", { username: request.params.username })
      .getOne();

    if (user === null || user === undefined) return { error: "Error retrieving user information." };

    let wishlist = await this.entityManager
      .createQueryBuilder(Wishlist, "wishlist")
      .where("wishlist.owner = :id", { id: user.id })
      .andWhere("wishlist.name = :name", { name: request.params.name })
      .getOne();

    return (wishlist !== null && wishlist !== undefined) ? wishlist : {};
  }

  // POST a new wishlist given a specific username in the parameters
  async addNewWishlist(request: Request, response: Response, next: NextFunction) {
    console.log(`WishlistController - addNewWishlist - Creating new wishlist "${request.body.name}" for user ${request.params.username}`);
    const currDate = new Date();

    const currUser = await this.entityManager
      .createQueryBuilder(Users, "user")
      .where("user.username = :username", { username: request.params.username })
      .getOne();

    if (currUser === null || currUser === undefined) return { error: "Error retrieving user information." };

    try {
      return await this.entityManager
        .createQueryBuilder()
        .insert()
        .into(Wishlist)
        .values({
          name: request.body.name,
          description: request.body.description,
          date_created: currDate.toISOString().split('T')[0],
          owner: currUser,
          last_updated: currDate.toISOString().split('T')[0]
        })
        .execute();
    } catch (e) {
      if (e.message.includes("duplicate key value")) return { error: `Wishlist "${request.body.name}" already exists for user ${currUser.username}` };
      return { error: "An error occured while adding the new wishlist" };
    }
  }

  // GET all wishlist items
  async getAllWishlistItems(request: Request, response: Response, next: NextFunction) {
    console.log(`WishlistController - getAllWishlistItems - Getting all items for wishlist ${request.params.wid}`);
    try {
      let items = await this.entityManager
        .createQueryBuilder(Item, "item")
        .where("item.wishlist = :wid", { wid: request.params.wid })
        .getMany();

      return (items !== null && items !== undefined) ? items : [];
    } catch (err) {
      if (err.code === "22P02") return { error: "Invalid wishlist ID" };
      return { error: "An error has occured.", error_code: err.code };
    }
  }

  // GET a specific item from a wishlist
  async getItemFromWishlist(request: Request, response: Response, next: NextFunction) {
    console.log(`WishlistController - getItemFromWishlist - Getting item ${request.params.iid} for wishlist ${request.params.wid}`);
    try {
      let item = await this.entityManager
        .createQueryBuilder(Item, "item")
        .where("item.wishlist = :wid", { wid: request.params.wid })
        .andWhere("item.id = :iid", { iid: request.params.iid })
        .getOne();

      return (item !== null && item !== undefined) ? item : {};
    } catch (err) {
      if (err.code === "22P02") {
        const parseError = err.message.split('"')[1];
        if (parseError === request.params.wid) return { error: `Wishlist ${request.params.wid} does not exist` };
        if (parseError === request.params.iid) return { error: `Item ${request.params.iid} does not exist on wishlist ${request.params.wid}` };
      }
      // console.error(err);
      return { error: "An error has occured.", error_code: err.code };
    }
  }

  // POST a new item to a wishlist
  async addItemToWishlist(request: Request, response: Response, next: NextFunction) {
    console.log(`WishlistController - addItemToWishlist - Adding item ${request.params.iid} to wishlist ${request.params.wid}`);
    const currDate = new Date();

    const wishlist = await this.entityManager
      .createQueryBuilder(Wishlist, "wishlist")
      .where("wishlist.id = :wid", { wid: request.params.wid })
      .getOne();

    if (wishlist === null || wishlist === undefined) return { error: `Wishlist ${request.params.wid} does not exist` };

    try {
      return await this.entityManager
        .createQueryBuilder()
        .insert()
        .into(Item)
        .values({
          title: request.body.title,
          link: request.body.link,
          description: request.body.description,
          date_added: currDate.toISOString().split('T')[0],
          wishlist: wishlist
        })
        .execute();
    } catch (err) {
      return { error: "An error occured while adding the new item.", error_code: err.code };
    }
  }

  // PUT update a wishlist (metadata, not items)
  async updateWishlist(request: Request, response: Response, next: NextFunction) {
    const currDate = new Date();

    try {
      return await this.entityManager
        .createQueryBuilder()
        .update(Wishlist)
        .set({
          name: request.body.name,
          description: request.body.description,
          last_updated: currDate.toISOString().split('T')[0]
        })
        .where("id = :wid", { wid: request.params.wid })
        .execute();
    } catch (err) {
      if (err.message.includes("duplicate key value")) return { error: `A wishlist by the name ${request.body.name} already exists.` };
      return { error: `An error occured while updating wishlist ${request.params.wid}` };
    }
  }

  // DELETE a wishlist
  async deleteWishlist(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.entityManager
        .createQueryBuilder()
        .delete()
        .from(Wishlist)
        .where("id = :wid", { wid: request.params.wid })
        .execute();
    } catch (err) {
      // console.error(err);
      if (err.code === '22P02') return { error: `Wishlist ${request.params.wid} does not exist` };
      return { error: `An error occured when deleting wishlist ID ${request.params.wid}` };
    }
  }

}
