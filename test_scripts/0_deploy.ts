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
    Marketing: string[];
    MarketingRequired: number;
    Treasury: string[];
    TreasuryRequired: number;
    DAO: string[];
    DAORequired: number;
  };
} = {
  testnet: {
    MultiSigWalletFactory: "",
    Marketing: ["0xad085E56F5673FD994453bbCdfe6828aa659Cb0d","0x1a735B9F3555d2f121999C1C1C6057e0afF1a4F9","0x5496F2210ba6906Ac66088F8128BdDe7657D56A1"],
    MarketingRequired: 2,
    Treasury: [""],
    TreasuryRequired: 2,
    DAO: [""],
    DAORequired: 2,
  },
  espace: {
    MultiSigWalletFactory: "",
    Marketing: [""],
    MarketingRequired: 2,
    Treasury: [""],
    TreasuryRequired: 2,
    DAO: [""],
    DAORequired: 2,
  },
};
let MultiSigWalletFactory: MultiSigWalletFactory;

async function main() {
  const [deployer, owner2, owner3] = await ethers.getSigners();
  const addresses = ADDRESSES[network.name];
  if (addresses.MultiSigWalletFactory !== "") {
    MultiSigWalletFactory = await ethers.getContractAt("MultiSigWalletFactory", addresses.MultiSigWalletFactory, deployer);
    console.log("👉 Found MultiSigWalletFactory contract at:", MultiSigWalletFactory.address);
  }else{
    const MultiSigWalletFactoryFactory  = await ethers.getContractFactory("MultiSigWalletFactory", deployer);
    MultiSigWalletFactory = await MultiSigWalletFactoryFactory.deploy();
    await MultiSigWalletFactory.deployed();
    console.log("✅ Deployed MultiSigWalletFactory at:", MultiSigWalletFactory.address);
    addresses.MultiSigWalletFactory = MultiSigWalletFactory.address;
  }
  var tx = await MultiSigWalletFactory.create([deployer.address, owner2.address, owner3.address], 2);
  await tx.wait();
  console.log("✅ Create a new Wallet:", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
