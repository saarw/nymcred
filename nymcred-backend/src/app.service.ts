import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PublicKey, Signer, Transaction, Connection, sendAndConfirmTransaction, Keypair, clusterApiUrl} from '@solana/web3.js';
import { getAccount } from '@solana/spl-token'

import * as NYMCRED_KEYPAIR from './nymcred-keypair.json';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private programId: PublicKey;
  private connection = new Connection('http://localhost:8899');
  private mainNet = new Connection(clusterApiUrl('mainnet-beta'));

  private signerKeypair = Keypair.fromSecretKey(new Uint8Array(NYMCRED_KEYPAIR));

  constructor(
    
    ) {}

  async createTransaction(user: string, splTokenAddress: PublicKey, userPublicKey: PublicKey): Promise<Buffer> {
    this.logger.log('Getting token account ' + splTokenAddress);
    const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    const splAccount = await getAccount(this.mainNet, splTokenAddress, undefined, tokenProgram);
    if (!splAccount.owner.equals(userPublicKey)) {
      this.logger.warn(userPublicKey.toBase58() + ' did not own token ' + splTokenAddress.toBase58())
      throw new HttpException('Unauthenticated', 403);
    } 

    const {blockhash, lastValidBlockHeight} = await this.connection.getLatestBlockhash();
    const transaction = new Transaction({blockhash, lastValidBlockHeight, feePayer: this.signerKeypair.publicKey});
    transaction.add({
      keys: [
        {pubkey: this.signerKeypair.publicKey, isSigner: true, isWritable: true}, 
        {pubkey: userPublicKey, isSigner: true, isWritable: false}
      ],
      programId: this.signerKeypair.publicKey,
    });
    transaction.partialSign(this.signerKeypair);
    this.logger.log('Signed transaction for user ' + user);
    return transaction.serialize({requireAllSignatures: false, verifySignatures: false});
  }

}
