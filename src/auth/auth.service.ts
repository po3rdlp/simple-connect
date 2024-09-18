import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { comparePasswords } from '../lib/bcrypt'; // Pastikan path sesuai dengan lokasi sebenarnya

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
  ) {}

  async login(createAuthDto: CreateAuthDto): Promise<{message: string}> {
    const { userName, password } = createAuthDto;

    // Cari pengguna berdasarkan userName
    const user = await this.userService.findOneUserName(userName);

    if (!user) {
      throw new UnauthorizedException('Credentials tidak ditemukan');
    }

    // Verifikasi password
    const isPasswordValid = await comparePasswords(password, user.user.password, user.user.age);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password Mungkin Salah');
    } else {
      return {message: 'Login Successfully'};
    }
  }
}