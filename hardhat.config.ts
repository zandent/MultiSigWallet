import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.7.6",
  networks: {
    hardhat: {
      blockGasLimit: 60000000,
    },
    espacetesting: {
      url: "https://evm.confluxrpc.com",
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    testnet: {
      url: "https://evmtestnet.confluxrpc.com",
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    espace: {
      url: "https://evm.confluxrpc.com",
      gasPrice: 20000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
