import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enum/user-role.enum";

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
        default: UserRole.USER, // Set a default role if needed
      }) role: UserRole;

}