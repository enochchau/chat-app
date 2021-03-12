import passport from 'passport';
import { config } from '../config';
import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import { UserEntity } from '../entity/user';

const JWTstrategy = passportJWT.Strategy;
const LocalStrategy = passportLocal.Strategy;

export class PassportStrategy {

  public static initialize() {
    this.register();
    this.login();
    this.handleJwt();
  }

  private static register() {
    passport.use("register", new LocalStrategy(
      {usernameField: 'username', passwordField: 'password', passReqToCallback: true},
      async (req, username:string, password:string, done) => {

        if(!req.body.name) done(null, false, {message: "Please include a name."});

        try{
          const user = await UserEntity.findOne({ where: {username: username}});
          
          if(user) return done(null, false, {message: "That username is already taken."});

          let newUser = new UserEntity();
          newUser.name = req.body.name;
          newUser.username = username;
          newUser.password = password;

          await UserEntity.save(newUser);

          return done(null, newUser, {message: "Registration successful."});
        } catch (err) {
          return done(err);
        }
      }
    ));
  }

  private static login() {
    passport.use("login", new LocalStrategy(
      {usernameField: 'username', passwordField: 'password'},
      async (username:string, password: string, done) => {
        try {
          const user = await UserEntity.findOne({ 
            where: {username:username},
            select: [
              "id",
              "password",
              "name",
              "username",
              "created",
              "updated"
            ]
          });
          // we have to explicitly select all values b/c password is set to `select: false`
          
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
  }

  private static handleJwt(){
    passport.use( new JWTstrategy(
      {secretOrKey: config.SECRETKEY, jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()},
      async (token, done) => {
        try{
          const user = await UserEntity.findOne({where: {id: token.user.id}});

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
}