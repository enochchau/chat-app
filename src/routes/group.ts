import express from 'express';
import { getConnection } from 'typeorm';
import { GroupEntity } from '../entity/group';
import { UserEntity } from '../entity/user';

export class GroupRouter {
  public router = express.Router();

  constructor(){
    this.postNewGroup();
    this.getGroupsForUser();
  }

  private postNewGroup(){
    this.router.post("/", async (req, res, next) => {
      if (!req.body.userId || req.body.userId.length < 1) return res.sendStatus(400);
      const userIds = req.body.userId as Array<number>; 

      try {
        const users: Array<UserEntity> = await UserEntity.findByIds(userIds);
        // check that all the users exist
        if (users.length !== userIds.length) return res.sendStatus(400);

        let group = await GroupEntity.createGroupWithUsers(users, req.body.groupName ? req.body.groupName: null);

        res.json(group);
      } catch(err) {
        next(err);
      }
    })
  }
  
  private getGroupsForUser(){
    this.router.get('/', async (req, res, next) => {
      if(!req.user) return;
      const count = req.query.count ? parseInt(req.query.count as string) : 10; // default to send 10 groups if no count
      try {
        const groups = await getConnection()
          .createQueryBuilder()
          .limit(count)
          .orderBy("groups.updated", "DESC")
          .relation(UserEntity, "groups")
          .of(req.user.id)
          .loadMany();

        res.json(groups);
        
      } catch(err) {
        next(err);
      }
    });
  }
}