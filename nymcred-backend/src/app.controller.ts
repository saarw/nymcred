import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface Rsp {
  data: string
}

interface Credentials {
  credential: string
}

@Controller('/api')
export class AppController {
  private userToken = '1234';

  constructor(private readonly appService: AppService) {}

  @Post()
  createUser(): string {
    return this.userToken;
  }

  @Post('/validate/:userToken')
  validateCredential(@Param('userToken') userToken: string, @Body() credentials: Credentials): Rsp {
    return {
      data: 'validated'
    };
  }

  @Get(':userToken')
  checkUser(): string {
    return 'invalid';
  }
}
