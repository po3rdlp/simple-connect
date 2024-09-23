import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { UserRole } from '../users/enum/user-role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan');
    }

    let payload;
    try {
        payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret
        })
    } catch( error ) {
        throw new UnauthorizedException('Token tidak valid');
    }3

    request['User'] = payload;

    if (payload.role === UserRole.SUPER_ADMIN || payload.role === UserRole.ADMIN ) {
      console.log(payload);
      return true;
    }

    throw new ForbiddenException('Akes ditolak. Role tidak sesuai');

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
