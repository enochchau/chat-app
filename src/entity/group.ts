import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  getConnection,
} from 'typeorm';
import { UserEntity } from './user'

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

  public static createGroupWithUsers(users: Array<UserEntity>, name: string | null = null){
    const newGroup = new GroupEntity();
    if (name) newGroup.name = name;
    newGroup.users = users;
    return this.save(newGroup);
  }
}