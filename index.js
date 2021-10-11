// this is an express app
const express = require("express");
let app = express();

// defalt is to parse json;
app.use(express.json());

let env = require("dotenv").config(); // it does not need to be a variable

// to connect to the database
const db = require("./database/connection");

// getting the port from the .env file
let port = process.env.PORT;

let exampleRoute = require("./route");
app.use(exampleRoute);

const PORT = process.env.PORT || 9001
app.listen(port, () => {
    console.log(`Web server is listening on port ${port}!`);
})