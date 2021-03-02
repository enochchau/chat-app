import User from './user';
import Group from './group';

Group.belongsToMany(User, {through: 'Group-User'});
User.belongsToMany(Group, {through: 'Group-User'});
User.belongsToMany(User, {through: 'User-User', as: 'User'});
User.belongsToMany(User, {through: 'User-User', as: 'Friend'});

export {User, Group};