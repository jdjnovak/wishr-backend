# Needed Endpoints
## Users
| Done | Method | Description | URL |
|------|--------|-------------|-----|
| Yes | GET | Get user info from a given username | /users/username/:username |
| Yes | GET | Get user info from a given email | /users/email/:username |
| Yes | POST | Log a user in given a username and password in the body | /login |
| Yes | POST | Register a new user with needed user information | /register |
| Yes | POST | Validate a JWT Token | /validate |

## Wishlist
| Done | Method | Description | URL |
|------|:------:|-------------|-----|
| Yes | GET | Get all of a users wishlists | /users/:uid/wishlists |
| Yes | GET | Get a wishlist from a user from a given name | /users/:uid/wishlist/:name |
| Yes | GET | Get all wishlist items | /wishlist/:wid |
| Yes | GET | Get a specific item from a wishlist | /wishlist/:wid/item/:iid |
| Yes | POST | Add a new wishlist for a user | /users/:username/wishlists |
| Yes | POST | Add item to wishlist | /wishlist/:wid |
| Yes | PUT | Update a wishlist (metadata, not items) | /wishlist/:wid |
| Yes | DELETE | Delete a wishlist | /wishlist/:wid |

## Items
| Done | Method | Description | URL |
|------|--------|-------------|-----|
| No | GET | Get an item | /item/:id |
| No | PUT | Update an item | /item/:id |
| No | DELETE | Delete an item | /item/:id |
