
const express = require("express");

// this will hold the routes that the application will respond to
const router = express.Router();

// this controller holds the functions / callback of how to handle the request when they come in
// this gets the call to the correct file where the functions exist
let controller = require("./controller");

let auth = require("./middleware");

// getting the jwt library
const jwt = require("jsonwebtoken");

/**
 * GET /everyone
 * 
 * Returns a message to everyone, no authentication required
 */
 router.get("/everyone", (req, res) => {
    res.json("Everyone can");
})

/**
 * 
 * Returns a success message that includes the username based on the JWT Token
 * This path is only available to authenticated users
 * 
 * GET /authOnly
 */
router.get("/authOnly", auth.checkJwt, (req, res) => {
    // return a message that show that they are logged in, and tell them the username you see
    res.json("Only the special people can, we see you as "+ req.username);
})


/**
 * Generates a signed JWT token that can be used as evidence that the user is logged in
 * POST /login -d {
 *      "username": "bob",
 *      "password": "password"
 * }
 * Returns a JWT Token
 */
// login call, that passes in the username and password
// if you are using a service that manages the username and passwords
// then you would not have this avialable
router.post("/login", controller.login);


/**
 * 
 * This is for creating a new user. The JWT token is checked for appropriate role
 * 
 * POST /createUser -d {
 *      "username": "bob",
 *      "password": "somePassword",
 *      "confirmPassword": "somePassword"
 * }
 */
// create a user in the database, note that we check that the JWT token is valid,
// and that the JWT token has admin role
//  ***** to seed the first user just delete the middleware and create user, then add middleware back
// ****** this uder will need to be deleted when the program is finally deployed 
router.post("/createUser",[auth.checkJwt, auth.isAdmin] ,controller.createUser);


router.get("/users/:user_id", controller.userId);


// GET 
// GET/record 
// will list all of the ingredient in the user table from the database

// the route, (the folder we are going into)controller.getUsers(the function we are calling)
router.get("/record", controller.listUsers);

// we are making the entire file available to the program
module.exports = router;
