import express from 'express';
import { GroupEntity } from '../entity/group';
import { UserEntity } from '../entity/user';

export class GroupRouter {
  public router = express.Router();

  constructor(){
    this.postNewGroup();
  }

  private postNewGroup(){
    this.router.post("/", async (req, res, next) => {
      if (!req.body.userId || req.body.userId.length < 1) return res.sendStatus(400);
      const userIds = req.body.userId as Array<number>; 

      try {
        const users: Array<UserEntity> = await UserEntity.findByIds(userIds);
        // check that all the users exist
        if (users.length !== userIds.length) return res.sendStatus(400);

        const group = await GroupEntity.createGroupWithUsers(users, req.body.groupName ? req.body.groupName: null);

        res.sendStatus(200);
      } catch(err) {
        next(err);
      }
      
    })
  }
}