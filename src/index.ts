import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response, NextFunction } from "express";
import { createConnection } from "typeorm";
import { Routes } from "./routes";
import { version } from "../package.json";

createConnection().then(async _ => {

  const app = express();
  app.use(bodyParser.json());

  // Set up CORS
  const options: cors.CorsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token"
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,POST,DELETE",
    preflightContinue: false
  };

  // Add cors to express app
  app.use(cors(options));
  app.options("*", cors(options));

  // Add api version to the response headers
  app.use((_, res, next) => {
    res.append('API-Version', version);
    next();
  });

  // Set the routing up here
  Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
      const result = (new (route.controller as any))[route.action](req, res, next);
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    });
  });

  const port = process.env.PORT || 3000;

  app.listen(port);
  console.log(`Wishr express backend has started listening on port ${port}`);

}).catch(error => console.log(error));
