import React, { useState } from 'react'; 
import { useNavigate } from 'react-router';
import { Connector } from '../net/Connector';

/**
 * View that lets users log in or register.
 */
function LoginOrRegister(props: {
    isRegister: boolean,
    connector: Connector
}) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isFinished, setFinished] = useState(false);
  return  isFinished ? <div>Magic link sent! Check your e-mail for a link to login.</div>
    : <form>
    <legend>{props.isRegister ? 'Register' : 'Login'}</legend>
    {props.isRegister ?
    <div className="form-group row no-gutters">
      <label className="col-2 col-form-label">Name</label>
      <input className="col-10 form-control" type="text" value={name} onChange={(e) => {setName(e.currentTarget.value)}}></input>
    </div> : 
    <></>}
    <div className="form-group row no-gutters">
      <label className="col-2 col-form-label">E-mail</label>
      <input className="col-10 form-control" type="email" value={email} onChange={(e) => {setEmail(e.currentTarget.value)}}></input>
    </div>
    <button className="btn btn-outline-primary" type="button" onClick={() => {
      props.isRegister ? 
        props.connector.register(name, email, () => { navigate('/finishLogin') }) :
        props.connector.requestMagicLinkLogin(email, () => { navigate('/finishLogin') });
    }}>Submit</button>
  </form>;
}

export default LoginOrRegister;