# Fork Ethereum Time Machine

## Description

This is a hardhat project that forked goerli to make frontend testing easier.

## Requirements

You must have modern nodejs installed

## Prepare

Install the required packages

```
yarn
```

## Usage

### Create fork

```
yarn fork
```

After running this command, a fork of the goerli network will be created, and the RPC server on htpp://localhost:8545 will start

### Tasks

#### `addtime` - Increase the timestamp of the last block

Increases the timestamp of the last block by the specified time interval.

```
yarn addtime <time>
```

Examples:

```
yarn addtime 1d2h
yarn addtime 1h30m
yarn addtime 2d
yarn addtime 45m
```

Time format: you can specify time as a combination like `1y2w3d4h5m6s` (e.g. `1h30m`). Supported units:

- `y` - year
- `w` - week
- `d` - day
- `h` - hour
- `m` - minute
- `s` - second

After increasing the time, it will mine a new block and show the current block timestamp.

#### `now` - Show current time in blockchain

Displays the current timestamp of the latest block in the blockchain.

```
yarn now
```

Output shows the block datetime in UTC format and as a Unix timestamp.

#### `addBalance` - Transfer ERC20 tokens

Transfers ERC20 tokens from a holder account to a recipient account. This task impersonates the holder account to execute the transfer.

```
yarn addBalance --token <token_address> --holder <holder_address> --recipient <recipient_address> --amount <amount>
```

Parameters:

- `token` - Token contract address (0x...)
- `holder` - Address of the account holding the tokens (0x...)
- `recipient` - Address to receive the tokens (0x...)
- `amount` - Amount to transfer in human-readable format (e.g. 1000, 0.5)

Example:

```
yarn addBalance --token 0x1234... --holder 0xabcd... --recipient 0x5678... --amount 1000
```

#### `addBalanceETH` - Send ETH

Sends ETH from a holder account to a recipient account. This task impersonates the holder account to execute the transfer.

```
yarn addBalanceETH --holder <holder_address> --recipient <recipient_address> --amount <amount>
```

Parameters:

- `holder` - Address of the account holding the ETH (0x...)
- `recipient` - Address to receive the ETH (0x...)
- `amount` - Amount to send in Ether (e.g. 0.5, 1.0, 100)

Example:

```
yarn addBalanceETH --holder 0xabcd... --recipient 0x5678... --amount 10
```

#### `mine` - Mine a single block

Mines a single block in the local blockchain.

```
yarn mine
```

This is useful for advancing the blockchain by one block without changing the timestamp.
