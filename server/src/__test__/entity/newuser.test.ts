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
    const testUser = setup.testUsers[0];
    const user = new UserEntity();
    user.name = testUser.name;
    user.username = testUser.username;
    user.password = testUser.password;
    await UserEntity.save(user);


    const reuser = await UserEntity.findOneByUsername(user.username);
    expect(reuser?.name).toBe(testUser.name);
    expect(reuser?.username).toBe(testUser.username);
  });

})