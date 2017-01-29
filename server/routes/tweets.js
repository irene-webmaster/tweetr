"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
// const mainRoutes    = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        let counter = 0;
        const numTweets = tweets.length;

        if(numTweets == 0) {
          res.json([]);
          return;
        }

        for(let i = 0; i < numTweets; i++) {
          DataHelpers.getUserById(tweets[i].userId, (err, user) => {
            tweets[i].user = user;

            counter++;

            if(counter == numTweets) {
              res.json(tweets);
            }
          });
        }
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const tweet = {
      userId: res.locals.user._id,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;

}

