import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { comparePasswords } from '../lib/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto): Promise<{message: string; access_token: string; user: UserResponse}> {
    const { userName, password } = createAuthDto;

    // Cari pengguna berdasarkan userName
    const user = await this.userService.findOneUserName(userName);

    if (!user) {
      throw new UnauthorizedException('Credentials tidak ditemukan');
    }

    // Verifikasi password
    const isPasswordValid = await comparePasswords(password, user.user.password, user.user.age);

    const payLoad = { sub: user.user.id, username: user.user.userName, role: user.user.role};
    
    const userResponse: UserResponse = {
      id: user.user.id,
      userName: user.user.userName,
      role: user.user.role,
  };

    if (!isPasswordValid) {
      console.log('salah password')
      throw new UnauthorizedException('Password yang dimasukan salah');
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const tokenGet = await this.jwtService.signAsync(payLoad);

      return {
        message: 'Login Successfully',
        user: userResponse,
        access_token: tokenGet
      };
    }
  }

  async validateToken(token: string): Promise<{ message: string, user: { id: number; username: string; role: string; } }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findOneUserName(payload.username);

      const userWithoutPassword = {
        id: user.user.id,
        username: user.user.userName,
        role: user.user.role,
      };

      return {message: token, user: userWithoutPassword};
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
