// to connect to the database
const db = require("./database/connection");

let mysql = require("mysql");

// to get the password hash, since out database does not store the password directly
const bcrypt = require("bcrypt");

require("dotenv").config(); // it does not need to be a variable

// getting the jwt library
const jwt = require("jsonwebtoken");






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
let login = function(req, res) {
// app.post("/login", controller.login);
    // note that we do not print the body, since we do not want to leak the password in our logs
    console.log("inside Login");
    console.log("POST /login", req.body);
    
    // read the username and password from the post body
    let username = req.body.username;
    let password = req.body.password;
    console.log("username: ", username);

    // select the username, role and stored hash from the db for the user passed in
    db.query("select username, password_hash, role from users where username = ?", [username], (err, rows) => {

        // assume the password provided in the request is bad
        let goodPassword = false;
        let role;

        // if the database failed then log as error
        if(err){
            console.error("Error when query the db", err);
        }
        // if the database returned too many rows then log an error
        if(rows.length > 1){
            console.error("Found too many rows with the username ", username);
        }
        // if the database returned no rows, then log it, but its not an error
        // maybe the username never signed up with our application
        if(rows.length == 0) {
            console.log("Did not find a row with the username ", username);
        }
        // if query ran without an error, and only 1 row came back,
        // then check the stored hash against the password provided in the request
        if(!err && rows.length == 1) {
            row = rows[0];

            // get the stored hash from the database
            let hash = row.password_hash;

            // get the role from the database
            role = row.role;

            // check that the hash is the database matches the password provided
            goodPassword = bcrypt.compareSync(password, hash);
        }

        // if the password provided is good then return
        // a signed copy of the access token
        if(goodPassword){
            // the token should include things that you are sending back to the client
            // which include the username and role
            // not a good idea to send the password or the hash of the password back
            const unsignedToken = {
                username: username,
                role: role
            };
            // sign the token using the JWT secret
            const accessToken = jwt.sign(unsignedToken, process.env.jwtSecret);

            // send the signed token back
            res.json(accessToken);
        } else {
            // if the password provided was not good, or was not able to be verified
            // send an unathorized message and code back
            res.status(401).send("Unauthorized:");
        }
    });
}
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
let createUser = function(req,res){
//app.post("/createUser", [checkJwt, isAdmin], (req, res) => {
    // note that we do not include the password in the console log
    //console.log("POST /createUser: ", req.body.username);
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    // make sure that the password and confirm password are the same
    if(password != confirmPassword){
        return res.status(400).send("Passwords do not match");
    }

    // generate the hash of the password that will be stored in the database
    let passwordHash = bcrypt.hashSync(password, 10); // this will get hashed 10 times

    let sql = "INSERT INTO users(username, password_hash, role) values (?,?,?);"
    db.query(sql, [username, passwordHash, 'user'], (err, rows) => {

        // if the insert query returned an error, we log the error
        // and return a failed message back
        if(err) {
            console.error("Failed to add user", err);
            res.status(500).send("Failed to add user");
        } else {
            // if the insert statement ran without an error, then the user was creaded
            res.send("User created");
        }
    })
}

let userId = function(req,res){
//app.get("/users/:user_id", function(req, res) {

    let id = req.params.user_id;

    let sql = `select * from users where id = ?`;
    let sqlValues = [id];

    db.query(sql, sqlValues, function(err, results) {
        if (err) {
            console.error("Error when fetching user by id", err);
            res.sendStatus(500);
        } else if (results.length > 1) {
            console.error("Too many user returned for the id ", id);
            res.sendStatus(500);
        } else if (results.length == 0) {
            console.error("No user for id found");
            res.status(401).json(null);
        } else if (results.length == 1) {
            res.json(results[0]);
        }
    });
}

// LIST /list
let listUsers = function(req, res){
    console.log("LIST listUsers()");

    // nothing is added into this sql statement because we are just returning the entire ingredients table
    let sql = "SELECT * FROM users;"; 

    db.query(sql, function(error, rows){
        if(error){
            res.sendStatus(500);
        } else {
            console.log("rows: ", rows)
            // returning all the rows in the users table
            res.json(rows);
            }
        })
}


module.exports = {login, createUser, userId, listUsers}