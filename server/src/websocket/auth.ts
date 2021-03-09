import { UserEntity } from '../entity/user';
import { GroupEntity } from '../entity/group';

export class WsGroupAuthenticator{
  static async verifyInDatabase(userId: number, groupId: number): Promise<boolean>{
    const user = await UserEntity.findOne({
      where: {id: userId},
    });
    const group = await GroupEntity.findOne({
      where: {id: groupId},
      relations: ["users"]
    })
    if(!user || !group){
      return false;
    }
    return WsGroupAuthenticator.findUserInGroup(user.id, group);
  }

  private static findUserInGroup(userId: number, group:GroupEntity): boolean{
    for(let user of group.users){
      if (user.id === userId) return true;
    }
    return false;
  }
}