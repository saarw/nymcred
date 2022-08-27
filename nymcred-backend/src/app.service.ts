import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PublicKey, Signer, Transaction, Connection, sendAndConfirmTransaction, Keypair, clusterApiUrl, sendAndConfirmRawTransaction, SystemProgram} from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';
import {
  Program,
  Provider,
  BN,
  web3,
  AnchorProvider,
} from '@project-serum/anchor'
import nacl = require('tweetnacl');

import * as NYMCRED_KEYPAIR from './nymcred-keypair.json';
import { IDL } from './nymcred_ws';
import { simulateTransaction } from '@project-serum/anchor/dist/cjs/utils/rpc';

const opts = {
  preflightCommitment: "recent",
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private programId = new PublicKey( 'AddXJKhehfvJSTD8R3Y3V2thd9shvqUcULbi2kuE4rZF');
  private connection = new Connection('http://localhost:8899');
  private mainNet = new Connection(clusterApiUrl('mainnet-beta'));

  private signerKeypair;

  constructor() {
    this.signerKeypair = Keypair.fromSecretKey(new Uint8Array(NYMCRED_KEYPAIR));
  }

  async createTransaction(
    userKey: PublicKey, 
    splTokenAddress: PublicKey, 
    tokenOwnerPublicKey: PublicKey,
    signature: string): Promise<Buffer> {
    this.logger.log('Getting token account ' + splTokenAddress);
    const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    //const splAccount = await getAccount(this.mainNet, splTokenAddress, undefined, tokenProgram);
    // if (!splAccount.owner.equals(tokenOwnerPublicKey)) {
    //   this.logger.warn(tokenOwnerPublicKey.toBase58() + ' did not own token ' + splTokenAddress.toBase58());
    //   throw new HttpException('Unauthenticated', 403);
    // } 

    // this.logger.log('Verifying signature ' + signature + ' for ' + splTokenAddress.toBase58() + ' with key ' + tokenOwnerPublicKey.toBase58());
    // if (!nacl.sign.detached.verify(new TextEncoder().encode(splTokenAddress.toBase58()), Buffer.from(signature, 'base64'), tokenOwnerPublicKey.toBytes())) {
    //   this.logger.warn('Failed to verify signature for token ' + splTokenAddress.toBase58());
    //   throw new HttpException('Unauthenticated', 403);
    // }

    const {blockhash, lastValidBlockHeight} = await this.connection.getLatestBlockhash();

    // const provider = new AnchorProvider(
    //   this.connection, this.signerKeypair, {preflightCommitment: 'recent'},
    // );
    
    // const program = new Program(IDL, this.programId, provider);

    // program.rpc.mintCredential()

    const keyData = Buffer.from(splTokenAddress.toBase58().substring(0, 4), 'utf-8');
    const sighash = new Uint8Array([136, 108, 131, 240, 163, 102, 204, 13, keyData.length, 0, 0, 0]);
    const data = Buffer.concat([sighash, keyData])
  

    const transaction = new Transaction({blockhash, lastValidBlockHeight, feePayer: this.signerKeypair.publicKey});
    transaction.add({
      keys: [
        {pubkey: this.signerKeypair.publicKey, isSigner: true, isWritable: true}, 
        {pubkey: userKey, isSigner: true, isWritable: false},
        {pubkey: PublicKey.findProgramAddressSync([Buffer.from('credential', 'utf-8'), 
        this.signerKeypair.publicKey.toBuffer(), keyData], 
        this.programId)[0], isSigner: false, isWritable: true},
        {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
      ],
      programId: this.programId,
      data
    });
    transaction.partialSign(this.signerKeypair);
    this.logger.log('Signed transaction for user ' + userKey);
    return transaction.serialize({requireAllSignatures: false, verifySignatures: false});
  }

  async submitSignedTransaction(signedTransactionDataB64: string) {
    const transaction = Transaction.from(Buffer.from(signedTransactionDataB64, 'base64'));
    this.logger.log('Sending and confirming transaction')
    // return JSON.stringify(await simulateTransaction(this.connection, transaction));
    const sigOrErr = await sendAndConfirmRawTransaction(this.connection, transaction.serialize())
      .catch((err) => {
        return JSON.stringify(err, null, 2);
      });
    return sigOrErr;
  }

}
