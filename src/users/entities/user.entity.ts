import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserRole } from "../enum/user-role.enum";
import { Chat } from "../../chat/entities/chat.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    userName: string

    @Column()
    firstName: string

    @Column()
    lastName: string
    
    @Column()
    age: number

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
      }) role: UserRole;

      @OneToMany(() => Chat, (chat) => chat.sender)
      sentMessages: Chat[];
  
      @OneToMany(() => Chat, (chat) => chat.receiver)
      receivedMessages: Chat[];

}