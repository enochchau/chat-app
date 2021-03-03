import * as Sq from "sequelize";
import * as bcrypt from 'bcrypt';
import Group from './group';

const SALTROUNDS = 10;

// for req.user
declare global{
  namespace Express{
    export interface User {
      id: number;
      name: string;
      username: string;
      password: string;
    }  
  }
}

interface UserAttributes {
  id: number;
  name: string;
  username: string;
  password: string;
}

interface UserCreationAttributes extends Sq.Optional<UserAttributes, "id">{}

class User extends Sq.Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
  public id!: number;
  public name!: string;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public addUser!: Sq.BelongsToManyAddAssociationMixin<User, number>
  // public addUsers!: Sq.BelongsToManyAddAssociationsMixin<User, number>
  // public countUsers!: Sq.BelongsToManyCountAssociationsMixin
  // public createUser!: Sq.BelongsToManyCreateAssociationMixin<User>
  // public getUsers!: Sq.BelongsToManyGetAssociationsMixin<User>
  // public hasUser!: Sq.BelongsToManyHasAssociationMixin<User, number>
  // public hasUsers!: Sq.BelongsToManyHasAssociationsMixin<User, number>
  // public removeUser!: Sq.BelongsToManyRemoveAssociationMixin<User, number>
  // public removeUsers!: Sq.BelongsToManyRemoveAssociationsMixin<User, number>
  // public setUsers!: Sq.BelongsToManySetAssociationsMixin<User, number>

  public addFriend!: Sq.BelongsToManyAddAssociationMixin<User, number>
  public addFriends!: Sq.BelongsToManyAddAssociationsMixin<User, number>
  public countFriends!: Sq.BelongsToManyCountAssociationsMixin
  public createFriend!: Sq.BelongsToManyCreateAssociationMixin<User>
  public getFriends!: Sq.BelongsToManyGetAssociationsMixin<User>
  public hasFriend!: Sq.BelongsToManyHasAssociationMixin<User, number>
  public hasFriends!: Sq.BelongsToManyHasAssociationsMixin<User, number>
  public removeFriend!: Sq.BelongsToManyRemoveAssociationMixin<User, number>
  public removeFriends!: Sq.BelongsToManyRemoveAssociationsMixin<User, number>
  public setFriends!: Sq.BelongsToManySetAssociationsMixin<User, number>
  
  public addGroup!: Sq.BelongsToManyAddAssociationMixin<Group, number>
  public addGroups!: Sq.BelongsToManyAddAssociationsMixin<Group, number>
  public countGroups!: Sq.BelongsToManyCountAssociationsMixin
  public createGroup!: Sq.BelongsToManyCreateAssociationMixin<Group>
  public getGroups!: Sq.BelongsToManyGetAssociationsMixin<Group>
  public hasGroup!: Sq.BelongsToManyHasAssociationMixin<Group, number>
  public hasGroups!: Sq.BelongsToManyHasAssociationsMixin<Group, number>
  public removeGroup!: Sq.BelongsToManyRemoveAssociationMixin<Group, number>
  public removeGroups!: Sq.BelongsToManyRemoveAssociationsMixin<Group, number>
  public setGroups!: Sq.BelongsToManySetAssociationsMixin<Group, number>

  public readonly Groups?: Group[];
  
  public static associations:{
    Groups: Sq.Association<User, Group>;
  };

  public checkPassword(password:string, cb: (err:Error, result:boolean) => void){
    bcrypt.compare(password, this.password, function(err, result){
      cb(err, result);
    });
  }
  
  public static initialize(sequelize: Sq.Sequelize){
    this.init(
      {
        id: {
          type: Sq.DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: new Sq.DataTypes.STRING(128),
          allowNull: false,
        },
        username: {
          type: new Sq.DataTypes.STRING(64),
          allowNull: false,
        },
        password: {
          type: new Sq.DataTypes.STRING(64),
          allowNull: false,
        }
      },{
        tableName: 'User',
        sequelize
      }
    )

    // hash password
    this.beforeCreate( async function(user, options){
      if(!user.changed("password")) return;

      user.password = await bcrypt.hash(user.password, SALTROUNDS);
    })
  }
}

export default User;