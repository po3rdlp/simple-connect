import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5303,
      username: 'postgres',
      password: 'opkl5303',
      database: 'simple_connect',
      entities: [User],
      synchronize: true,
    }),

    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
