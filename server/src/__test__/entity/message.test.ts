// create two users
// create a group
// send some messages
import { GroupEntity } from '../../entity/group';
import { UserEntity } from '../../entity/user';
import { MessageEntity } from '../../entity/message';
import { DBConnect } from '../connection';

describe("Message Entity", () => {
  const dbconnector = new DBConnect();

  beforeEach( async () => {
    await dbconnector.create('postgres');
  });

  afterEach( async () => {
    await dbconnector.close();
  });

  test("Create 1 messages between user1 and user2 through group1", async () => {
    const user1 = await UserEntity.findOne({where:{id:1}, relations: ["groups"]});
    const user2 = await UserEntity.findOne({where:{id:2}, relations: ["groups"]});
    console.log(user1, user2);
    
    if(!user1 || !user2) throw Error("user1 or user2 was not found.");

    expect(user1.groups[0].id).toBe(1);

    const newMsg = new MessageEntity();
    const timestamp = new Date();
    newMsg.message = "hello there!";
    newMsg.userId = user1.id;
    newMsg.groupId = 1;
    newMsg.timestamp = timestamp;

    const reMsg = await MessageEntity.save(newMsg);
    console.log(reMsg);
    expect(reMsg.userId).toBe(user1.id);
    expect(reMsg.message).toBe('hello there!');
    expect(reMsg.timestamp).toBe(timestamp);
    expect(reMsg.id).toBe(1);
  });

  test("create 10 msg and retrieve 5 msg between user1 and user2 on group1", async () => {
    const COUNT = 5;
    const user1 = await UserEntity.findOne({where:{id:1}, relations: ["groups"]});
    const user2 = await UserEntity.findOne({where:{id:2}, relations: ["groups"]});
    console.log(user1, user2);
    
    if(!user1 || !user2) throw Error("user1 or user2 was not found.");

    expect(user1.groups[0].id).toBe(1);

    for (let i=0; i<10; i++){
      const newMsg = new MessageEntity();
      const timestamp = new Date();
      newMsg.message = `${i} hello there!`;
      newMsg.userId = user1.id;
      newMsg.groupId = 1;
      newMsg.timestamp = new Date();
      await MessageEntity.save(newMsg);
    }
    
    const messages = await MessageEntity.findMessagesOfGroupId(1, COUNT, new Date());
    if(!messages) throw Error("couldn't find group1");

    expect(messages.length).toBe(COUNT);
  });
})