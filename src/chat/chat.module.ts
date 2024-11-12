import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  providers: [ChatService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
