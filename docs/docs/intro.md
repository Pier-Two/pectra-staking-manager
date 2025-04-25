---
sidebar_position: 1
---

# Overview

The Pectra staking management platform has been developed by Labrys in conjunction with Pier Two and Hashlock.

This platform has been developed to leverage the new Pectra upgrade on the Ethereum network. The Pectra upgrade is a significant enhancement combining the "Prague" (execution layer) and "Electra" (consensus layer) upgrades. It encompasses 11 Ethereum Improvement Proposals (EIPs) aimed at improving scalability, staking flexibility, and user experience.

Key features of this upgrade includes:

- Increased validator staking limits (EIP-7251) which allows validators to hold 2,048 ETH rather than the previous 32 ETH.
- Flexible gas payments. This allows users to pay transaction fees using ERC-20 tokens like USDC instead of ETH, providing more flexibility and potentially reducing costs.
- Account Abstraction (EIP-7702): Introduces smart contract-based accounts, allowing users to approve transactions and swap tokens in a single step. This streamlines the user experience by reducing the need for multiple transactions.
- Smart Contract Size Limit Increase (EIP-7907): Raises the contract size limit to 256 KB, enabling more complex decentralized applications (dApps). Contracts exceeding 24 KB will incur additional gas fees to maintain network stability

---

This app aims to assist with the 3 following flows:

- Consolidations
- Deposits
- Withdrawals

Deposits aren't a new addition to this upgrade, but this upgrade does increase the `MAX_EFFECTIVE_BALANCE` of validators so that having more than 32 ETH in a single validator isn't a waste of money.
