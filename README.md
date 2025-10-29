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

### To increase the time

```
yarn addtime 1d2h
```

the following abbreviations are available:

```
'nanosecond' | 'ns'
'µs' | 'μs' | 'us' | 'microsecond'
'millisecond' | 'ms'
'second' | 'sec' | 's'
'minute' | 'min' | 'm'
'hour' | 'hr' | 'h'
'day' | 'd'
'week' | 'wk' | 'w'
'month' | 'b'
'year' | 'yr' | 'y'
```

### To show curent time in blockchain

```
yarn now
```
