import { 
  BaseEntity, 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { GroupEntity } from "./group";

@Entity()
export class MsgGroupEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column()
  groupId: number;

  @ManyToOne(() => GroupEntity, group => group.messages)
  group: GroupEntity;

  public static addMessage(groupId: number, message: string){
    const msg = new MsgGroupEntity();
    msg.groupId = groupId;
    msg.message = message;
    return this.save(msg);
  }
}
