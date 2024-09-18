import { UserRole } from "../enum/user-role.enum";

export class CreateUserDto {
    userName: string;
    firstName: string;
    lastName: string
    age: number;
    password: string;
    role: UserRole;
}

