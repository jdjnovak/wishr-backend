import { UsersController } from "./controller/UsersController";
import { ItemController } from "./controller/ItemController";
import { WishlistController } from "./controller/WishlistController";

export const Routes = [
  {
    method: "get",
    route: `/users/username/:username`,
    controller: UsersController,
    action: "getUserByUsername"
  }, {
    method: "get",
    route: `/users/email/:email`,
    controller: UsersController,
    action: "getUserByEmail"
  }, {
    method: "get",
    route: `/users`,
    controller: UsersController,
    action: "getAllUsers"
  }, {
    method: "post",
    route: `/register`,
    controller: UsersController,
    action: "register"
  }, {
    method: "post",
    route: `/login`,
    controller: UsersController,
    action: "login"
  }, {
    method: "post",
    route: `/validate`,
    controller: UsersController,
    action: "validateJWT"
  }, {
    method: "get",
    route: `/users/:username/wishlists`,
    controller: WishlistController,
    action: "getWishlistsByUsername"
  }, {
    method: "get",
    route: `/users/:username/wishlist/:name`,
    controller: WishlistController,
    action: "getWishlistByUsernameAndName"
  }, {
    method: "post",
    route: `/users/:username/wishlists`,
    controller: WishlistController,
    action: "addNewWishlist"
  }, {
    method: "get",
    route: `/wishlist/:wid`,
    controller: WishlistController,
    action: "getAllWishlistItems"
  }, {
    method: "get",
    route: `/wishlist/:wid/item/:iid`,
    controller: WishlistController,
    action: "getItemFromWishlist"
  }, {
    method: "post",
    route: `/wishlist/:wid`,
    controller: WishlistController,
    action: "addItemToWishlist"
  }, {
    method: "put",
    route: `/wishlist/:wid`,
    controller: WishlistController,
    action: "updateWishlist"
  }, {
    method: "delete",
    route: `/wishlist/:wid`,
    controller: WishlistController,
    action: "deleteWishlist"
  }
];
