import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, ParseIntPipe, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import  { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) : Promise<{ message: string; hint: string; user: User }> {
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

  @Get(':id/password-check')
  async findOnePasswordById(@Param('id') id :number, @Query('password') password: string): Promise<{message: string}> {
    return this.usersService.findOnePasswordById(id ,password)
  }

  @Get('user-name/:userName')
  async findOneUserName(@Param('userName') userName: string) {
    return this.usersService.findOneUserName(userName);
  }

  @Get('age/:age')
  async findAllByAge(@Param('age', ParseIntPipe) age: number): Promise<{message: string; user: User[]}> {
    try {
      return this.usersService.findAllByAge(age);
    } catch (error) {
      console.log('Error', error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id')id : number, @Body() UpdateUserDto: UpdateUserDto) : Promise<{message: string; user: User}> {
    return this.usersService.update(id, UpdateUserDto)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) : Promise<{ message: string; user: User }> {
    return this.usersService.remove(id)
  }
}
