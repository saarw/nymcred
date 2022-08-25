import React, { useState, useEffect } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Connector } from '../net/Connector';

/**
 * Page where users get directed to from their e-mail link to login.
 */
export const FinishLogin = (props: {
  onLoginSuccess: () => void,
  connector: Connector
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState('');
  let state = searchParams.get('state');
  useEffect(() => {
    if (state) {
      props.connector.verifyLink(state, () => {
        props.onLoginSuccess();
        navigate('/');
      });
    }
  }, [state]);
  return state ? 
    <div><h3>Verifying login link...</h3></div> : 
    <div>
    <h3>Check your e-mail and click on the login link. Or copy the code here  </h3>
    <input className="form-text w-75" type="text" value={code} onChange={(e) => {
      setCode(e.currentTarget.value);
    }} />
    <button className="btn btn-primary btn-sm ms-2" onClick={() => {
      props.connector.verifyLink(code, () => {
        props.onLoginSuccess();
        navigate('/');
      });
    }}>Submit</button>
  </div>;
}