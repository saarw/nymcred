import React, { createContext, useEffect, useState } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorAlert } from './ErrorAlert';
import { Session, SessionContext } from './net/Session';
import { Connector, Connection } from './net/Connector';
import LoginOrRegister from './user/LoginOrRegister';
import { FinishLogin } from './user/FinishLogin';
import Profile from './user/Profile';
import { Api } from './net/Api';
import { StatusButton } from './user/StatusButton';
import { ValidateUser } from './ValidateUser';
import { clusterApiUrl, Keypair } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// const UnauthenticatedContent = (props: {
//   connector: Connector,
//   reinitializeSession: () => void
// }) => {
//   return <div className="container">
//     <Routes>
//         <Route path="/validate/:userToken" element={<ValidateUser connector={props.connector}/>} />
//         <Route path="/finishLogin" element={<FinishLogin connector={props.connector} onLoginSuccess={() => {
//           props.reinitializeSession();
//         }}/>} />
//         <Route path="/register" element={<LoginOrRegister connector={props.connector} isRegister={true}/>} />
//         <Route path="/login" element={<LoginOrRegister connector={props.connector} isRegister={false}/>} />
//         <Route path="*" element={<div>
//           <p>Not logged in. Please <Link to="/login">log in</Link> or <Link to="/register">sign up for a new account</Link></p>
//           </div>}/>
//       </Routes>
//   </div>;
// }; 

const SidebarMenu = () => {
  return <div className="d-flex flex-column mx-3">
    <Link to="/">Home</Link>
    <Link to="profile">User</Link>
  </div>;
}

const AuthenticatedContent = () => {
  return <div className="d-flex flex-column flex-lg-row">
    <SidebarMenu />
    <div className="container">
      <Routes>
        <Route path="/" element={<h2>Main content</h2>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </div>
  </div>;
}

const secret = require('./user-keypair.json');
const keypair = Keypair.fromSecretKey(new Uint8Array(secret));

function App() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const connector = new Connector(setErrorMessage);
  const [session, setSession] = useState<Session>();
  const connectionToSession = (connection: Connection) => {
    if (connection.isAuthenticated) {
      setSession(connection);
    } else {
      setSession(undefined);
    }
  };

  useEffect(() => {
    connector.initializeSession(connectionToSession);
    // setSession(MockSession);
  }, []);

  const endpoint = clusterApiUrl('mainnet-beta')
  const wallet = new PhantomWalletAdapter()

  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={[wallet]}>
      <WalletModalProvider>
    <HashRouter>
    <div className="d-flex flex-column">
      <header>
        <header className="d-flex flex-row justify-content-between">
          <Link to="/" className="text-decoration-none"><h1>Nymcred</h1></Link>
        </header>
      </header>
      <ErrorAlert message={errorMessage} dismissed={() => setErrorMessage(undefined)}/>
      <Routes>
        <Route path="/validate/:userKey" element={<ValidateUser connector={connector} userSecretKey={keypair.secretKey}/>} />
        <Route path="*" element={<div className="container">
          <h1>New user signed up!</h1>
          <p>Let user with public key {keypair.publicKey.toBase58()} provide a credential</p>
          <Link to={'/validate/' + keypair.publicKey.toBase58()}><button className="btn btn-primary">Redirect to Validation Oracle</button></Link>
          </div>}/>
      </Routes> 
      {/* {!session ? 
        <UnauthenticatedContent connector={connector} reinitializeSession={() => connector.initializeSession(connectionToSession)} /> :
        <SessionContext.Provider value={session}>
          <AuthenticatedContent />
        </SessionContext.Provider>} */}
    </div>
    </HashRouter>
    </WalletModalProvider>
    </WalletProvider>
        </ConnectionProvider>
  );
}

const MockSession = {api: new Api(), user: { name: 'test', email: 'test@example.com' }};

export default App;