export interface ValidationRequest {
    credential: string;
    ownerPublicKey: string;
    signature: string;
}

export interface SendTransactionRequest {
    signedTransaction: string;
}
