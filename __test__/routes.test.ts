import { Server } from 'http';
import supertest from 'supertest';
import { DBConnect } from './connection';
import { App } from '../src/app';
import jwt_decode from 'jwt-decode';
import { UserEntity } from '../src/entity/user';

interface testUserInterface {
  name: string;
  username: string;
  password: string;
  jwt: string;
  id: number;
}

interface testJWTUserInterface {
  id: number;
  username: string;
}

interface jwtContentInterface{
  user: testJWTUserInterface;
  iat: number;
}

describe('Testing API Routes', () => {
  const testUsers: Array<testUserInterface> = [
    {
      name: "Test User 0",
      username: "test" + Math.floor(Math.random() * Math.floor(9999)),
      password: "test123",
      jwt: "",
      id: 0,
    },{
      name: "Test User 1",
      username: "test" + Math.floor(Math.random() * Math.floor(9999)),
      password: "test123",
      jwt: "",
      id: 0,
    },{
      name: "Test User 2",
      username: "test" + Math.floor(Math.random() * Math.floor(9999)),
      password: "test123",
      jwt: "",
      id: 0,
    }
  ];

  const app = new App();
  let server: Server;
  let conn = new DBConnect();
  
  beforeAll(async (done)=>{
    await conn.create();

    server = app.createWebsocketServer();
    server.listen(done);
  });

  afterAll((done) => {
    server.close( async () => {
      // await conn.dropTables();
      await conn.close();
      done();
    })
  });

  test("GET /", async () => {
    await supertest(server) 
      .get("/")
      .expect(200)
      .then((res) => {
        expect(res.body.message).toBe("hello world");
      });
  });

  // register three test users
  test("POST /api/auth/register: register 3 test users", async () => {
    let testUser: testUserInterface;
    for (testUser of testUsers){
      try{
        await supertest(server)
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
    let testUser: testUserInterface;
    for (testUser of testUsers){
      try {
        await supertest(server)
          .post("/api/auth/login")
          .send(testUser)
          .expect(200)
          .then((res) => {
            testUser.jwt = res.body;
            let decode = jwt_decode(testUser.jwt) as jwtContentInterface;
            let jwtUser = decode.user as testJWTUserInterface;

            testUser.id = jwtUser.id;
            expect(testUser.id).toBeGreaterThan(0);
            expect(jwtUser.username).toBe(testUser.username);
          });
      } catch(err) {
        console.error(err);
      }
    }
  });

  test("POST /api/friend: testUsers[0] adds testUsers[1] and testUsers[2] as friends", async () => {
    await supertest(server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .send({friendId: testUsers[1].id})
      .expect(200);
    await supertest(server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .send({friendId: testUsers[2].id})
      .expect(200);
  });

  test("DELETE /api/friend: testUsers[0] removes testUsers[2] as friend", async () => {
    await supertest(server)
      .delete("/api/friend")
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .send({friendId: testUsers[2].id})
      .expect(200);
  });

  test("POST /api/friend: testUsers[0] tries to add themself as a friend", async () => {
    await supertest(server)
      .post("/api/friend")
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .send({friendId: testUsers[0].id})
      .expect(400);
  });

  test("POST /api/friend: testUsers[0] tries to remove testUsers[2] as friend when not friends", async () => {
    await supertest(server)
      .delete("/api/friend")
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .send({friendId: testUsers[2].id})
      .expect(400);
  });

  test("GET /api/friend: get friends of testUsers[0]", async () => {
    await supertest(server)
      .get('/api/friend')
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .expect(200)
      .then((res) => {
        console.log(JSON.stringify(res.body, null,2));
        expect(res.body.friends.length).toBe(1);
        expect(res.body.id).toBe(testUsers[0].id);
        expect(res.body.name).toBe(testUsers[0].name);
        expect(res.body.username).toBe(testUsers[0].username);
      });
  })

  test("POST /api/group: testUsers[0] creates a new group with all 3 testUsers", async () => {
    let userId: Array<number> = [];
    for(let testUser of testUsers){
      userId.push(testUser.id);
    }
    await supertest(server)
      .post('/api/group')
      .set('Authorization', 'bearer ' + testUsers[0].jwt)
      .send({userId: userId})
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(userId.length);
        expect(res.body.name).toBeNull();
      });
  })

});