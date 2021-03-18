import passport from 'passport';
import { config } from '../config';
import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import { UserEntity } from '../entity/user';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

// validation for register request body json
const RegisterJson = t.type({
  name: t.string,
  password: t.string,
  email: t.string,
});
type RegisterJson = t.TypeOf<typeof RegisterJson>;


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
      {usernameField: 'email', passwordField: 'password', passReqToCallback: true},
      async (req, email:string, password:string, done) => {

        const doesUserExist = async (): Promise<boolean> => {
          const user = await UserEntity.findOne({ where: {email: email}});
          if(user) return true;
          return false;
        }
        const isEmail = (email: string): boolean => {
          const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(email.toLowerCase());
        }
        const isPassword = (password: string): boolean => password.length >= 6;
        const isName = (username: string): boolean => {
          // https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
          const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
          return regex.test(username);
        }

        const onLeft = (errors: t.Errors) => { return done(null, false, {message: "Invalid json recieved."}); }
        const onRight = async (body: RegisterJson) => {
          if(!isEmail(email)) return done(null, false, {message: "That is not a valid email address."});
          if(!isPassword(password)) return done(null, false, {message: "Your password must be at least 6 characters."});
          if(!isName(body.name)) return done(null, false, {message: "Special characters are not allowed in your name."})

          try{
            if(await doesUserExist()) return done(null, false, {message: "That email is already being used."});

            let newUser = new UserEntity();
            newUser.email = email;
            newUser.name = body.name;
            newUser.password = password;

            await UserEntity.save(newUser);

            return done(null, newUser, {message: "Registration successful."});
          } catch (err) {
            return done(err);
          }
        }
        pipe(RegisterJson.decode(req.body), fold(onLeft, onRight));
      }
    ));
  }

  private static login() {
    passport.use("login", new LocalStrategy(
      {usernameField: 'email', passwordField: 'password'},
      async (email:string, password: string, done) => {
        try {
          const user = await UserEntity.findOne({ 
            where: {email: email},
            select: [
              "id",
              "password",
              "avatar",
              "email",
              "name",
              "created",
              "updated"
            ]
          });
          // we have to explicitly select all values b/c password is set to `select: false`
          
          if(!user) return done(null, false, {message: "The combination of email and password do not exist."});
          
          user.checkPassword(password, (err, result) => {
            if(err) return done(err);

            if (!result) return done(null, false, {message: "The combination of email and password do not exist."});

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
      {
        secretOrKey: config.SECRETKEY, 
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
      },
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