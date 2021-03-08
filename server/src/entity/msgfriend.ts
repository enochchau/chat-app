import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from './user';


@Entity()
export class MsgFriendEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  message: string;

  @Column()
  user1Id: number;

  @Column()
  user2Id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => UserEntity, user => user.friends)
  user1: UserEntity

  @ManyToOne(() => UserEntity, user => user.friends)
  user2:  UserEntity

  public static addMessage(user1Id: number, user2Id: number, message:string ){
    const msg = new MsgFriendEntity();
    msg.user1Id= user1Id;
    msg.user2Id = user2Id;
    msg.message = message;
    return this.save(msg);
  }

  public static findMessages(user: number, friend: number, date: Date, count:number){
    return MsgFriendEntity.find({
      select: ["id", 'message', 'created', 'updated'],
      where: [
        {user1Id: user, user2Id: friend},
        {user1Id: friend, user2Id: user}
      ],
      order: {
        created: 'DESC'
      },
      take: count,
    });
  }
}