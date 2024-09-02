import { ConflictException, Injectable, NotFoundException, HttpStatus, BadRequestException  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // service create User
  async create(createUserDto: CreateUserDto): Promise<{message: string, user: User}> {
    const duplicateUser = await this.userRepository.findOneBy({ 
      firstName: createUserDto.firstName, 
      lastName: createUserDto.lastName,
    });
    if (duplicateUser) {
      throw new ConflictException(`User dengan firstName ${createUserDto.firstName} dan lastName ${createUserDto.lastName} sudah ada`);
    }
    const newUser = this.userRepository.create(createUserDto)
    await this.userRepository.save(newUser);
    return {message: 'Berhasil Menambahkan User', user: newUser}
  }

  // service find all user
  async findAll(): Promise<{message: string, user: User[]}> {
    const users =  await this.userRepository.find()
    if (users.length === 0) {
      return {message: 'No users for now.', user: []}
    } else {
      return {
        message: 'List User:',
        user: users
      }
    }
  }

  // service find by id
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: Number(id) });
    if(!user) {
      throw new NotFoundException(`User dengan id ${id} tidak di temukan`)
    }
    console.warn(`Berhasil Mengambil ID ${id}`);
    return user
  }

  // service find by age
  async findAllByAge(age: number): Promise<{message: string; user: User[]}> {
    try{
      const user = await this.userRepository.find({ where: {age} });

      if (user.length === 0) {
        return {message: `No users found with this ${age}`, user: []}
      } else {
        return {
          message : `List users with age ${age}`,
          user: user
        }
      }
    } catch(err){
      console.log('by age',err)
    }
  }

  // Update/edit users
  async update(id:number, UpdateUserDto: UpdateUserDto): Promise<{message: string, user: User}>{
    const user = await this.userRepository.findOne({where: {id}})
    if(!user) {
      const err = new NotFoundException(`User dengan id ${id} tidak di temukan`)
      console.warn(err)
      throw err;
    }
    if('age' in UpdateUserDto){
      throw new BadRequestException('Age cannot be changed!');
    }

    const updateUser = Object.assign(user, UpdateUserDto)
    await this.userRepository.save(updateUser);;
    return {
      message: `User dengan id ${id} berhasil di Update`,
      user: updateUser
    }
  }

  // service delete by id
 async remove(id: number, ): Promise<{ message: string; user: User }>{
    const user = await this.userRepository.findOneBy({ id: Number(id) });
    if(!user) {
      throw new NotFoundException(`User dengan id ${id} tidak di temukan, gagal menghapus.`)
    }
    await this.userRepository.remove(user);
    return {message: 'Berhasil menghapus user', user};
  }

}
