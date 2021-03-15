import { GroupEntity } from '../../entity/group';
import { UserEntity } from '../../entity/user';
import { MessageEntity} from '../../entity/message';
import { DBConnect } from '../connection';

interface TestUser {
  name: string;
  email: string;
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
      email: `testuser${i}@test.com`,
      password: 'password',
      id: -1,
    });
  }

  beforeAll(async ()=>{
    await dbconnector.create('postgres');
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
      user.email = testUser.email;
      user.password = testUser.password;
      await UserEntity.save(user);
    }

    const allUsers = await UserEntity.find();
    expect(allUsers.length).toBe(SIZE);
    allUsers.forEach((user, index) => {
      expect(user.id).toBeGreaterThan(0);
      expect(user.name).toBe(testUsers[index].name);
      expect(user.email).toBe(testUsers[index].email);
      testUsers[index].id = user.id;
    });

  });

  test('UserEntity: add friendship between testUser0 and testUser1 by Object', async () => {
    const user0 = await UserEntity.findOne({where: {email: testUsers[0].email}, relations:  ['friends']});
    const user1 = await UserEntity.findOne({where: {email: testUsers[1].email}, relations: ['friends']});

    expect(user0).toBeTruthy();
    expect(user1).toBeTruthy();
    if(!user0 || !user1) return;

    await UserEntity.addFriend(user0, user1);
    await UserEntity.addFriend(user1, user0);

    const reuser0 = await UserEntity.findOne({where: {email:testUsers[0].email}, relations: ['friends']});
    const reuser1 = await UserEntity.findOne({where: {email:testUsers[1].email}, relations: ['friends']});
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
    
    const user0 = await UserEntity.findOne({where: {email:testUsers[0].email}, relations: ['friends']});
    const user2 = await UserEntity.findOne({where: {email:testUsers[2].email}, relations: ['friends']});
  });

  test("GroupEntity: create a new group between testUsers 0,1,2", async () => {
    const users = await UserEntity.findByIds([testUsers[0].id, testUsers[1].id, testUsers[2].id]);

    const group = await GroupEntity.createGroupWithUsers(users, "Group1");

    expect(group).toBeTruthy();
    if(!group) return;
    expect(group.users).toBe(users);
  });

});