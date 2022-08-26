import { useState } from "react";
import { useParams } from "react-router-dom";
import { Connector } from "./net/Connector";
import {PublicKey, Keypair, Transaction} from '@solana/web3.js';
import { SelectCredentialRequest } from "./net/Messages";
import { Form } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { Buffer } from 'buffer';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const ValidateUser = (props: {
    connector: Connector
}) => {
    const { userToken } = useParams(); 
    const [validationOk, setValidationOk] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('9GihPakYConxRfWnuQj1Le83rTkxNaGKUNF9Xxz8on72');
    const wallet = useWallet();

    const secret = require('./user-keypair.json');
    const keypair = Keypair.fromSecretKey(new Uint8Array(secret));

    return <div className="container">
        <h1>{'Validate ' + wallet.publicKey?.toBase58()}</h1>
        <Form>
            <Form.Group>
                <Form.Label>SPL Token</Form.Label>
                <Form.Control type="input" value={tokenAddress} onChange={(e) => setTokenAddress(e.currentTarget.value)}/>
            </Form.Group>
        </Form>
        {!validationOk ? <button className="btn btn-primary" onClick={async () => {
            await wallet.connect();
            const publicKey = wallet.publicKey;
            if (publicKey == null) {
                return;
            }
            const request: SelectCredentialRequest = {
                publicKeyBase58: publicKey.toBase58(),
                credential: tokenAddress
            }
            props.connector.validateCredential(request, (rsp) => { 
                
                const tx = Transaction.from(Buffer.from(rsp.data, 'base64'));
                console.log(tx);
                tx.partialSign(keypair);
                console.log(tx);
                console.log(tx.serialize({verifySignatures: true, requireAllSignatures: true}));
                setValidationOk(true); 
            });
        }}>Start Validation</button> : <div>Validated</div>}
    </div>
}