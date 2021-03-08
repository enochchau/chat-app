import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user';
import { MsgGroupEntity } from './msggroup';

@Entity()
export class GroupEntity extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 128,
    nullable: true,
  })
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(type => UserEntity, user => user.groups)
  users: UserEntity[];

  @OneToMany(() => MsgGroupEntity , message => message.group)
  messages: MsgGroupEntity[];

  public static createGroupWithUsers(users: Array<UserEntity>, name: string | null = null){
    const newGroup = new GroupEntity();
    if (name) newGroup.name = name;
    newGroup.users = users;
    return this.save(newGroup);
  }

  public static findMessagesOfGroupId(groupId: number, count: number, fromDate: Date){
    return this
      .createQueryBuilder("group")
      .leftJoinAndSelect("group.messages", "messages")
      .where("group.id = :id", {id: groupId})
      .andWhere("messages.updated <= :date", {date: fromDate})
      .orderBy("messages.updated", "DESC")
      .limit(count)
      .getOne()
  }
}