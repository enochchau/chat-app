import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../entity/user';

const auth = express.Router();

auth.post('/register', (req, res, next) => {
  passport.authenticate("register", {session: false}, (err: null | Error, user: User, info) => {
    if(err){
      const error = new Error("An error occured during registration.");
      return next(error);
    }

    if (!user){
      res.json(info);
      return;
    }

    res.json({
      message: "Registration successful",
    });
  })(req, res, next);
});

// interface for encrypted contents of JWT
interface TokenBody{
  id: number;
  username: string;
}

auth.post('/login', (req, res, next) => {
  passport.authenticate("login", (err: null | Error, user: User, info) => { 
    if(err){
      const error = new Error("An error occurred while logging in.");
      return next(error);
    }

    if (!user){
      res.json(info);
      return;
    }

    req.login(user, {session: false}, (err: null | Error) => {
      if (err) return next(err);

      const body: TokenBody = { id: user.id, username: user.username};
      const token = jwt.sign({ user: body }, config.SECRETKEY);
      
      return res.json(token);
    });
  })(req,res,next);
});

export default auth;