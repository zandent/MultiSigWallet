import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import {
  MultiSigWallet
} from "../typechain-types";
import * as fs from 'fs';
import { string } from "hardhat/internal/core/params/argumentTypes";
const ADDRESSES: {
  [network: string]: {
    Owner: string[][];
    OwnerRequired: number;
  };
} = {
  testnet: {
    Owner: [["0x9AE0848729b46E66912018d6d9d18c8363F22249","0x2Fe1f990312FFb55E690C2e8633b8CCa79B953a0",
    "0x341207a98fd87C7C7089478195C69E28A055b86C",
    "0x56cEcAee5a1d42412ab88B0D0ebdf4BC6d12d98C"]],
    OwnerRequired: 2,
  },
  espace: {
    Owner: [["0xEc9Ab75751E9EEd2C50dFE158AEeA02bdf8DE5fB","0xee9988bDF3E98549b4C03cB0D0cfF1F63C72d0c5", "0x18b9d5dBB1Cf5c59ecb0eE0c6AD2b5216C786255",
    "0x14bd1d7bA3B376e8d9Ea1167a7a4cf3C95C924db"]],
    OwnerRequired: 3,
  },
};
// let MultiSigWalletFactory: MultiSigWalletFactory;
let MultiSigWallet: MultiSigWallet;

async function main() {
  const [deployer] = await ethers.getSigners();
  const addresses = ADDRESSES[network.name];
  const multiSigWallet  = await ethers.getContractFactory("MultiSigWallet", deployer);
  for(var i = 0; i < 5; i++){
    MultiSigWallet = await multiSigWallet.deploy(addresses.Owner[0], addresses.OwnerRequired);
    await MultiSigWallet.deployed();
    console.log(`MULTISIGWALLET${i}=${MultiSigWallet.address}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
