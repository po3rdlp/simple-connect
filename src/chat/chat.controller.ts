import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Endpoint to send a message
  @Post()
  async sendMessage(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.sendMessage(createChatDto);
  }

  // Endpoint to get sent messages for a user
  @Get('sent/:userId')
  async getSentMessages(@Param('userId') userId: number): Promise<Chat[]> {
    return this.chatService.getSentMessages(userId);
  }

  // Endpoint to get received messages for a user
  @Get('received/:userId')
  async getReceivedMessages(@Param('userId') userId: number): Promise<Chat[]> {
    return this.chatService.getReceivedMessages(userId);
  }

  // Endpoint to delete a message by ID
  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: number): Promise<{ message: string }> {
    try {
      const successMessage = await this.chatService.deleteMessage(messageId);
      return { message: successMessage }; // Return success message
    } catch (error) {
      // If the message doesn't exist or any error occurs, throw an HTTP exception
      throw new HttpException(error.response || 'Message not found', error.status || HttpStatus.NOT_FOUND);
    }
  }
}
