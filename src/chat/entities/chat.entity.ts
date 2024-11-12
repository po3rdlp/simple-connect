import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => User, user => user.sentMessages, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, user => user.receivedMessages, { eager: true })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;
}