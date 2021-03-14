import express from 'express';
import { GroupEntity } from '../entity/group';
import { UserEntity } from '../entity/user';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';


export class GroupRouter {
  public router = express.Router();

  constructor(){
    this.postNewGroup();
    this.getGroupsForUser();
  }

  private postNewGroup(){
    this.router.post("/", async (req, res, next) => {
      const NewGroupReq = t.type({
        userIds: t.array(t.number),
        groupName: t.string,
      });
      type NewGroupReq = t.TypeOf<typeof NewGroupReq>;

      const onLeft = (errors: t.Errors) => { res.sendStatus(400); };
      const onRight = async (body: NewGroupReq) => {
        const userIds = body.userIds;        
        try {
          const users: Array<UserEntity> = await UserEntity.findByIds(userIds);

          // if all users are found
          if (users.length === userIds.length) { 
            let group = await GroupEntity.createGroupWithUsers(users, req.body.groupName ? req.body.groupName: null);
            res.json(group);

          } else res.sendStatus(400);

        } catch(err) {
          next(err);
        }
      }

      pipe(NewGroupReq.decode(req.body), fold(onLeft, onRight));
    });
  }
  
  private getGroupsForUser(){
    this.router.get('/', async (req, res, next) => {
      if(!req.user) return;
      const count = req.query.count ? parseInt(req.query.count as string) : 10; // default to send 10 groups if no count
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      try {

        const user = await UserEntity.findGroupsOfUserId(req.user.id, count, date);
        if(!user) return res.sendStatus(400);
        const groups = user.groups;

        res.json(groups);
        
      } catch(err) {
        next(err);
      }
    });
  }
}