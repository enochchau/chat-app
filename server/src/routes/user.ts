// all routes for user functions
// changing password
// changing username
// updating email address
import express from 'express';

import { UserEntity } from '../entity/user';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import { doesNotMatch } from 'node:assert';

export class UserRouter {
  public router = express.Router();

  constructor(){
    this.patchPassword();
    this.patchName();
    this.patchEmail();
    this.getUser();
  }

  private patchPassword(){
    const PasswordReq = t.type({
      password: t.string,
      newPassword: t.string,
    });

    type PasswordReq = t.TypeOf<typeof PasswordReq>;

    this.router.patch("/password", (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.sendStatus(400);

      const onRight = async (body: PasswordReq) => {
        if(!req.user) return res.sendStatus(400);

        try{
          const user = await UserEntity.findOne({
            where: {id: req.user.id},
            select:["password"]
          });

          if(!user) return res.sendStatus(400);

          user.checkPassword(body.password, (err, result) => {
            if(err) return next(err);
            if(!result) return res.json({message: "Your current password does not match."});

            user.password = body.newPassword;
            UserEntity.save(user);
            res.json({message: "Your password was changed successfully."})
          });
        } catch(err){
          next(err);
        }
      }
      pipe(PasswordReq.decode(req.body), fold(onLeft, onRight));
    });
  } 

  private patchName(){
    const NameReq = t.type({
      newName: t.string
    });
    type NameReq = t.TypeOf<typeof NameReq>;

    this.router.patch("/name", (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.sendStatus(400);

      const onRight = async (body: NameReq) => {
        if(!req.user) return res.sendStatus(400);
        try{
          const user = await UserEntity.findOne({
            where: {id: req.user.id}
          });

          if(!user) return res.sendStatus(400);

          user.name = body.newName;
          const reUser = await UserEntity.save(user);
          res.json(reUser);
        } catch(error) {
          next(error);
        }
      }

      pipe(NameReq.decode(req.body), fold(onLeft, onRight));
    });
  }

  private patchEmail(){
    const EmailReq = t.type({
      newEmail: t.string
    });
    type EmailReq = t.TypeOf<typeof EmailReq>;

    this.router.patch("/email", (req, res, next) => {

      const onLeft = async (errors: t.Errors) => res.sendStatus(400);
      
      const onRight = async (body: EmailReq) => {
        if(!req.user) return res.sendStatus(400);

        try{
          const user = await UserEntity.findOne({
            where: {id: req.user.id}
          });

          if(!user) return res.sendStatus(400);

          user.email = body.newEmail;
          const reUser = await UserEntity.save(user);
          res.json(reUser);
        } catch (err) {
          next(err);
        }
      }

      pipe(EmailReq.decode(req.body), fold(onLeft, onRight));
    });
  }

  private getUser(){
    const UserReq = t.type({
      userId: t.number
    });
    type UserReq = t.TypeOf<typeof UserReq>;
    this.router.get('/', (req, res, next) => {

      const onLeft = async (errors: t.Errors) => res.sendStatus(400);
      const onRight = async (body: UserReq) => {
        try{
          const user = await UserEntity.findOne({where: {id: body.userId}});
          if(!user) return res.sendStatus(400);

          res.json(user);
        } catch(err) {
          next(err);
        }
      }

      pipe(UserReq.decode(req.body), fold(onLeft, onRight));
    })
  }

  private getManyUsers(){
    const ReqParams = t.type({
      userIds: t.array(t.number),
      count: t.number
    });
    type ReqParams = t.TypeOf<typeof ReqParams>;
    this.router.get('/many', (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.status(400).json(errors);
      const onRight = async (query: ReqParams) => {
        try{
          const users = await UserEntity.findManyByIds(query.userIds,query.count);
          if(!users) return res.sendStatus(400);

          res.json(users);
        } catch(error) {
          next(error);
        }
      }
      pipe(ReqParams.decode(req.query), fold(onLeft, onRight));
    })
  }
}