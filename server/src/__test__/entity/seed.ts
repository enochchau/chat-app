// clear the database, then seed the database with 10 test users and 9 test groups
// test groups are between testUser0 and all other testUsers
import { EntitySetup } from './setup';
import { UserEntity } from '../../entity/user';
import { GroupEntity } from '../../entity/group';
import { MessageEntity } from '../../entity/message';

export async function seed() {

  const setup = new EntitySetup(10, false);
  await setup.clearDatabase(true); // clear the database

  await setup.connectDatabase();

  // create 10 tests users
  for(let testUser of setup.testUsers){
    const user = new UserEntity();
    user.name = testUser.name;
    user.email = testUser.email;
    user.password = testUser.password;
    await UserEntity.save(user);
  }

  const users = await UserEntity.find({take: 10, order: {id: 'ASC'}});
  if(!users) return console.error("Couldn't find the 10 seeded test users");

  for(let i=1; i<users.length; i++){
    await GroupEntity.createGroupWithUsers([users[0], users[i]], "");//`group0:${i}`);
  }
  for(let i=2; i<users.length; i++){
    await GroupEntity.createGroupWithUsers([users[0], users[1], users[i]], `group1:${i}`);
  }
  for(let i=3; i<users.length; i++){
    await GroupEntity.createGroupWithUsers([users[1], users[2], users[i]], `group2:${i}`);
  }
  for(let i=4; i<users.length; i++){
    await GroupEntity.createGroupWithUsers([users[2], users[3], users[i]], `group3:${i}`);
  }

  for(let i=0; i< 10; i++){
    const msg = new MessageEntity();
    msg.groupId = 1;
    msg.message = 'hi there!';
    msg.userId = 1;
    msg.timestamp = new Date();
    await MessageEntity.save(msg);
  }
  for(let i=0; i< 10; i++){
    const msg = new MessageEntity();
    msg.groupId = 2;
    msg.message = 'hi there!';
    msg.userId = 1;
    msg.timestamp = new Date();
    await MessageEntity.save(msg);
  }

  await setup.disconnectDatabase();
}

seed();