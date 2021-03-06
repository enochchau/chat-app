import express, { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../entity/user';


export class FriendRouter {
  public router = express.Router();

  constructor(){
    this.postFriend();
    this.deleteFriend();
    this.getFriends();
  }

  private postFriend(){
    // adds a friend if two users are not already friends
    this.router.post("/", (req, res, next) => {
      this.friendRequestHandler(req, res, next, false, UserEntity.addFriend);
    });
  }

  private deleteFriend(){
    // removes a friend if two users are already friends
    this.router.delete("/", (req, res, next) => {
      this.friendRequestHandler(req, res, next, true, UserEntity.removeFriend);
    })
  }

  private getFriends(){
    this.router.get("/", async (req, res, next) => {
      if(!req?.user?.id) return res.sendStatus(400);
      try {
        const user = await UserEntity.findOne({
          where: {id: req.user.id},
          relations: ["friends"]
        });

        if (!user) return res.sendStatus(400);

        res.json(user);
      } catch (err) {
        next(err);
      }

      
    })
  }
  
  private async friendRequestHandler(req: Request, res: Response, next: NextFunction, friendshipStatus: boolean, action:(user: UserEntity, friend: UserEntity) => Promise<UserEntity>){
    if (!req?.user?.id || !req.body.friendId) return res.sendStatus(400);
    const friendId = parseInt(req.body.friendId);
    // can't add yourself
    if (req.user.id === friendId) return res.sendStatus(400);

    try {
      // look up both user and friend
      const users = await UserEntity
        .find({
          where: [
            {id: req.user.id},
            {id: friendId}
          ],
          order: {
            id: "ASC"
          },
          relations: ["friends"]
        });
      
      // check that they both exist
      if (users.length !== 2) return res.sendStatus(400);

      let user: UserEntity = users[req.user.id > friendId ? 1 : 0];
      let friend: UserEntity = users[req.user.id > friendId ? 0 : 1];
      
      let alreadyFriends = false;
      for(let test of user.friends){
        if(test.id === friend.id){
          alreadyFriends = true;
          break;
        }
      }

      // check if already friends
      if (alreadyFriends !== friendshipStatus) return res.sendStatus(400);

      // do some action with friendship
      await action(user, friend);
      
      res.sendStatus(200);

    } catch(err) {
      next(err);
    }
  }
}