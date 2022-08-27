import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicKey } from '@solana/web3.js';
import { SendTransactionRequest, ValidationRequest } from './Messages';

interface Rsp<T> {
  data: T
}

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {
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

  @Post('/sendTransaction')
  async sendTransaction(@Body() body: SendTransactionRequest): Promise<Rsp<string>> {
    return { 
      data: await this.appService.submitSignedTransaction(body.signedTransaction)
    };
  }
}
