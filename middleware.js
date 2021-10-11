
// to connect to the database
const db = require("./database/connection");

require("dotenv").config(); // it does not need to be a variable

// getting the jwt library
const jwt = require("jsonwebtoken");

// getting the jwtsecret from the .env file
let jwtSecret = process.env.jwtSecret;





let isAdmin = (req, res, next) => {
    if(req.isAdmin) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

// the middleware function to call when processing an authorized URL
let checkJwt = (req, res, next) => {
    console.log("Processing JWT authentication check");

    // read the token from the header
    let token;
    if(req.headers.authorization) {
        let bearer = req.headers.authorization.split(" ");
        token = bearer[1];
    } else {
        token = null;
    }
    
    // if the token is not valid, there is nothing to check
    if (!token) {
        return res.status(401).send("Unauthorized!");
    }

    // verfy the token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        // if we get an error message then the token is not valid
        if (err) {
            console.log("Did not verify jwt", err);
            return res.status(401).send("Unauthorized!");
        }
        
        // the token is valid, store the username from the token in the request, so that it is
        // available to all following this call
        console.log(decoded);
        req.username = decoded.username;
        req.isAdmin = decoded.role == 'admin'
        // call the next middleware function in the chain
        next();
    });
};

module.exports = { checkJwt , isAdmin }
