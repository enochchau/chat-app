import express from 'express';
import passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserEntity } from '../entity/user';
import { JwtUserInterface } from '../auth/jwt';

export class AuthRouter {
  public router = express.Router();

  constructor(){
    this.register();
    this.login();
  }

  private register(){
    this.router.post('/register', (req, res, next) => {
      passport.authenticate("register", {session: false}, (err: null | Error, user: UserEntity, info) => {
        if(err){
          const error = new Error("An error occured during registration: " + err.message);
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
  }

  private login(){
    this.router.post('/login', (req, res, next) => {
      passport.authenticate("login", (err: null | Error, user: UserEntity, info) => { 
        if(err){
          const error = new Error("An error occurred while logging in: " + err.message);
          return next(error);
        }

        if (!user){
          res.json(info);
          return;
        }

        req.login(user, {session: false}, (err: null | Error) => {
          if (err) return next(err);

          const body: JwtUserInterface = { id: user.id, username: user.username};
          const token = jwt.sign({ user: body }, config.SECRETKEY);
          
          return res.json(token);
        });
      })(req,res,next);
    });
  }
}