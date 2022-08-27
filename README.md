Project built entirely during the Solana Hacker House Stockholm 2022 hackathon as a first learning-experience with Solana.

# Nymcred
Anti-spam proof-of-concept based on Solana's multi-signature transactions and immutable PDA storage. 

## The Idea
Thesis: Spam flourishes in communities wherever anyone can create new accounts cheaply. Websites and communities want to offer access to users that are prove ownership of a credential that is expensive to replicate, and have anti-spam and moderation budgets to pay for it. Users are willing to prove themselves to get access, but are not willing to pay for it. 

Solution: This service demonstrates how Solana's multi-signature feature can be used to let a site's wallet pay to post a user's credential verification result on-chain, signed by both a verification oracle and the user. Users that get banned by a site or community using the oracle will not be able to sign up with the same credential again.

## What's in this repo
1. nymcred-backend - The credential validation oracle as a NestJS/Node backend
2. nymcred-frontend - The user's experience as React Frontend
3. nymcred-ws - The Anchor workspace with the Solana smart contract
