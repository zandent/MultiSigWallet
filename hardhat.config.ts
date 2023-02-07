import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.4.15",
  networks: {
    hardhat: {
      blockGasLimit: 60000000,
    },
    espacetesting: {
      url: "https://evm.confluxrpc.com",
      gasPrice: 10000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    testnet: {
      url: "https://evmtestnet.confluxrpc.com",
      gasPrice: 10000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    espace: {
      url: "https://evm.confluxrpc.com",
      gasPrice: 10000000000,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
