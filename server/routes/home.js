const express       = require('express');
const mainRoutes    = express.Router();
const bcrypt        = require('bcrypt');
const cookieSession = require('cookie-session');


module.exports = function(DataHelpers, app) {

  app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));

  app.use(function(req, res, next) {
    const userId = getUserId(req);
    if(!userId) {
      res.locals.user = null;
      next();
    } else {
      DataHelpers.getUserById(userId, (err, user) => {
        if (err) {
          return err;
        }
        res.locals.user = user;
        next();
      });
    }
  });

  function getUserId(req) {
    return req.session.user_id;
  }

  mainRoutes.get("/", (req, res) => {
    res.render("index");
  });

  mainRoutes.get("/login", (req, res) => {
    if (res.locals.user) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  });

  mainRoutes.post("/login", (req, res) => {
    if (res.locals.user) {
      res.redirect("/");
    } else {
      const email = req.body.email;
      const password = req.body.password;

      if(!email || !password) {
        res.status(401).render("error", {errMessage: "Incorrect email or password"});
        return
      }

      DataHelpers.getUser(email, (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (!user) {
          res.status(400).render("error", {errMessage: "Incorrect email or password"});
        } else {
          const comparePass = bcrypt.compareSync(password, user.password);

          if(!comparePass) {
            res.redirect("/login");
          } else {
            req.session.user_id = user._id;
          }

          res.redirect('/');
        }
      })
    }
  });

  mainRoutes.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  mainRoutes.get("/register", (req, res) => {
    if (res.locals.user) {
      res.redirect("/")
    } else {
      res.render("register");
    }
  });

  mainRoutes.post("/register", (req, res) => {
    if (res.locals.user) {
      res.redirect("/")
    } else {
      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;
      const handle = req.body.handle;
      const avatar = req.body.avatar;

      if(!email || !password || !name || !handle || !avatar) {
        res.status(400).render("error", {errMessage: "Please fill the form"});
        return
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

      DataHelpers.getUser(email, (err, user) => {
        if (err) {
          res.status(500).render("error", {errMessage: err.message});
        } else {

          if(user) {
            res.status(404).render("error", {errMessage: "Incorrect email or password"});
          } else {
            const newUser = {
              email: email,
              password: hashedPassword,
              name: name,
              handle: handle,
              avatar: avatar
            };

            DataHelpers.saveUser(newUser, (err, userId) => {
              if (err) {
                res.status(500).render("error", {errMessage: err.message});
              } else {
                req.session.user_id = userId;
                res.redirect("/");
              }
            })
          }
        }
      });

    }
  });

  return mainRoutes;

}