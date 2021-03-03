import User from './user';
import Group from './group';

Group.belongsToMany(User, {through: 'group-user'});
User.belongsToMany(Group, {through: 'group-user'});
User.belongsToMany(User, {through: 'user-user', as: 'user', foreignKey: 'userId'});
User.belongsToMany(User, {through: 'user-user', as: 'friend', foreignKey: 'friendId'});

export {User, Group};