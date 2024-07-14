# _lzLend()

P2P Cross-Chain Lending With An Aggregated Cross-Chain Oracle.

## Description

The traditional process of lending in the blockchain space can be quite inefficient. Typically, users need to bridge their funds to a lending protocol on one chain, secure a loan, and then bridge the borrowed funds out to another chain. This multi-step process is not only cumbersome but also incurs additional fees and exposes users to potential security risks during the bridging process.

Introducing _zlLend(), a groundbreaking solution that redefines how lending should work across blockchain networks. _zlLend() seamlessly connects multiple chains, allowing users to deposit collateral on one chain and borrow against it on another, eliminating the need for repetitive bridging. This innovative approach ensures a more efficient, secure, and user-friendly lending experience. Here is how it works:

1. Create a Pool: Liquidity providers can create a lending pool by supplying liquidity for a specific debt token. When setting up a pool, they will need to input key parameters such as the loan term, loan-to-value (LTV) ratio, annual percentage rate (APR), and the chosen debt token. This information helps define the terms of the loans that can be issued from the pool.
2. Deposit Collateral: Borrowers can deposit their collateral on the designated chain. _zlLend() supports a wide range of collateral types, ensuring flexibility and accessibility for users across different blockchain ecosystems.
3. Receive Debt: Once the collateral is deposited, the corresponding debt amount is issued to the borrower on the liquidity source chain. This process is automated and seamless, facilitated by the underlying smart contracts that ensure the security and accuracy of the transaction.
4. Repay Loan: Borrowers have the flexibility to repay their loan before the term ends. Upon repayment, the collateral is returned to the borrower. This early repayment option provides borrowers with the ability to manage their loans efficiently and avoid accruing additional interest.

## How It's Made

The core infrastructure of our system relies on LayerZero, a protocol designed for sending and receiving messages across different blockchain networks. LayerZero enables the relaying of messages encoded with specific instructions to other chains, which we can then use to perform actions seamlessly across these chains. This capability is fundamental to our peer-to-peer cross-chain lending solution, allowing us to execute lending and borrowing operations across multiple blockchains efficiently.

Another crucial component of our infrastructure is the cross-chain oracles. These oracles aggregate price feeds from various chains and relay them to all participating networks. By doing so, we ensure a consistent and reliable source of price data across all chains. This cross-chain oracle system is our single source of truth for lending operations, providing a secure and dependable basis for evaluating collateral and loan terms.

By combining LayerZero's messaging capabilities with our robust cross-chain oracle system, we create a secure, efficient, and interconnected lending platform that transcends the limitations of individual blockchains.

## Deployment

### Front-end

```bash
pnpm install
pnpm run dev
```

### Smart Contracts

Choose the contracts you want to deploy in the `/scripts/massDeploy.sh`.

```bash
chmod +x ./scripts/massDeploy.sh
./scripts/massDeploy.sh
```
