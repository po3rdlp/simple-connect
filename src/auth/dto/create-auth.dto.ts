import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100) 
  password: string;
}
