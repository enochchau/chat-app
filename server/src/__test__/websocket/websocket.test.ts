import request from 'superwstest';
import { JwtUserInterface, jwtToJwtUser } from '../../auth/jwt';
import { ServerSetup } from '../server';

class WsSetup extends ServerSetup{

  constructor(numberOfTestUsers: number, random: boolean = false){
    super(numberOfTestUsers, random);
  }

  public async buildUp(cb: () => void, truncateTables: boolean = false){
    await this.connection.create('postgres');
    if (truncateTables) await this.connection.truncateTables();
    this.server = this.app.createWebsocketServer();
    this.server.listen(cb)
  }

  public tearDown(cb: () => void, dropTables:boolean = false){
    this.server.close(async () => {
      if(dropTables) await this.connection.dropTables();
      await this.connection.close();
      cb;
    })
  }
}

describe("Chat Websocket", () => {
  const runner = new WsSetup(2);
  let groupId: number;

  beforeAll(async (done) => {
    runner.buildUp(done);
  });

  afterAll(async (done) => {
    runner.tearDown(done);
  });

  test("register 2 users", async () =>{
    for (let testUser of runner.testUsers){
      await request(runner.server)
        .post("/api/auth/register")
        .send(testUser)
        .expect(200)
        .then((res) => {
          expect(res.body.message).toBe("Registration successful.");
        });
    }
  });

  // login all users to obtain id and jwt
  test("login 2 test users", async () => {
    for (let testUser of runner.testUsers){
      await request(runner.server)
        .post("/api/auth/login")
        .send(testUser)
        .expect(200)
        .then((res) => {
          testUser.jwt = res.body.token;

          const jwtUser: JwtUserInterface = jwtToJwtUser(testUser.jwt);

          testUser.id = jwtUser.id;
          expect(testUser.id).toBeGreaterThan(0);
          expect(jwtUser.email).toBe(testUser.email);
        });
    }
  });

  test('create a group between the 2 users', async () => {
    for(let i=1; i<runner.testUsers.length; i++){
      let userId: Array<number> = [runner.testUsers[0].id, runner.testUsers[i].id];

      await request(runner.server)
        .post('/api/group')
        .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
        .send({userIds: userId, groupName: "test group"})
        .expect(200)
        .then((res) => {
          groupId = res.body.id;
          expect(res.body.users.length).toBe(userId.length);
          expect(res.body.name).toBe("test group");
        });
    }
  })

  test("WS: /chat authenticate testUser0 at the websocket ", async () => {
    await request(runner.server)
      .ws("/chat")
      .send(JSON.stringify({
        topic: "auth",
        payload: {
          timestamp: new Date(),
          groupId: 1,
          token: runner.testUsers[0].jwt
        }
      }))
      .expectJson((actual) => (
        actual.topic === "okay"
        && actual.payload.message === "valid token"
      ));
  });

  test("WS: /chat have testUser0 chat (ping pong test)", async () => {
    await request(runner.server)
      .ws('/chat')
      .send(JSON.stringify({
        topic: "auth",
        payload: {
          timestamp: new Date(),
          groupId: 1,
          token: runner.testUsers[0].jwt
        }
      }))
      .expectJson((actual) => (
        actual.topic === "okay"
        && actual.payload.message === "valid token"
      ))
      .send(JSON.stringify({
        topic:"chat",
        payload: {
          timestamp: new Date(),
          groupId: 1,
          message: "hello there!",
          userId: runner.testUsers[0].id
        }
      }))
      .expectJson((actual) => (
        actual.topic === "chat" && 
        actual.payload.timestamp && 
        actual.payload.message === "hello there!" && 
        actual.payload.groupId === 1 && 
        actual.payload.userId === runner.testUsers[0].id &&
        actual.payload.id === 1 &&
        actual.payload.created && 
        actual.payload.updated
      ));
  })
});