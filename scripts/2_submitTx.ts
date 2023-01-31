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
  };
} = {
  testnet: {
    NUT: "0x1e9890180DC264670BC086ac2084bB3B700fb051",
    MultiSigWallet: "0xe0493ddccfbc2c656ccafe8518dc631a76888ef8",
    Owner: [""],
    OwnerRequired: 2,
  },
  espace: {
    NUT: "",
    MultiSigWallet: "",
    Owner: [""],
    OwnerRequired: 2,
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
    let data = iface.encodeFunctionData("transfer", ["0x05b221bF662664fBB520e72D895AACAcb40ae039", ethers.utils.parseEther("100")]);
    var tx = await MultiSigWallet.submitTransaction(addresses.NUT, 0, data);
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
