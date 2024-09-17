import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import  { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) : Promise<{ message: string; user: User }> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<{message: string}> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('age')
  async findAllByAge(@Query('age') age: number): Promise<{message: string; user: User[]}> {
    try {
      return this.usersService.findAllByAge(age);
    } catch (error) {
      console.log('ewoioioi', error);
    }
  }


  @Patch(':id')
  async update(@Param('id')id : number, @Body() UpdateUserDto: UpdateUserDto) : Promise<{message: string; user: User}> {
    return this.usersService.update(id, UpdateUserDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) : Promise<{ message: string; user: User }> {
    return this.usersService.remove(id)
  }
}
