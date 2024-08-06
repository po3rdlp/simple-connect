import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'THIS IS STILL ON DEVELOPMENT, ON LOCALHOST.\n SOMEONE WHO SEE THIS, LOVE YOU.';
  }
}
