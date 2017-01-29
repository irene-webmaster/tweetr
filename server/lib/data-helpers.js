"use strict";

// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
const mongo = require('mongodb');

module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));
      });
    },

    saveUser: function(newUser, callback) {
      db.collection("users").insertOne(newUser, (err, result) => {
        if (err) {
          return callback(err);
        }
        const userId = result.insertedId;
        callback(null, userId);
      });
    },

    getUser: function(email, callback) {
      db.collection("users").find({email: email}).toArray((err, users) => {
        if (err) {
          return callback(err);
        }
        callback(null, users[0]);
      });
    },

    getUserById: function(userId, callback) {
      const objectId = new mongo.ObjectID(userId);
      db.collection("users").find({"_id": objectId}).toArray((err, users) => {
        if (err) {
          return callback(err);
        }
        callback(null, users[0]);
      });
    }
  };
}
