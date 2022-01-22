const express = require("express");
const db = require('../db');
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError")
const { SECRET_KEY } = require("../config");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async(req, res, next) => {
    try{
        const { username, password } = req.body;
        if (await User.authenticate(username, password)) {
        await User.updateLoginTimestamp(username);
        let token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
        } else {
            throw new ExpressError('Invalid username/password', 400);
            }
    
    } catch(err){
        return next(err);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

 router.post('/register', async (req, res, next) => {
    try {
      const { username, password, first_name, last_name, phone } = req.body;
  
      const registeredUser = await User.register(req.body);
      // console.log('registeredUser ', registeredUser);
      let token = jwt.sign({ username }, SECRET_KEY);
      User.updateLoginTimestamp(registeredUser);
      return res.json({ token });
    } catch (err) {
      return res.json(err);
    }
  });


  module.exports = router;