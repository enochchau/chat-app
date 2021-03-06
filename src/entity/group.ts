import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
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

  public static createGroup(users: Array<UserEntity>, name: string | null = null){
    const group = new GroupEntity();
    if (name) group.name = name;
    group.users = users
    return this.save(group);
  }
}