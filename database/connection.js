
let mysql = require("mysql");

require("dotenv").config(); // this will allow us to use the .env file

// giving express information to connect to the database
let connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
})

// actually creating the connection
connection.connect();

// issuing a query on the connection and the callback tells it what to do when the query finishes
//connection.query("select now()", function(error, rows){ // use this to check connection to database and get time stamp
// to get a time stamp use 'SELECT now()' before the function 
connection.query("use " + process.env.MYSQL_DATABASE, function(error, rows){
    console.log("inside connedtion test");
    if(error){
        console.log("DB Query error", error);
    } else {
        console.log("Query results", rows);
    }
});

// we are making the entire file available to the program 
module.exports = connection;