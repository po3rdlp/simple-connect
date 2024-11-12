import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { UserGateAway } from './gateAway/gateAway.service';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5303,
      username: 'postgres',
      password: 'opkl5303',
      database: 'simple_connect',
      entities: [User, Product, Chat],
      synchronize: true,
    }), UsersModule, ProductsModule, AuthModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, UserGateAway],
})
export class AppModule {}
