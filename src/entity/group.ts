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
import { MessageEntity } from './message';

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

  @OneToMany(() => MessageEntity, message => message.group)
  messages: MessageEntity[];

  public static createGroupWithUsers(users: Array<UserEntity>, name: string | null = null){
    const newGroup = new GroupEntity();
    if (name) newGroup.name = name;
    newGroup.users = users;
    return this.save(newGroup);
  }

  public static findMessagesOfGroupId(groupId: number, fromDate: Date, count: number){
    return this
      .createQueryBuilder()
      .where("messages.created <= :date", {date: fromDate})
      .take(count)
      .orderBy("messages.created", "DESC")
      .relation(GroupEntity, "messages")
      .of(groupId)
      .loadMany();
  }
}