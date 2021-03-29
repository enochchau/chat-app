import express from 'express';
import { GroupEntity } from '../entity/group';
import { GroupMessageView } from '../entity/groupMessage';
import { UserEntity } from '../entity/user';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export class GroupRouter {
  public router = express.Router();

  constructor(){
    this.postNewGroup();
    this.getGroupsForUser();
    this.patchLeaveGroup();
    this.patchAddToGroup();
    this.getGroupWithUsers();
  }

  private postNewGroup(){
    const NewGroupReq = t.type({
      userIds: t.array(t.number),
      groupName: t.string,
    });
    type NewGroupReq = t.TypeOf<typeof NewGroupReq>;

    this.router.post("/", (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.status(400).json(errors);
      const onRight = async (body: NewGroupReq) => {
        if(!req.user) return res.sendStatus(400);
        const userIds = body.userIds;        
        userIds.push(req.user.id);
        // check if the group already exists
        try {
          const existingGroupId = await GroupEntity.doesGroupExist(userIds);
          if(existingGroupId !== -1) {
            const existingGroup = await GroupEntity.findOne({where: {id: existingGroupId}});
            return res.json(existingGroup);
          }
        } catch (err) { 
          next(err); 
        }
        // else create the group
        try {
          const users: Array<UserEntity> = await UserEntity.findByIds(userIds);
          if(users.length !== userIds.length) return res.json({message: "Some users where not found."});
          
          // if all users are found
          let group = await GroupEntity.createGroupWithUsers(users, body.groupName);
          res.json(group);
        } catch(err) {
          next(err);
        }
      }

      pipe(NewGroupReq.decode(req.body), fold(onLeft, onRight));
    });
  }
  
  private getGroupsForUser(){
    // query parameters
    const GetGroupsReq = t.type({
      count: tt.NumberFromString,
      date: tt.DateFromISOString,
    });
    type GetGroupsReq = t.TypeOf<typeof GetGroupsReq>;
    const COUNTMAX = 200;
    const countMaxLimiter = (count: number) => count > COUNTMAX ? COUNTMAX : count;

    this.router.get('/', async (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.status(400).json(errors);

      const onRight = async (query: GetGroupsReq) => {
        if(!req.user) return res.sendStatus(400); // theoretically this should never happen b/c it's caught by passport

        query.count = countMaxLimiter(query.count);

        try{

          const groups = await GroupMessageView.findRecentByUserId(req.user.id, query.count, query.date);

          // put all the null timestamps at the bottom
          // then sort by youngest to oldest
          const cmp = (a: GroupMessageView, b: GroupMessageView) => {
            const aCmp = a.lastTimestamp;
            const bCmp = b.lastTimestamp;
            if(!aCmp || !bCmp) return -1;
            if(aCmp > bCmp) return -1;
            if(bCmp > aCmp) return 1;
            return 0;
          }
          groups.sort(cmp);

          if(!groups) return res.sendStatus(400);

          res.json(groups);
        } catch(err) {
          next(err);
        }
      }
      pipe(GetGroupsReq.decode(req.query), fold(onLeft, onRight));
    });
  }

  private patchLeaveGroup(){
    const PatchLeaveReq = t.type({
      groupId: t.number
    });
    type PatchLeaveReq = t.TypeOf<typeof PatchLeaveReq>;

    const removeUserFromGroup = (userId: number, group:GroupEntity): boolean => {
      const index = GroupEntity.getUserIndexInGroup(userId, group);
      if(index !== -1){
        group.users.splice(index, 1);
        return true;
      }
      return false;
    }

    this.router.patch('/leave', async (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.sendStatus(400);
      const onRight = async (body: PatchLeaveReq) => {
        try{
          if(!req.user) return res.sendStatus(400);

          const group = await GroupEntity.findOne({where: {id: body.groupId}, relations: ["users"]});

          if(!group) return res.sendStatus(400);
          
          if(!removeUserFromGroup(req.user.id, group)) return res.sendStatus(400);

          await GroupEntity.save(group);

          res.sendStatus(200);
        } catch(error) {
          next(error);
        }
      }
      pipe(PatchLeaveReq.decode(req.body), fold(onLeft, onRight));
    });
  }

  private patchAddToGroup(){
    const PatchAddReq = t.type({
      userId: t.number,
      groupId: t.number,
    });
    type PatchAddReq = t.TypeOf<typeof PatchAddReq>;

    this.router.patch("/add", (req, res, next) => {
      const onLeft = async (errors: t.Errors) => res.sendStatus(400);
      const onRight = async (body: PatchAddReq) => {
        const createCheckIdArr = (group: GroupEntity, userId: number) => {
          const arr = group.users.reduce((acc, user) => {
            acc.push(user.id);
            return acc;
          }, new Array() as Array<number>);
          arr.push(userId);
          return arr;
        }

        try{
          if(!req.user) return res.sendStatus(400);

          const group = await GroupEntity.findOne({where: {id: body.groupId}, relations: ["users"]});
          if(!group) return res.sendStatus(400);
          
          // is the user already in the group?
          if (GroupEntity.isUserInGroup(req.user.id, group)) return res.sendStatus(400);
          // does the user exist? 
          const user = await UserEntity.findOne({where: {id: req.user.id}});
          if(!user) return res.sendStatus(400);
          
          // check if we added this user, then would it create a group that already exists
          let checkIds = createCheckIdArr(group, body.userId);
          const existingGroupId = await GroupEntity.doesGroupExist(checkIds);
          if(existingGroupId !== -1){
            const existingGroup = await GroupEntity.findOne({where: {id: existingGroupId}});
            return res.json(existingGroup);
          }
          
          group.users.push(user);
          const reGroup = await GroupEntity.save(group);

          return res.send(reGroup);
        } catch(error) {
          next(error);
        }
      }

      pipe(PatchAddReq.decode(req.body), fold(onLeft, onRight));
    });
  }

  private getGroupWithUsers(){
    const Query = t.type({
      groupId: tt.IntFromString,
    });
    type Query = t.TypeOf<typeof Query>;

    this.router.get("/single", (req, res, next) => {

      const onLeft = async (errors: t.Errors) => {
        return res.status(400).json(errors);
      }

      const onRight = async (query: Query) => {

        const replaceGroupName = (group: GroupEntity, currentUserId: number): void => {
          for(let user of group.users){
            if(user.id !== currentUserId){
              group.name = user.name;
              return; 
            }
          }
        }

        try{
          const group = await GroupEntity.findOne({where: {id: query.groupId}, relations: ['users']});
          
          if(!group) return res.sendStatus(400);

          if(group.users.length === 2 && req.user){
            replaceGroupName(group, req.user.id);
          }

          res.json(group);
        } catch(error) {
          next(error);
        }
      }

      pipe(Query.decode(req.query), fold(onLeft, onRight));
    })
  }

}