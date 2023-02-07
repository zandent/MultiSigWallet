import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import {
  MultiSigWalletFactory,
  MultiSigWallet
} from "../typechain-types";
import * as fs from 'fs';
import { string } from "hardhat/internal/core/params/argumentTypes";
const ADDRESSES: {
  [network: string]: {
    MultiSigWallet: string;
    transactionId: number;
  };
} = {
  testnet: {
    MultiSigWallet: "0xe0493ddccfbc2c656ccafe8518dc631a76888ef8",
    transactionId: 0,
  },
  espace: {
    MultiSigWallet: "0xbeb910ae81e3dd1622633660d47443ae37894f75",
    transactionId: 0,
  },
};
let MultiSigWallet: MultiSigWallet;
let ierc20 = require(`./IERC20.sol/IERC20.json`);
async function main() {
  const [deployer] = await ethers.getSigners();
  const addresses = ADDRESSES[network.name];
  if (addresses.MultiSigWallet !== "") {
    MultiSigWallet = await ethers.getContractAt("MultiSigWallet", addresses.MultiSigWallet, deployer);
    console.log("👉 Found MultiSigWallet contract at:", MultiSigWallet.address);
    var tx = await MultiSigWallet.confirmTransaction(addresses.transactionId);
    await tx.wait();
    console.log("✅ confirmTransaction:", tx.hash);
  }else{
    return;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
