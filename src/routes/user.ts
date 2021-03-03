import express, { NextFunction, Request, Response } from 'express';
import { getRepository } from "typeorm";
import { User } from '../entity/user';


class UserRouter {
  public router = express.Router();
  private userRepository = getRepository(User);

  constructor(){
    this.router.post("/", (req, res, next) => {
      this.friendRequestHandler(req, res, next, this.addFriend);
    });

    this.router.delete("/", (req, res, next) => {
      this.friendRequestHandler(req, res, next, this.removeFriend);
    })

  }
  
  // check if two users are friends
  private async areFriends(userId: number, friendId: number): Promise<boolean> {
    const areFriends = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.friends", "friend")
      .where("user.id = :userId", {userId: userId})
      .andWhere("friend.id = :friendId", {friendId: friendId})
      .getCount();
    
    console.log(userId, friendId, areFriends);
    
    return Boolean(areFriends);
  }

  // add a friendship to a user
  private async addFriend(userId: number, friendId: number){
    await this.userRepository
      .createQueryBuilder()
      .relation(User, "friends")
      .of(userId)
      .add(friendId);
  }
  
  private async removeFriend(userId: number, friendId: number){
    await this.userRepository
      .createQueryBuilder()
      .relation(User, "friends")
      .of(userId)
      .remove(friendId);
  }

  private async friendRequestHandler(req: Request, res: Response, next: NextFunction, action:(userId: number, friendId: number) => Promise<void>){
    if (!req?.user?.id || !req.body.friendId) return res.sendStatus(400);
    const friendId = parseInt(req.body.friendId);
    // can't add yourself
    if (req.user.id === friendId) return res.sendStatus(400);

    try {
      // check if the current user exists
      const user = await this.userRepository.findOne({where: {id: req.user.id}});
      if (!user) return res.sendStatus(400);
      // check if the friend exists
      const friend = await this.userRepository.findOne({where: {id: friendId}});
      if (!friend) return res.sendStatus(400);

      // check if already friends
      const alreadyFriends = await this.areFriends(req.user.id, friendId);
      if (alreadyFriends) return res.sendStatus(400);

      // do some action with friendship
      await action(req.user.id, friendId);
      
      res.sendStatus(200);

    } catch(err) {
      next(err);
    }
  }
}

export default UserRouter;