import supertest from 'supertest';
import { JwtUserInterface, jwtToJwtUser } from '../../src/auth/jwt';
import { TestSetup } from '../setup';

describe('Testing API Routes', () => {

  const runner = new TestSetup();
  
  beforeAll(async (done)=>{
    runner.buildUp(done);
  });

  afterAll((done) => {
    runner.tearDown(done, true);
  });

  test("GET /", async () => {
    await supertest(runner.server) 
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.body.message).toBe("hello world");
      });
  });

  // register three test users
  test("POST /api/auth/register: register all test users", async () => {
    for (let testUser of runner.testUsers){
      try{
        await supertest(runner.server)
          .post("/api/auth/register")
          .send(testUser)
          .expect(200)
          .then((res) => {
            expect(res.body.message).toBe("Registration successful");
          });
      } catch(error) {
        console.error(error);
      }
    }
  });

  // login all three users to obtain id and jwt
  test("POST /api/auth/login: login 3 test users", async () => {
    for (let testUser of runner.testUsers){
      try {
        await supertest(runner.server)
          .post("/api/auth/login")
          .send(testUser)
          .expect(200)
          .then((res) => {
            testUser.jwt = res.body;

            const jwtUser: JwtUserInterface = jwtToJwtUser(testUser.jwt);

            testUser.id = jwtUser.id;
            expect(testUser.id).toBeGreaterThan(0);
            expect(jwtUser.username).toBe(testUser.username);
          });
      } catch(err) {
        console.error(err);
      }
    }
  });

  test("POST /api/friend: runner.testUsers[0] adds runner.testUsers[1] and runner.testUsers[2] as friends", async () => {
    await supertest(runner.server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[1].id})
      .expect(200);
    await supertest(runner.server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[2].id})
      .expect(200);
  });

  test("DELETE /api/friend: runner.testUsers[0] removes runner.testUsers[2] as friend", async () => {
    await supertest(runner.server)
      .delete("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[2].id})
      .expect(200);
  });

  test("POST /api/friend: runner.testUsers[0] tries to add themself as a friend", async () => {
    await supertest(runner.server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[0].id})
      .expect(400);
  });

  test("POST /api/friend: runner.testUsers[0] tries to remove runner.testUsers[2] as friend when not friends", async () => {
    await supertest(runner.server)
      .delete("/api/friend")
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({friendId: runner.testUsers[2].id})
      .expect(400);
  });

  test("GET /api/friend: get friends of runner.testUsers[0]", async () => {
    await supertest(runner.server)
      .get('/api/friend')
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .expect(200)
      .then((res) => {
        expect(res.body.friends.length).toBe(1);
        expect(res.body.id).toBe(runner.testUsers[0].id);
        expect(res.body.name).toBe(runner.testUsers[0].name);
        expect(res.body.username).toBe(runner.testUsers[0].username);
      });
  })

  test("POST /api/group: runner.testUsers[0] creates a new group with all 3 runner.testUsers", async () => {
    let userId: Array<number> = [];
    for(let testUser of runner.testUsers){
      userId.push(testUser.id);
    }
    await supertest(runner.server)
      .post('/api/group')
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .send({userId: userId})
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(userId.length);
        expect(res.body.name).toBeNull();
      });
  })

  test("GET /api/group: get the latest 5 groupIds for runner.testUsers[0]", async () => {
    const count = 5;
    await supertest(runner.server)
      .get('/api/group')
      .set('Authorization', 'bearer ' + runner.testUsers[0].jwt)
      .query({count: count})
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBeLessThanOrEqual(count);
      })
  })

});