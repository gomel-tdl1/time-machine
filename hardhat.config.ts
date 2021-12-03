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
        url: "https://eth-kovan.alchemyapi.io/v2/62xpk7ctulRN4tFUvrHu-yF7thYJXXP5",
      }
    }
  },
};

export default config;
