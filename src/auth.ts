import passport from 'passport';
import config from './config';
import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import * as models from './models/index';

const JWTstrategy = passportJWT.Strategy;
const LocalStrategy = passportLocal.Strategy;

function init(){

  passport.use("register", new LocalStrategy(
    {usernameField: 'username', passwordField: 'password', passReqToCallback: true},
    (req, username:string, password:string, done) => {
      models.User.findOne({where: {username: username}})
        .then((user) => {
          if(user) return done(null, false, {message: "That username is already taken."});

          models.User.create(
            {
              username: username,
              password: password,
              name: req.body.name,
            }
          )
            .then((user) => {
              return done(null, user, {message: "Registration successful."});
            });
        });
    }
  ));

  passport.use("login", new LocalStrategy(
    {usernameField: 'username', passwordField: 'password'},
    (username:string, password: string, done) => {
      models.User.findOne({where: {username:username}})
        .then((user) => {
          if(!user) return done(null, false, {message: "That username does not exist."});

          user.checkPassword(password, function(err, result){
            if (err){
              console.error("Error checking password hash: ", err);
              return done(err);
            }

            if (!result) return done(null, false, {message: "Your password is invalid."});

            return done(null, user, {message:"Logged in successfully."}) ;
          })
        })
    }
  ))

  passport.use( new JWTstrategy(
    {secretOrKey: config.SECRETKEY, jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()},
    async (token, done) => {
      try{
        return done(null, token.user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

export {init};