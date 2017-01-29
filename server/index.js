"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
// const cookieParser  = require('cookie-parser');
const MongoClient   = require("mongodb").MongoClient;
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";
const sass          = require("node-sass");


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  console.log("Connected successfully to server");

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const mainRoutes = require("./routes/home")(DataHelpers, app);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/", mainRoutes);
  app.use("/tweets", tweetsRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
})
