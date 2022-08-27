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

export const ValidateUser = (props: {
    connector: Connector,
    userSecretKey: Uint8Array
}) => {
    const wallet = useWallet();

    const { userKey } = useParams(); 
    const [validationOk, setValidationOk] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('9GihPakYConxRfWnuQj1Le83rTkxNaGKUNF9Xxz8on72');
    const [ownerPublicKey, setOwnerPublicKey] = useState(wallet.publicKey?.toBase58());
    const [ownerSignature, setOwnerSignature] = useState<string>();
    const [signedTransaction, setSignedTransaction] = useState<string>('');
    const [transactionSignature, setTransactionSignature] = useState<string>('');


    useEffect(() => {
        setOwnerPublicKey(wallet.publicKey?.toBase58());
    }, [wallet])

    return <div className="container">
        <h1>{'Validate ' + userKey}</h1>
        <div>Provide proof of ownership for a credential.</div>
        <Form>
            <Form.Group>
                <Form.Label>NFT token account</Form.Label>
                <Form.Control type="input" value={tokenAddress} onChange={(e) => setTokenAddress(e.currentTarget.value)}/>
            </Form.Group>
            <Form.Group>

                <Form.Label>Owner </Form.Label>
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
            <Form.Group className="mt-3">

        {signedTransaction.length === 0 ? <button className="btn btn-primary" onClick={async () => {
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
            props.connector.validateCredential(userKey!, request, (rsp) => { 
                
                const tx = Transaction.from(Buffer.from(rsp.data, 'base64'));
                console.log(tx);
                tx.partialSign({
                    publicKey: new PublicKey(userKey!),
                    secretKey: props.userSecretKey
                });
                setSignedTransaction(tx.serialize({verifySignatures: true, requireAllSignatures: true}).toString('base64'));
            });
        }}>Start Validation</button> : <div>Validated</div>}
        </Form.Group>
        <Form.Group className="mt-3">
            <Form.Label>Signed Transaction </Form.Label>
            <Form.Control type="input" value={signedTransaction} onChange={(e) => setSignedTransaction(e.currentTarget.value)} readOnly={true}/>
            <button className="btn btn-primary" disabled={signedTransaction.length === 0}
                onClick={() => {
                    props.connector.sendSignedTransaction({signedTransaction}, (rsp) => {
                        console.log(rsp.data);
                        setTransactionSignature(rsp.data);
                    });
                }}>Send Signed Transactions</button>
        </Form.Group>
        <Form.Group className="mt-3">
            <Form.Label>Transaction Confirmation Signature</Form.Label>
            <Form.Control type="input" value={transactionSignature} readOnly={true}/>
        </Form.Group>
        </Form>
        
        
        

    </div>
}