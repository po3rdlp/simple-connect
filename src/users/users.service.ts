import { ConflictException, Injectable, NotFoundException, HttpStatus, BadRequestException, InternalServerErrorException  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hashPassword, comparePasswords } from '../lib/bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // service create User
  async create(createUserDto: CreateUserDto): Promise<{message: string,hint: string , user: User}> {

    const missingFields = [];

    if (!createUserDto.userName) missingFields.push('userName');
    if (!createUserDto.firstName) missingFields.push('firstName');
    if (!createUserDto.lastName) missingFields.push('lastName');
    if (createUserDto.age === undefined) missingFields.push('age');
    if (!createUserDto.password) missingFields.push('password');
    if (!createUserDto.role) missingFields.push('role');
  
    if (missingFields.length > 0) {
      throw new BadRequestException(`Field tidak terisi: ${missingFields.join(', ')}`);
    }

    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(createUserDto.role)) {
    throw new BadRequestException(`Role tidak valid: ${createUserDto.role}`);
  }

    const duplicateUser = await this.userRepository.findOneBy({ 
      firstName: createUserDto.firstName, 
      lastName: createUserDto.lastName,
    });

    const duplicateUserName = await this.userRepository.findOneBy({
      userName: createUserDto.userName
    })

    if (duplicateUser || duplicateUserName) {
      throw new ConflictException(`Gagal, UserName: ${createUserDto.userName} sudah ada. Atau firstName dan LastName Sama.`);
    }

    const hashedPassword = await hashPassword(createUserDto.password, createUserDto.age);

    // create with hass pass
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return {message: 'Berhasil Menambahkan User', hint: '', user: newUser}
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

  // find by username
  async findOneUserName(userName: string): Promise<{ message: string; user: User }> {
    if (!userName) {
      throw new BadRequestException('Mohon Mengisi Username');
    }

    // Temukan pengguna berdasarkan userName
    const user = await this.userRepository.findOne({ where: { userName } });

    if (!user) {
      throw new NotFoundException('Username tidak ditemukan');
    }

    return { message: 'Berhasil', user };
  }


  // check Passowrd
  async findOnePasswordById(id: number, password: string): Promise<{message: string; user: User}> {
    if (!password) {
      throw new BadRequestException('Parameter Password diperlukan.');
    }

    const user = await this.userRepository.findOneBy({id: Number(id)});

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const checkTruePassword = await comparePasswords(password, user.password , user.age);


    if (!checkTruePassword) {
      throw new BadRequestException(`Password yang di input tidak Valid, User Id: ${id}, User Name: ${user.userName}`)
    }

    return {message: 'Passowrd Valid', user}
  }

  // service find by age
  async findAllByAge(age: number): Promise<{message: string; user: User[]}> {
    try{
      if(isNaN(age)) {
        throw new BadRequestException('Age Must integer.')
      }
      const user = await this.userRepository.find({ where: { age } });

      if (user.length === 0) {
        return {message: `No users found with this ${age}`, user: []}
      } else {
        return {
          message : `List users with age ${age}`,
          user: user
        }
      }
    } catch(error){
      throw new InternalServerErrorException('Terjadi Kesalahan');
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
 async remove(id: number ): Promise<{ message: string; user: User }>{
    const user = await this.userRepository.findOneBy({ id: Number(id) });
    if(!user) {
      throw new NotFoundException(`User dengan id ${id} tidak di temukan, gagal menghapus.`)
    }
    await this.userRepository.remove(user);
    return {message: 'Berhasil menghapus user', user};
  }

}
