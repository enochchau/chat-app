import { MsgFriendEntity } from '../../entity/msgfriend';
import { GroupEntity } from '../../entity/group';
import { UserEntity } from '../../entity/user';
import { MsgGroupEntity } from '../../entity/msggroup';
import { DBConnect } from '../connection';

interface TestUser {
  name: string;
  username: string;
  password: string
  id: number;
}

describe ('Testing Database Entities', () =>  {
  const dbconnector = new DBConnect();
  let testUsers: TestUser[] = [];
  const SIZE = 10;

  for(let i=0; i<SIZE; i++){
    testUsers.push({
      name: `Test User ${i}`,
      username: `testuser${i}`,
      password: 'password',
      id: -1,
    });
  }

  beforeAll(async ()=>{
    await dbconnector.create('postgres');
    // sqlite doesn't use the same truncate table syntax
    // plus we don't need to truncate tables in sqlite
    await dbconnector.truncateTables();
    await dbconnector.close();
  })
  beforeEach(async () => {
    await dbconnector.create('postgres');
  });

  afterEach(async() => {
    await dbconnector.close();
  });

  test("UserEntity: add new users", async () => {
    for(let testUser of testUsers){
      const user = new UserEntity();
      user.name = testUser.name;
      user.username = testUser.username;
      user.password = testUser.password;
      await UserEntity.save(user);
    }

    const allUsers = await UserEntity.find();
    expect(allUsers.length).toBe(SIZE);
    allUsers.forEach((user, index) => {
      expect(user.id).toBeGreaterThan(0);
      expect(user.name).toBe(testUsers[index].name);
      expect(user.username).toBe(testUsers[index].username);
      testUsers[index].id = user.id;
    });

  });

  test('UserEntity: add friendship between testUser0 and testUser1 by Object', async () => {
    const user0 = await UserEntity.findOneByUsername(testUsers[0].username, ['friends']);
    const user1 = await UserEntity.findOneByUsername(testUsers[1].username, ['friends']);

    expect(user0).toBeTruthy();
    expect(user1).toBeTruthy();
    if(!user0 || !user1) return;

    await UserEntity.addFriend(user0, user1);
    await UserEntity.addFriend(user1, user0);

    const reuser0 = await UserEntity.findOneByUsername(testUsers[0].username, ['friends']);
    const reuser1 = await UserEntity.findOneByUsername(testUsers[1].username, ['friends']);
    expect(reuser0).toBeTruthy();
    expect(reuser1).toBeTruthy();
    if(!reuser0 || !reuser1) return;

    expect(reuser0.friends.length).toBe(1);
    expect(reuser1.friends.length).toBe(1);
    expect(reuser0.friends[0].id).toBe(reuser1.id);
    expect(reuser1.friends[0].id).toBe(reuser0.id);
  });

  test('UserEntity: add friendship between testUser0 and testUser2 by Id', async () => {
    await UserEntity.addFriendById(testUsers[0].id, testUsers[2].id);
    await UserEntity.addFriendById(testUsers[2].id, testUsers[0].id);
    
    const user0 = await UserEntity.findOneByUsername(testUsers[0].username, ['friends']);
    const user2 = await UserEntity.findOneByUsername(testUsers[2].username, ['friends']);
  });

  test('MsgFriendEntity: add a new message between testUser0 and testUser1', async () => {
    const user0 = await UserEntity.findOneByUsername(testUsers[0].username);
    const user1 = await UserEntity.findOneByUsername(testUsers[1].username);
    expect(user0).toBeTruthy();
    expect(user1).toBeTruthy();
    if(!user0 || !user1) return;
    const message = "hello there!";

    const remsg = await MsgFriendEntity.addMessage(user0.id, user1.id, message);
    expect(remsg.message).toBe(message);
    expect(remsg.user1Id).toBe(user0.id);
    expect(remsg.user2Id).toBe(user1.id);
  });

  test("MsgFriendEntity: find messages between ")

  test("GroupEntity: create a new group between testUsers 0,1,2", async () => {
    const users = await UserEntity.findByIds([testUsers[0].id, testUsers[1].id, testUsers[2].id]);

    const group = await GroupEntity.createGroupWithUsers(users, "Group1");

    expect(group).toBeTruthy();
    if(!group) return;
    expect(group.users).toBe(users);
  });

  test("MsgGroupEntity: add a new message to the group created in the last test", async () => {
    const groups = await GroupEntity.find();
    const msgstring = "test group message";
    const message = await MsgGroupEntity.addMessage(groups[0].id, msgstring);
    expect(message.message).toBe(msgstring);
    expect(message.groupId).toBe(groups[0].id);
  });


});