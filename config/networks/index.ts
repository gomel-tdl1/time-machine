import { HardhatNetworkUserConfig, NetworkUserConfig } from 'hardhat/types';

import { GWEI } from '../constants';
import { ENV } from '../env';
import { ConfigPerNetwork, Network, RpcUrl } from '../types';

const { ALCHEMY_KEY, INFURA_KEY, FORKING_BLOCK_NUMBER, FORKING_CHAIN_ID } = ENV;

export const rpcUrls: ConfigPerNetwork<RpcUrl> = {
  base: ALCHEMY_KEY
    ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : `https://base.llamarpc.com`,
  mainnet: ALCHEMY_KEY
    ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  hardhat: 'http://localhost:8545',
  localhost: 'http://localhost:8545',
};

export const gasPrices: ConfigPerNetwork<number | 'auto' | undefined> = {
  base: 'auto',
  mainnet: 'auto',
  hardhat: 0,
  localhost: 70 * GWEI,
};

const forkingChainId = FORKING_CHAIN_ID ?? 31337;

export const chainIds: ConfigPerNetwork<number> = {
  base: 8453,
  mainnet: 1,
  hardhat: forkingChainId,
  localhost: forkingChainId,
};

export const gases: ConfigPerNetwork<number | undefined> = {
  base: undefined,
  mainnet: undefined,
  hardhat: undefined,
  localhost: undefined,
};

export const timeouts: ConfigPerNetwork<number | undefined> = {
  base: undefined,
  mainnet: undefined,
  hardhat: undefined,
  localhost: 999999,
};

export const blockGasLimits: ConfigPerNetwork<number | undefined> = {
  base: undefined,
  mainnet: undefined,
  hardhat: 300 * 10 ** 6,
  localhost: undefined,
};

export const initialBasesFeePerGas: ConfigPerNetwork<number | undefined> = {
  base: undefined,
  mainnet: undefined,
  hardhat: 0,
  localhost: undefined,
};

export const getBaseNetworkConfig = (network: Network): NetworkUserConfig => ({
  chainId: chainIds[network],
  gas: gases[network],
  gasPrice: gasPrices[network],
  blockGasLimit: blockGasLimits[network],
  timeout: timeouts[network],
  initialBaseFeePerGas: initialBasesFeePerGas[network],
});

export const getNetworkConfig = (
  network: Network,
  forkingNetwork?: Network,
): NetworkUserConfig => ({
  ...getBaseNetworkConfig(forkingNetwork ?? network),
  url: rpcUrls[network],
  chainId: chainIds[network],
});

export const getForkNetworkConfig = (
  network: Network,
): HardhatNetworkUserConfig => ({
  ...getBaseNetworkConfig(network),
  accounts: {
    mnemonic: 'test test test test test test test test test test test junk',
  },
  mining: {
    auto: false,
    interval: 1000,
  },
  forking: {
    url: rpcUrls[network],
    enabled: true,
    blockNumber: FORKING_BLOCK_NUMBER,
  },
});

export const getHardhatNetworkConfig = (): HardhatNetworkUserConfig => ({
  ...getBaseNetworkConfig('hardhat'),
  accounts: {
    mnemonic: 'test test test test test test test test test test test junk',
  },
  forking: {
    url: rpcUrls['hardhat'],
    enabled: true,
    blockNumber: FORKING_BLOCK_NUMBER,
  },
});
