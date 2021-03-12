import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  JoinTable, 
  AfterLoad, 
  BeforeUpdate, 
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { GroupEntity } from './group';
import * as bcrypt from "bcrypt";

const SALTROUNDS = 10;

// for req.user to work with passport-JWT
declare global{
  namespace Express {
    export interface User extends UserEntity{}
  }
}


@Entity()
export class UserEntity extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({
    length: 128
  })
  name: string;
  
  @Column({
    length: 64,
    unique: true,
  })
  username: string;

  @Column({
    length: 72,
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(type => UserEntity, user => user.friends)
  @JoinTable()
  friends: UserEntity[];

  @ManyToMany(type => GroupEntity, group => group.users, {
    cascade: true
  })
  @JoinTable()
  groups: GroupEntity[]

  // used to check if the password changed and rehash it
  private tempPassword?: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  private async hashPassword(){
    this.password = await bcrypt.hash(this.password, SALTROUNDS);
  }

  @BeforeUpdate()
  private async updatePasswordHash(){
    if (this.tempPassword !== this.password){
      await this.hashPassword();
    }
  }
  
  @BeforeInsert()
  private async createPasswordHash(){
    await this.hashPassword();
  }
  
  public checkPassword(password: string, cb: (error: Error, result: boolean) => void){
    if(!this.password) return;

    bcrypt.compare(password, this.password, function(err, res){
      cb(err, res);
    })
  } 

  // queries
  public static addFriend(user:UserEntity, friend:UserEntity): Promise<UserEntity>{
    user.friends.push(friend);
    return UserEntity.save(user);
  }

  public static addFriendById(userId: number, friendId: number){
    return this.createQueryBuilder()
      .relation(UserEntity, "friends")
      .of(userId)
      .add(friendId);
  }

  public static removeFriend(user: UserEntity, friend: UserEntity): Promise<UserEntity>{
    for(let i=0; i<user.friends.length; i++){
      if (user.friends[i].id === friend.id){
        user.friends.splice(i, 1);
        break;
      }
    }
    return UserEntity.save(user);
  }

  public static removeFriendById(userId: number, friendId: number){
    return this.createQueryBuilder()
      .relation(UserEntity, "friends")
      .of(userId)
      .remove(friendId);
  }

  public static async areFriends(userId: number, friendId: number){
    const areFriends = await this 
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.friends", "friend")
      .where("user.id = :userId", {userId: userId})
      .andWhere("friend.id = :friendId", {friendId: friendId})
      .getCount();
    
    return Boolean(areFriends);
  }

  public static findGroupsOfUserId(userId: number, count: number, fromDate: Date){
    return this
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.groups", "groups")
      .where("user.id = :id", {id: userId})
      .andWhere("groups.updated <= :date", {date: fromDate})
      .orderBy("groups.updated", "DESC")
      .limit(count)
      .getOne()
  }

  public static findOneByUsername(username: string, relations: Array<string> = []){
    return this.findOne({where: {username: username}, relations: relations});
  }
}