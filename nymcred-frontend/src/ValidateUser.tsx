import { useState } from "react";
import { useParams } from "react-router-dom";
import { Connector } from "./net/Connector";
import {PublicKey, Keypair} from '@solana/web3.js';

export const ValidateUser = (props: {
    connector: Connector
}) => {
    const { userToken } = useParams(); 
    const [validationOk, setValidationOk] = useState(false);

    const secret = '';
    const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));


    return <div className="container">
        <h1>Validate {userToken}</h1>
        {!validationOk ? <button className="btn btn-primary" onClick={() => {
            props.connector.validateCredential(userToken!, 'a credential', () => { setValidationOk(true); });
        }}>Send Credential</button> : <div>Validated</div>}
    </div>
}