import { getConnection, getRepository } from "typeorm";
import { Request, Response, NextFunction } from "express";

import { Item } from "../entity/Item";
// import { Wishlist } from "../entity/Wishlist";

export class ItemController {
  private entityManager = getConnection().manager;

  // GET an item
  async getItem(request: Request, response: Response, next: NextFunction) {
    let item = await this.entityManager
      .createQueryBuilder(Item, "item")
      .where("id = :iid", { iid: request.params.iid })
      .getOne();

    return (item !== null && item !== undefined) ? item : {};
  }

  // PUT (Update) an item
  async updateItem(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.entityManager
        .createQueryBuilder()
        .delete()
        .from(Item)
        .where("id = :iid", { iid: request.params.iid })
        .execute();
    } catch (err) {
      if (err.code === '22P02') return { error: `Item ${request.params.iid} does not exist` };
      return { error: `An error occured when trying to update item ID ${request.params.iid}` };
    }
  }

  // DELETE an item
  async deleteItem(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.entityManager
        .createQueryBuilder()
        .update(Item)
        .set({
          title: request.body.title,
          link: request.body.link,
          description: request.body.description
        })
        .where("id = :iid", { iid: request.params.iid })
        .execute();
    } catch (err) {
      if (err.code === '22P02') return { error: `Item ${request.params.iid} does not exist` };
      return { error: `An error occured when trying to delete item ID ${request.params.iid}` };
    }
  }
}
