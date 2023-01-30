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
    Owner: ["0xad085E56F5673FD994453bbCdfe6828aa659Cb0d","0x1a735B9F3555d2f121999C1C1C6057e0afF1a4F9","0x5496F2210ba6906Ac66088F8128BdDe7657D56A1"],
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
  const [deployer, owner2, owner3] = await ethers.getSigners();
  const addresses = ADDRESSES[network.name];
  if (addresses.MultiSigWallet !== "") {
    MultiSigWallet = await ethers.getContractAt("MultiSigWallet", addresses.MultiSigWallet, owner2);
    console.log("👉 Found MultiSigWallet contract at:", MultiSigWallet.address);
    let NUTTokenInterface = new ethers.Contract(addresses.NUT, ierc20.abi, owner2);
    var balance = await NUTTokenInterface.balanceOf(addresses.MultiSigWallet);
    console.log("Wallet NUT balance: ", balance.toString());
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
