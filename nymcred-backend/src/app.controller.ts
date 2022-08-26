import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicKey } from '@solana/web3.js';
import { ValidationRequest } from './Messages';

interface Rsp<T> {
  data: T
}

@Controller('/api')
export class AppController {
  private userToken = '1234';
  

  constructor(private readonly appService: AppService) {
  }

  @Post()
  createUser(): string {
    return this.userToken;
  }

  @Post('/validate/:userKey')
  async startValidation(@Param('userKey') userKey: string, @Body() body: ValidationRequest): Promise<Rsp<string>> {
    // Check the credential
    return { 
      data: (await this.appService.createTransaction(new PublicKey(userKey), 
        new PublicKey(body.credential), 
        new PublicKey(body.ownerPublicKey),
        body.signature)
      ).toString('base64')
    };
  }

  @Get(':userToken')
  checkUser(): string {
    return 'invalid';
  }
}
