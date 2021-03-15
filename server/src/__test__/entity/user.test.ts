import { UserEntity } from '../../entity/user';
import { UserEntitySetup } from './setup';

describe ('New UserEntity', () => {

  
  let setup = new UserEntitySetup();
  const testUser = setup.testUsers[0];

  beforeEach(async () => {
    await setup.connectDatabase();
  })

  afterEach( async () => {
    await setup.disconnectDatabase();
  })

  it("creates a new user", async () => {
    const user = new UserEntity();
    user.name = testUser.name;
    user.email = testUser.email;
    user.password = testUser.password;
    await UserEntity.save(user);


    const reuser = await UserEntity.findOne({where: {email: testUser.email}});
    expect(reuser?.name).toBe(testUser.name);
    expect(reuser?.email).toBe(testUser.email);
  });

  it("tests the user's password", async () => {
    const user = await UserEntity.findOne({where: {email: testUser.email}});
    expect(user).toBeTruthy();

    if(!user)return;

    user.checkPassword(testUser.password, (err, result) => {
      expect(result).toBe(true);
    })
  })

})