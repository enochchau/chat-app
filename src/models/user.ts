import * as Sq from "sequelize";
import sequelize from '../db';
import * as bcrypt from 'bcrypt';
import Group from './group';

const SALTROUNDS = 10;

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

  public getUsers!: Sq.HasManyGetAssociationsMixin<User>;
  public addUser!: Sq.HasManyAddAssociationMixin<User, number>;
  public hasUser!: Sq.HasManyHasAssociationMixin<User, number>;
  public countUsers!: Sq.HasManyCountAssociationsMixin;
  public createUser!: Sq.HasManyCreateAssociationMixin<User>;
  
  public getGroups!: Sq.HasManyGetAssociationsMixin<Group>;
  public addGroup!: Sq.HasManyAddAssociationMixin<Group, number>;
  public hasGroup!: Sq.HasManyHasAssociationMixin<Group, number>;
  public countGroups!: Sq.HasManyCountAssociationsMixin;
  public createGroup!: Sq.HasManyCreateAssociationMixin<Group>;

  public readonly users?: User[];
  public readonly groups?: Group[];
  
  public static associations:{
    users: Sq.Association<User, User>;
    groups: Sq.Association<User, Group>;
  };

  public checkPassword(password:string, cb: (err:Error, result:boolean) => void){
    bcrypt.compare(password, this.password, function(err, result){
      cb(err, result);
    });
  }
}

User.init(
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
    tableName: 'user',
    sequelize
  }
)

// hash password
User.beforeCreate( async function(user, options){
  if(!user.changed("password")) return;

  user.password = await bcrypt.hash(user.password, SALTROUNDS);
})

export default User;