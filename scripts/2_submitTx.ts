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
  };
} = {
  testnet: {
    NUT: "0x1e9890180DC264670BC086ac2084bB3B700fb051",
    MultiSigWallet: "0xe0493ddccfbc2c656ccafe8518dc631a76888ef8",
  },
  espace: {
    NUT: "0xfe197e7968807b311d476915db585831b43a7e3b",
    MultiSigWallet: "0xea41549df7196805cd9bb30e790e86389f4c13af",
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
    //Here is the example: the transaction to transfer 100 NUT token to destination address
    let NUTTokenInterface = new ethers.Contract(addresses.NUT, ierc20.abi, deployer);
    var balance = await NUTTokenInterface.balanceOf(addresses.MultiSigWallet);
    console.log("Wallet NUT balance: ", balance.toString());
    let iface = new ethers.utils.Interface(ierc20.abi);
    let data = iface.encodeFunctionData("transfer", ["0x14bd1d7bA3B376e8d9Ea1167a7a4cf3C95C924db", ethers.utils.parseEther("10000")]);
    let value = ethers.utils.parseEther("0");
    console.log("👉 Transaction Info:");
    console.log("    destination:", addresses.NUT);
    console.log("    value:", value);
    console.log("    data:", data);
    console.log("    already executed:", false);
    var tx = await MultiSigWallet.submitTransaction(addresses.NUT, value, data);
    await tx.wait();
    console.log("✅ submitTransaction:", tx.hash);
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
