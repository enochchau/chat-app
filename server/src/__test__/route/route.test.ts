// These tests have to run sequentially to properly create and use users.
import request from 'supertest';
import { JwtUserInterface, jwtToJwtUser } from '../../auth/jwt';
import { RouteSetup } from './setup';

describe('Testing API routes', () => {

  const runner = new RouteSetup(5);
  
  beforeAll((done)=>{
    runner.buildUp(done, false);
  });

  afterAll((done) => {
    runner.tearDown(done, false);
  });

  test("GET /", async () => {
    await request(runner.server) 
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.body.message).toBe("hello world");
      });
  });

//----- AUTH -----//
  // register all test users
  test("POST /api/auth/register: register all test users", async () => {
    for (let testUser of runner.testUsers){
      try{
        await request(runner.server)
          .post("/api/auth/register")
          .send(testUser)
          .expect(200)
          .then((res) => {
            expect(res.body.message).toBe("Registration successful.");
          });
      } catch(error) {
        console.error(error);
      }
    }
  });

  // login all users to obtain id and jwt
  test("POST /api/auth/login: login all test users", async () => {
    for (let testUser of runner.testUsers){
      try {
        await request(runner.server)
          .post("/api/auth/login")
          .send(testUser)
          .expect(200)
          .then((res) => {
            testUser.jwt = res.body.token;

            const jwtUser = jwtToJwtUser(testUser.jwt);
            expect(jwtUser).toBeTruthy();
            if(!jwtUser) return;

            testUser.id = jwtUser.id;
            expect(testUser.id).toBeGreaterThan(0);
            expect(jwtUser.email).toBe(testUser.email);
          });
      } catch(err) {
        console.error(err);
      }
    }
  });

// ------ FRIENDS ----- //

  test("POST /api/friend: runner.testUsers[0] adds runner.testUsers[1] and runner.testUsers[2] as friends", async () => {
    await request(runner.server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[1].id})
      .expect(200);
    await request(runner.server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[2].id})
      .expect(200);
  });

  test("DELETE /api/friend: runner.testUsers[0] removes runner.testUsers[2] as friend", async () => {
    await request(runner.server)
      .delete("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[2].id})
      .expect(200);
  });

  test("POST /api/friend: runner.testUsers[0] tries to add themself as a friend", async () => {
    await request(runner.server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[0].id})
      .expect(400);
  });

  test("POST /api/friend: runner.testUsers[0] tries to remove runner.testUsers[2] as friend when not friends", async () => {
    await request(runner.server)
      .delete("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[2].id})
      .expect(400);
  });

  test("GET /api/friend: get friends of runner.testUsers[0]", async () => {
    await request(runner.server)
      .get('/api/friend')
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .expect(200)
      .then((res) => {
        expect(res.body.friends.length).toBe(1);
        expect(res.body.id).toBe(runner.testUsers[0].id);
        expect(res.body.name).toBe(runner.testUsers[0].name);
        expect(res.body.email).toBe(runner.testUsers[0].email);
      });
  });

// ----- GROUPS ------ //

  test("POST /api/group: testUsers[0] creates 4 new group with testUsers[1:4]", async () => {
    for(let i=1; i<runner.testUsers.length; i++){
      let userId: Array<number> = [runner.testUsers[0].id, runner.testUsers[i].id];

      await request(runner.server)
        .post('/api/group')
        .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
        .send({userIds: userId, groupName: "test group"})
        .expect(200)
        .then((res) => {
          expect(res.body.users.length).toBe(userId.length);
          expect(res.body.name).toBe("test group");
        });
    }
  });

  test("GET /api/group: get the latest 3 groupIds for runner.testUsers[0]", async () => {
    const count = 3;
    const date = new Date();
    await request(runner.server)
      .get('/api/group')
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .query({count: count, date: date}) 
      .expect(200)
      .then((res) => {
        console.log(res.body);
        // check the count
        expect(res.body.length).toBeLessThanOrEqual(count);
        // check the timestamps
        res.body.forEach((group: any) => {
          expect(new Date(group.updated).getTime()).toBeLessThanOrEqual(date.getTime());
        })
      })
  });

});