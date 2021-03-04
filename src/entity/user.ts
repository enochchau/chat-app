import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToMany, 
  JoinTable, 
  AfterLoad, 
  BeforeUpdate, 
  BeforeInsert,
  Repository,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Group } from './group';
import * as bcrypt from "bcrypt";

const SALTROUNDS = 10;

// for req.user to work with passport-JWT
declare global{
  namespace Express {
    export interface User{
      id: number,
      name: string,
      username: string,
      password: string,
    }
  }
}

@Entity()
export class User {
  
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
    length: 72 
  })
  password: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(type => User, user => user.friends)
  @JoinTable()
  friends: User[];

  @ManyToMany(type => Group, group => group.users, {
    cascade: true
  })
  @JoinTable()
  groups: Group[]

  // used to check if the password changed and rehash it
  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  private async hashPassword(){
    this.password = await bcrypt.hash(this.password, SALTROUNDS);
  }

  @BeforeUpdate()
  private async updateHash(){
    if (this.tempPassword !== this.password){
      await this.hashPassword();
    }
  }
  
  @BeforeInsert()
  private async insertHash(){
    await this.hashPassword();
  }
  
  public checkPassword(password: string, cb: (error: Error, result: boolean) => void){
    bcrypt.compare(password, this.password, function(err, res){
      cb(err, res);
    })
  } 

}