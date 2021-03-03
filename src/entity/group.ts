import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user'

@Entity()
export class Group {
  
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

  @ManyToMany(type => User, user => user.groups)
  users: User[];
}