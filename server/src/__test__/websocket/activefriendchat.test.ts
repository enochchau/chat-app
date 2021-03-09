import { ActiveFriends} from '../../websocket/tracker/friend';
import { IdWsPair, IdWebsocket } from '../../websocket/tracker/idwebsocket';
import WebSocket from 'ws';
jest.mock('ws');

describe('Testing ActiveFriends tracker', () => {
  let activeFriendChat: ActiveFriends;
  // make some fake data
  let idWsArr: Array<IdWebsocket>;
  let idWsPairArr: Array<IdWsPair>;
  const SIZE = 10;

  beforeAll(() => {
    const fakeUrl = 'ws://localhost:8080';
    let fakeWs = new WebSocket(fakeUrl);
    idWsArr = new Array();
    for(let i=0; i<SIZE; i++){
      idWsArr.push({id: i, ws: fakeWs});
    }

    idWsPairArr = idWsArr.reduce((pairArr, idWs, index) => {
      if(index !== 0 && index !== SIZE-1){
        pairArr.push([idWsArr[0], idWs]);
      }
      return pairArr;
    }, new Array() as Array<IdWsPair>);
  });

  test("Contructor", () => {
    activeFriendChat = new ActiveFriends(idWsPairArr);
    expect(activeFriendChat.size).toBe(SIZE-2);
  });

  test("add a new pair", () => {
    let extraIdWsPair: IdWsPair = [idWsArr[0], idWsArr[SIZE-1]];
    const addResult = activeFriendChat.add(extraIdWsPair);

    expect(activeFriendChat.size).toBe(SIZE-1);
    expect(addResult).toBe(true);
  });

  test("add [0] and itself", () => {
    let selfPair: IdWsPair = [idWsArr[0], idWsArr[0]];
    const addResult = activeFriendChat.add(selfPair);
    expect(addResult).toBe(false);
  })

  test('get pair [0] and [9]', () => {
    const userId1 = 0;
    const userId2 = 9;
    const testPair = activeFriendChat.get(userId1,userId2);
    expect(testPair).toBeTruthy();
    // just type script things idk
    if(!testPair) return;
    expect(testPair[0].id).toBe(userId1);
    expect(testPair[1].id).toBe(userId2);
    expect(testPair[0].ws).toBeTruthy;
    expect(testPair[1].ws).toBeTruthy;
  });

  test('check if it has [0] and [2]', () => {
    const testPair = activeFriendChat.has(2,0);
    expect(testPair).toBe(true);
  });

  test('check if that it doesn\'t have [0] and [10]', () => {
    const testPair = activeFriendChat.has(10,0);
    expect(testPair).toBe(false);
  });

});