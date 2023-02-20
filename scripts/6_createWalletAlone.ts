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
    MultiSigWalletFactory: string;
    Owner: string[];
    OwnerRequired: number;
  };
} = {
  testnet: {
    MultiSigWalletFactory: "",
    Owner: ["0xad085E56F5673FD994453bbCdfe6828aa659Cb0d","0x1a735B9F3555d2f121999C1C1C6057e0afF1a4F9","0x5496F2210ba6906Ac66088F8128BdDe7657D56A1"],
    OwnerRequired: 2,
  },
  espace: {
    MultiSigWalletFactory: "",
    Owner: ["0xEc9Ab75751E9EEd2C50dFE158AEeA02bdf8DE5fB","0xee9988bDF3E98549b4C03cB0D0cfF1F63C72d0c5", "0x18b9d5dBB1Cf5c59ecb0eE0c6AD2b5216C786255",
    "0x14bd1d7bA3B376e8d9Ea1167a7a4cf3C95C924db"],
    OwnerRequired: 3,
  },
};
// let MultiSigWalletFactory: MultiSigWalletFactory;
let MultiSigWallet: MultiSigWallet;

async function main() {
  const [deployer] = await ethers.getSigners();
  const addresses = ADDRESSES[network.name];
  const MultiSigWalletFactory  = await ethers.getContractFactory("MultiSigWallet", deployer);
  MultiSigWallet = await MultiSigWalletFactory.deploy(addresses.Owner, addresses.OwnerRequired);
  await MultiSigWallet.deployed();
  console.log("✅ Deployed MultiSigWallet at:", MultiSigWallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
