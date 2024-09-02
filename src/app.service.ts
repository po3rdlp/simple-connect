import { Injectable , HttpException, HttpStatus} from '@nestjs/common';

@Injectable()
export class AppService {
  async getPing(): Promise<string> {
    const setError = false
    if (setError) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST)
    } else {
      throw new HttpException('Successfully Connected', HttpStatus.ACCEPTED);
    }
  }
}
