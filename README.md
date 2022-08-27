Project built entirely during the Solana Hacker House Stockholm 2022 hackathon as a first learning-experience with Solana.

# Nymcred
Anti-spam proof-of-concept based on Solana's multi-signature transactions and immutable PDA storage. 

## The Idea
Thesis: Website and communities want to offer trustworthy users privileged access and are willing to pay for it through their anti-spam and moderation budgets. Users are willing to prove themselves by presenting signed credentials, but are not willing to pay for it. 

Solution: This service demonstrates how Solana's multi-signature feature can be used to let a site's wallet pay to post a user's verification result, signed by both a verification oracle and the user.

## What's in this repo
1. nymcred-backend - The credential validation oracle as a NestJS/Node backend
2. nymcred-frontend - The user's experience as React Frontend
3. nymcred-ws - The Anchor workspace with the Solana smart contract
