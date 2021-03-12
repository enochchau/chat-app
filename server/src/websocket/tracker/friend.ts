import { IdWebsocket } from './idwebsocket';

export class ActiveFriends{
  private activeFriendMap: Map<string, Array<IdWebsocket>> = new Map();

  constructor(pairArray?: Array<IdWebsocket>){
    if(pairArray){
      pairArray.forEach((pair) => {
        this.add(pair);
      });
    }
  }

  public add(userIdWs: IdWebsocket, friendId: number){

    const currentKey = this.createKey(userIdWs.id, friendId);

    // see if these two friends are already active
    if (!this.find(userIdWs.id, friendId)){
      // create a new friend chat room
      this.activeFriendMap.set(currentKey, [userIdWs]);
      return true;
    } else {
      // add the user to the existing chat room
      const existingChatRoom = this.get(userIdWs.id, friendId);

      if(existingChatRoom.length < 2) {
        existingChatRoom.push(userIdWs);
        this.activeFriendMap.set(currentKey, existingChatRoom);
        return true;
      }
    }
    return false;
  }

  public get(userId1: number, userId2: number): undefined | IdWsPair{
    return this.find(userId1, userId2);
  }

  public has(userId1: number, userId2: number): boolean{
    return Boolean(this.find(userId1, userId2));
  }

  get size(){
    return this.activeFriendMap.size;
  }

  private find(userId1: number, userId2: number){
    const combination1 = this.createKey(userId1, userId2);
    const combination2 = this.createKey(userId2, userId1);
    return this.activeFriendMap.get(combination1) || this.activeFriendMap.get(combination2);
  }

  private createKey(userId1: number, userId2: number){
    return `${userId1}&${userId2}`;
  }
}