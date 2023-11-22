import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import {
  MultiSigWallet
} from "../typechain-types";
import * as fs from 'fs';
import { string } from "hardhat/internal/core/params/argumentTypes";
let MultiSigWallet: MultiSigWallet;
let FiatTokenV2_1 = require(`./FiatTokenV2_1.sol/FiatTokenV2_1.json`);
async function main() {
  const [deployer] = await ethers.getSigners();
  let iface = new ethers.utils.Interface(FiatTokenV2_1.abi);
  let data = iface.encodeFunctionData("configureMinter", [deployer.address, ("1000000000"]);
  let value = ethers.utils.parseEther("0");
  console.log("👉 Transaction Info:");
  console.log(`    destination: ${process.env.FiatToken}`);
  console.log("    value:", value);
  console.log("    data:", data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
