import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "./tasks/timeTravel";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  networks: {
    
    local: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
      forking: {
        url: "https://eth-goerli.alchemyapi.io/v2/-ArWHOOYvAQ-o_Tlr08aE2GQX5hmBuvf",
      }
    }
  },
};

export default config;
