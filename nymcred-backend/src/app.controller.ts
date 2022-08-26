import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicKey } from '@solana/web3.js';
import { SelectCredentialRequest } from './Messages';

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

  @Post('/validate')
  async startValidation(@Param('userToken') userToken: string, @Body() credentials: SelectCredentialRequest): Promise<Rsp<string>> {
    // Check the credential
    return { 
      data: (await this.appService.createTransaction(userToken, 
        new PublicKey(credentials.credential), 
        new PublicKey(credentials.publicKeyBase58))
      ).toString('base64')
    };
  }

  @Get(':userToken')
  checkUser(): string {
    return 'invalid';
  }
}
