import passport from 'passport';
import config from './config';
import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import { getRepository } from "typeorm";
import { User } from './entity/user';

const JWTstrategy = passportJWT.Strategy;
const LocalStrategy = passportLocal.Strategy;

function init(){

  passport.use("register", new LocalStrategy(
    {usernameField: 'username', passwordField: 'password', passReqToCallback: true},
    async (req, username:string, password:string, done) => {
      try{
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: {username: username}});
        if(user) return done(null, false, {message: "That username is already taken."});

        let newUser = new User();
        newUser.name = req.body.name;
        newUser.username = username;
        newUser.password = password;

        await userRepository.save(newUser);

        return done(null, newUser, {message: "Registration successful."});
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.use("login", new LocalStrategy(
    {usernameField: 'username', passwordField: 'password'},
    async (username:string, password: string, done) => {
      try {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ where: {username:username}});
        
        if(!user) return done(null, false, {message: "That username does not exist."});
        
        user.checkPassword(password, (err, result) => {
          if(err) return done(err);

          if (!result) return done(null, false, {message: "Your password is invalid."});

          return done(null, user, {message:"Logged in successfully."}) ;
        });
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use( new JWTstrategy(
    {secretOrKey: config.SECRETKEY, jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()},
    async (token, done) => {
      try{
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({where: {id: token.user.id}});

        if(!user){
          const error = new Error("A JWT had no user associated with it.");
          done(error);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

}

export { init };