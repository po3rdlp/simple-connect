import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  senderId: number;

  @IsInt()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}

