Project built entirely during the Solana Hacker House Stockholm 2022 hackathon as a first learning-experience with Solana.

# Nymcred
Anti-spam proof-of-concept based on Solana's multi-signature transactions and immutable PDA storage. 

## The Idea
Thesis: Spam flourishes in communities wherever anyone can create new accounts cheaply. Websites and communities want to offer access to users that prove ownership of a credential that is expensive to replicate, and have anti-spam and moderation budgets to pay for it. Users are willing to prove themselves to get access, but are not willing to pay for it. 

Solution: This service demonstrates how Solana's multi-signature feature can be used to let a site's wallet pay to post a user's credential verification result on-chain, signed by both a verification oracle and the user. Solana's immutable PDA storage is used to prevent users that get banned from verifying with the same credential again, forcing spammers to come up with new expensive credentials for every account they create.

## What's in this repo
1. nymcred-backend - The credential validation oracle as a NestJS/Node backend
2. nymcred-frontend - The user's experience as React Frontend
3. nymcred-ws - The Anchor workspace with the Solana smart contract

## Installation
Install Node and [Anchor](https://book.anchor-lang.com/getting_started/installation.html) along with the Solana CLI. Start a local test validator.

Clone the nymcred repo

#### In the nymcred-backend directory
- Run ```npm install``` to install the backend dependencies
- Generate a Solana keypair used by the service to sign proofs and deploy the contract. Store the keypair file at
```nymcred-backend/src/nymcred-keypair.json```
- Start the backend with ```npm start```

#### In the nymcred-frontend directory
- Run ```npm install``` to install frontend dependencies.
- Generate a Solana keypair for the user that wants to validate. Store the keypair file at
```nymcred-frontend/src/user-keypair.json```
- Start the frontend with ```npm start```

#### In the nymcred-ws directory
- Run ```anchor build``` to build the smart contract
- Set the backend's keypair as default in the Solana CLI ```solana config set --keypair nymcred-backend/src/nymcred-keypair.json```
- Possibly airdrop the keypair some Solana ```solana airdrop 100```
- Deploy the contract to your test validator ```solana program deploy nymcred-ws/target/deploy/nymcred.so```

Now you can visit the UI in http://localhost:3000/
