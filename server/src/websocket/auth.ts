import { UserEntity } from '../entity/user';

export class WsAuthenticator{
  static async verifyGroup(userId: number, groupId: number): Promise<boolean>{
    const user = await UserEntity.findOne({
      where: {id: userId},
      relations: ["groups"]
    });

    if (user){
      if(this.findGroupInUserGroups(user, groupId)){
        return true;
      }
    }
    return false;
  }

  private static findGroupInUserGroups(user: UserEntity, groupId: number): boolean {
    user.groups.forEach((group) => {
      if(group.id === groupId) return true;
    });
    return false;
  }

  static async verifyFriend(userId: number, friendId: number): Promise<boolean> {
    const friendStatus = await UserEntity.areFriends(userId, friendId);
    return friendStatus;
  }
}