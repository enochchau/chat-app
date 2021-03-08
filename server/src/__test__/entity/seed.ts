// clear the database, then seed the database with 10 test users and 9 test groups
// test groups are between testUser0 and all other testUsers
import { EntitySetup, UserEntitySetup } from './setup';
import { UserEntity } from '../../entity/user';
import { GroupEntity } from '../../entity/group';

async function main() {

  const setup = new EntitySetup(10, false);
  await setup.beforeAll(true); // clear the database
  await setup.beforeEach();


  // create 10 tests users
  for(let testUser of setup.testUsers){
    const user = new UserEntity();
    user.name = testUser.name;
    user.username = testUser.username;
    user.password = testUser.password;
    await UserEntity.save(user);
  }

  const users = await UserEntity.find({take: 10, order: {id: 'ASC'}});
  if(!users) return console.error("Couldn't find the 10 seeded test users");

  for(let i=1; i<users.length; i++){
    await GroupEntity.createGroupWithUsers([users[0], users[i]]);
  }

  await setup.afterEach();
}

main();