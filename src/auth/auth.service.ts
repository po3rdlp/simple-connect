import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { comparePasswords } from '../lib/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(createAuthDto: CreateAuthDto): Promise<{message: string; access_token: string}> {
    const { userName, password } = createAuthDto;

    // Cari pengguna berdasarkan userName
    const user = await this.userService.findOneUserName(userName);

    if (!user) {
      throw new UnauthorizedException('Credentials tidak ditemukan');
    }

    // Verifikasi password
    const isPasswordValid = await comparePasswords(password, user.user.password, user.user.age);

    const payLoad = { sub: user.user.id, username: user.user.userName, role: user.user.role};

    if (!isPasswordValid) {
      console.log('salah password')
      throw new UnauthorizedException('Password yang dimasukan salah');
    } else {
      return {message: 'Login Successfully', access_token: await this.jwtService.signAsync(payLoad)};
    }
  }

  async validateToken(token: string): Promise<{ message: string; user: any }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findOneUserName(payload.username);
      return { message: 'Token is valid', user };
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
