import { GroupEntity } from '../../entity/group';
import { DBConnect } from '../connection';

describe("Group Entity", () => {
  const dbconnector = new DBConnect();
  beforeEach(async () => {
    await dbconnector.create('postgres');
  });

  afterEach(async () => {
    await dbconnector.close();
  });

  test("See if a group exsits between users with id 1 and 2", async () => {
    const result = await GroupEntity.doesGroupExist([2,3,4]);
    console.log(result);
    expect(result).toBeGreaterThan(-1);
  });
})