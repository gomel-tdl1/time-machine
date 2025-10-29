import { type HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';
import './tasks';

import {
  ENV,
  getForkNetworkConfig,
  getHardhatNetworkConfig,
  getNetworkConfig,
  Network,
} from './config';

const { FORKING_NETWORK } = ENV;

const config: HardhatUserConfig = {
  networks: {
    mainnet: getNetworkConfig('mainnet'),
    base: getNetworkConfig('base'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hardhat: FORKING_NETWORK
      ? getForkNetworkConfig(FORKING_NETWORK)
      : getHardhatNetworkConfig(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localhost: FORKING_NETWORK
      ? getForkNetworkConfig(FORKING_NETWORK)
      : getNetworkConfig('localhost', FORKING_NETWORK as unknown as Network),
  },
};

export default config;
