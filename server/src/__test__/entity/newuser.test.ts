import { UserEntity } from '../../entity/user';
import { UserEntitySetup } from './setup';

describe ('New UserEntity', () => {

  let setup = new UserEntitySetup();
  
  beforeEach(async () => {
    await setup.beforeEach();
  })

  afterEach( async () => {
    await setup.afterEach();
  })

  it("creates a new user", async () => {
    for(let testUser of setup.testUsers){
      const user = new UserEntity();
      user.name = testUser.name;
      user.username = testUser.username;
      user.password = testUser.password;
      await UserEntity.save(user);
    }


    const allUsers = await UserEntity.find();
    expect(allUsers.length).toBe(setup.testUsers.length);
    allUsers.forEach((user, index) => {
      expect(user.id).toBeGreaterThan(0);
      expect(user.name).toBe(setup.testUsers[index].name);
      expect(user.username).toBe(setup.testUsers[index].username);
    });
  });

})