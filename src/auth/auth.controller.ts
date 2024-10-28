import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto): Promise<{message: string}> {
    return this.authService.login(createAuthDto);
  }

  @Get('validate-token')
  async validateToken(@Request() req): Promise<{ message: string; }> {
    const token = req.headers['authorization']?.split(' ')[1];
    return this.authService.validateToken(token);
  }
}
