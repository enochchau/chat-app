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
    const view = await GroupMessageView.findRecent(1, 100, new Date());
    console.log(view);
    expect(view.length).toBe(2);
  });
})