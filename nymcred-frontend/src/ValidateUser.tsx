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

    useEffect(() => {
        setOwnerPublicKey(wallet.publicKey?.toBase58());
    }, [wallet])

    return <div className="container">
        <h1>{'Validate ' + userKey}</h1>
        <div>Provide proof of ownership for a credential.</div>
        <Form className="mb-3">
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
        </Form>
        {!validationOk ? <button className="btn btn-primary" onClick={async () => {
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
                console.log(tx);
                console.log(tx.serialize({verifySignatures: true, requireAllSignatures: true}));
                setValidationOk(true); 
            });
        }}>Start Validation</button> : <div>Validated</div>}
    </div>
}