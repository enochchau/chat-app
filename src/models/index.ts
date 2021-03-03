import User from './user';
import Group from './group';
import config from '../config';
import * as Sq from 'sequelize';

const sequelize = new Sq.Sequelize(config.DATABASE_URL);
Group.initialize(sequelize);
User.initialize(sequelize);

Group.belongsToMany(User, {through: 'Group_User'});
User.belongsToMany(Group, {through: 'Group_User'});
User.belongsToMany(User, {through: 'User_Friend', as: 'User', foreignKey: 'userId'});
User.belongsToMany(User, {through: 'User_Friend', as: 'Friend', foreignKey: 'friendId'});

export {sequelize, User, Group};

async function main(){
  await sequelize.authenticate();
  await sequelize.sync({force:true});
  await User.bulkCreate([
    {username: "test1", name: "enoch", password: "pwerer"},
    {username: "test2", name: "bob", password: "pwerer"},
    {username: "test3", name: "joe", password: "pwerer"},
  ]);
  await User.create({username: 'test4', name: 'johnny', password: 'dksjldfj'});
  await Group.bulkCreate([
    {name: "group1"},
    {name: "group2"},
  ]);


  const group1 = await Group.findByPk(1);
  const user = await User.findByPk(1);
  const friend = await User.findByPk(2);
  const johnny = await User.findByPk(4);
  if(!friend || !user || !group1 || !johnny) return;
  console.log(JSON.stringify(user, null, 2));
  console.log(JSON.stringify(friend, null, 2));
  console.log(JSON.stringify(group1, null, 2));
  console.log(JSON.stringify(johnny, null, 2));

  await user.addFriend(friend);
  await user.addFriend(johnny);
  await group1.addUsers([friend,user]);

  const updatedUser = await User.findByPk(1, {
    include: [User.associations.Groups, "Friend"]
  });
  const updatedGroup = await Group.findByPk(1,{
    include:[Group.associations.Users]
  });
  if(!updatedUser || !updatedGroup) return;

  console.log(JSON.stringify(updatedUser, null, 2));
  console.log(JSON.stringify(updatedGroup, null, 2));
}

main();