# Pier Two + Labrys Pectra Staking Manager

This repository contains the source code for the Pectra Staking Manager co-developed by Pier Two and Labrys.

This is a **monorepo** that combines a **Next.js frontend** with **smart contracts**. It uses **pnpm workspaces** for package management, which helps keep both sides of the project in sync.

## Project Structure

The project is divided into two main parts:

- **Frontend**: A **Next.js** app built with the **T3 stack**.
  - Located in the `frontend/` folder.
  - Manages frontend dependencies like React, Next.js, and Tailwind CSS.
  - Can interact with smart contracts.

- **Contracts**: The smart contracts written in **Solidity** (or any other contract framework you're using, like Hardhat or Foundry).
  - Located in the `contracts/` folder.
  - Contains all contract-related code, tests, and deployment scripts.

- **Docs**: The documentation for the application using docusaurus

## Getting Started

### Prerequisites

Ensure you have the following tools installed:
- [Node.js](https://nodejs.org/) (LTS version)
- [pnpm](https://pnpm.io/) (used for package management)

### Install Dependencies

To install dependencies for both the frontend and contracts, run:

```bash
pnpm install
