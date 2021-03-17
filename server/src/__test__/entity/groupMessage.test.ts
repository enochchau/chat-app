import { GroupMessageView } from '../../entity/groupMessage';
import { DBConnect } from '../connection';


describe ("Group Message View", () => {
  const dbconnector = new DBConnect();
  beforeEach( async () => {
    await dbconnector.create('postgres');
  });

  afterEach( async () => {
    await dbconnector.close();
  });

  test('hows the view', async () => {
    const view = await GroupMessageView.find();
    console.log(view);
  });
})