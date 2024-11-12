import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { senderId, receiverId, message } = createChatDto;

    // Find sender and receiver users by their IDs
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const chat = this.chatRepository.create({
      sender,
      receiver,
      message,
    });

    return this.chatRepository.save(chat);
  }

  // Get all sent messages by a user
  async getSentMessages(userId: number): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { sender: { id: userId } },
      relations: ['sender', 'receiver'],
      order: { timestamp: 'DESC' },
    });
  }

  // Get all received messages by a user
  async getReceivedMessages(userId: number): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { receiver: { id: userId } },
      relations: ['sender', 'receiver'],
      order: { timestamp: 'DESC' },
    });
  }

  // Optionally, delete a chat message (e.g., by ID)
  async deleteMessage(messageId: number): Promise<string> {
    const message = await this.chatRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new HttpException(
        'Message not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.chatRepository.delete({ id: messageId });

    return 'Message deleted successfully';
  }
}
