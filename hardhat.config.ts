import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkUserConfig, NetworksUserConfig } from "hardhat/types";
import "./tasks/timeTravel";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const forkNetwork = process.env.FORK_NETWORK ?? "main";
const alchemyKey = process.env.ALCHEMY_KEY ?? "";

console.log("Forking network is: ", forkNetwork);

const configs: NetworksUserConfig = {
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 1337,
  },
  main: {
    url: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    chainId: 1,
  },
  base: {
    url: `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    chainId: 8453,
  },
  arbitrum: {
    url: `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    chainId: 42161,
  },
  optimism: {
    url: `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    chainId: 10,
  },
  avalanche: {
    url: `https://avax-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    chainId: 43114,
  },
};

const config: HardhatUserConfig = {
  networks: {
    ...configs,
    hardhat: {
      mining: {
        auto: true,
        interval: 3000,
      },
      chainId: 1337,
      initialBaseFeePerGas: 100000000,
      forking: {
        url: (configs[forkNetwork] as HttpNetworkUserConfig)?.url ?? "",
        blockNumber: process.env.FORK_BLOCK_NUMBER
          ? parseInt(process.env.FORK_BLOCK_NUMBER)
          : undefined,
      },
    },
  },
  mocha: {
    timeout: 100000000,
  },
};

export default config;
