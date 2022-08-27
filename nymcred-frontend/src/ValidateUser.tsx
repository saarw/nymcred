import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Connector } from "./net/Connector";
import {PublicKey, Keypair, Transaction} from '@solana/web3.js';
import { ValidationRequest } from "./net/Messages";
import { Form } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import { Buffer } from 'buffer';
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const ProvideCredentialView = (props: {
    connector: Connector,
    userPublicKey: string,
    setValidationResult: (tx: Transaction) => void
}) => {
    const wallet = useWallet();

    const [tokenAddress, setTokenAddress] = useState('9GihPakYConxRfWnuQj1Le83rTkxNaGKUNF9Xxz8on72');
    const [ownerPublicKey, setOwnerPublicKey] = useState(wallet.publicKey?.toBase58());
    const [ownerSignature, setOwnerSignature] = useState<string>();

    useEffect(() => {
        setOwnerPublicKey(wallet.publicKey?.toBase58());
    }, [wallet]);

    return  <div>
    <h1>{'Validate ' + props.userPublicKey}</h1>
    <div>Provide proof of ownership for a credential.</div>
        <Form.Group className="mt-5">
            <Form.Label>Address to NFT the user owns</Form.Label>
            <Form.Control type="input" value={tokenAddress} onChange={(e) => setTokenAddress(e.currentTarget.value)}/>
        </Form.Group>
        <Form.Group>

            <Form.Label>Prove that wallet below owns token </Form.Label>
            {wallet.publicKey == null ? 
                <div><WalletMultiButton /></div> : <div>
                <Form.Control type="input" value={ownerPublicKey} readOnly={true} ></Form.Control>
                <Form.Label>Signature </Form.Label>
                {!ownerSignature ? 
                    <div><button className="btn btn-primary" onClick={async () => {
                        const signature = await wallet.signMessage!(new TextEncoder().encode(tokenAddress));
                        setOwnerSignature(Buffer.from(signature).toString('base64'));
                    }}>Sign</button></div> :
                    <Form.Control type="input" value={ownerSignature} readOnly={true}></Form.Control>}
                </div>
            }
        </Form.Group>
        <Form.Group className="mt-5">

    <button className="btn btn-primary" onClick={async () => {
        await wallet.connect();
        const publicKey = wallet.publicKey;
        if (publicKey == null) {
            return;
        }
        const request: ValidationRequest = {
            ownerPublicKey: publicKey.toBase58(),
            credential: tokenAddress,
            signature: ownerSignature!
        }
        props.connector.validateCredential(props.userPublicKey, request, (rsp) => { 
            
            const tx = Transaction.from(Buffer.from(rsp.data, 'base64'));
            
            props.setValidationResult(tx);
        });
    }} disabled={ownerSignature == null}>Send Ownership Proof</button> 
    
    </Form.Group>
    </div>;
}

export const SignAndSendTransactionView = (props: {
    userSecretKey: Uint8Array,
    userPublicKey: string,
    validationResult: Transaction,
    connector: Connector;
}) => {
    const [transactionSignature, setTransactionSignature] = useState<string>('');

    return <>
    <Form.Group className="mt-3">
       <Form.Label>Signed Transaction from Verification Oracle</Form.Label>
       <Form.Control as="textarea" value={JSON.stringify(props.validationResult, null, 2)} readOnly={true} rows={15}/>
       <button className="btn btn-primary" 
           onClick={() => {
                props.validationResult.partialSign({
                   publicKey: new PublicKey(props.userPublicKey),
                   secretKey: props.userSecretKey
               });
               const rawTx = props.validationResult.serialize({verifySignatures: true, requireAllSignatures: true}).toString('base64');
               props.connector.sendSignedTransaction({signedTransaction: rawTx}, (rsp) => {
                   console.log(rsp.data);
                   setTransactionSignature(rsp.data);
               });
           }}>Sign And Send Transactions</button>
   </Form.Group>
   <Form.Group className="mt-3">
       <Form.Label>Transaction Confirmation Result</Form.Label>
       <Form.Control as="textarea" value={transactionSignature} readOnly={true} rows={10}/>
   </Form.Group>
   </>;
}


export const ValidateUser = (props: {
    connector: Connector,
    userSecretKey: Uint8Array
}) => {
    const { userKey } = useParams(); 
    const [validationResult, setValidationResult] = useState<Transaction>();

    return <div className="container">
            <Form>
        {validationResult == null ? 
            <ProvideCredentialView userPublicKey={userKey!}  connector={props.connector}
            setValidationResult={setValidationResult}/> : 
            <SignAndSendTransactionView validationResult={validationResult} userPublicKey={userKey!} userSecretKey={props.userSecretKey} connector={props.connector}/>} 
        </Form>
        
        
        

    </div>
}