import { IdWsPair } from './idwebsocket';

export class ActiveFriendChat{
  private activeFriendMap: Map<string, IdWsPair> = new Map();

  constructor(pairArray?: Array<IdWsPair>){
    if(pairArray){
      pairArray.forEach((pair) => {
        this.add(pair);
      });
    }
  }

  public add(newPair: IdWsPair){
    if(newPair[0].id === newPair[1].id) return false;

    if (!this.find(newPair[0].id, newPair[1].id)){
      const currentKey = this.createKey(newPair[0].id, newPair[1].id);
      this.activeFriendMap.set(currentKey, newPair);
      return true;
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