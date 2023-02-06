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
    NUT: string;
    MultiSigWallet: string;
    Owner: string[];
    OwnerRequired: number;
    transactionId: number;
  };
} = {
  testnet: {
    NUT: "0x1e9890180DC264670BC086ac2084bB3B700fb051",
    MultiSigWallet: "0xe0493ddccfbc2c656ccafe8518dc631a76888ef8",
    Owner: [""],
    OwnerRequired: 2,
    transactionId: 0,
  },
  espace: {
    NUT: "",
    MultiSigWallet: "",
    Owner: [""],
    OwnerRequired: 2,
    transactionId: -1,
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
    var tx = await MultiSigWallet.executeTransaction(addresses.transactionId);
    await tx.wait();
    console.log("✅ executeTransaction:", tx.hash);
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
