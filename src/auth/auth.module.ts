import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, JwtModule.register({global: true, secret: jwtConstants.secret, signOptions: { expiresIn: '120s' }}) ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
