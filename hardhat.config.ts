import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./tasks/timeTravel";
import { HttpNetworkUserConfig, NetworksUserConfig, NetworkUserConfig } from "hardhat/types";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const forkNetwork = process.env.FORK_NETWORK ?? 'bumperChainAlpha';

console.log('Forking network is: ', forkNetwork);

const configs: NetworksUserConfig = {
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
  },
  main: {
    url: "https://eth-mainnet.g.alchemy.com/v2/xD6ljTKosJH4LJ0QJedVyf1uxMNYh8PE",
    chainId: 1,
  },
  goerli: {
    url: "https://eth-goerli.g.alchemy.com/v2/47JBE-y187Y_InTRDytGBQm1Sz-Dv6wM",
    chainId: 5,
  },
  bumperChainAlpha: {
    url: "https://alpha.rpc.bumper-dao.com/rpc",
    chainId: 12345,
  },
}

const config: HardhatUserConfig = {
  networks: {
    ...configs,
    hardhat: {
      chainId: 31337,
      forking: {
        url: (configs[forkNetwork] as HttpNetworkUserConfig)?.url ?? '',
      }
    },
  },
  mocha: {
    timeout: 100000000
  },
};

export default config;
