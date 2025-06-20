import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import {
  MultiSigWallet
} from "../typechain-types";
import * as fs from 'fs';
import { string } from "hardhat/internal/core/params/argumentTypes";
const blacklistedAddr="0x14ee474d9Ac1d505B3b0fe6a3b0A8c646E2e9C9D";
let MultiSigWallet: MultiSigWallet;
let FiatTokenV2_1 = require(`./FiatTokenV2_1.sol/FiatTokenV2_1.json`);
let FiatTokenProxy = require(`./FiatTokenProxy.sol/FiatTokenProxy.json`);
async function main() {
    await freezeUnfreeze();
}

main().catch(console.log);
async function freezeUnfreeze() {
    const [deployer, blacklisterOwner] = await ethers.getSigners();
    let iface = new ethers.utils.Interface(FiatTokenV2_1.abi);
    let ifaceProxy = new ethers.utils.Interface(FiatTokenProxy.abi);
    FiatTokenV2_1 = await ethers.getContractAt(FiatTokenV2_1.abi, process.env.FiatToken, deployer);
    FiatTokenProxy = await ethers.getContractAt(FiatTokenProxy.abi, process.env.FiatToken, deployer);
    // MULTISIGWALLET0 owner, lnf
    // MULTISIGWALLET1 masterminter
    // MULTISIGWALLET2 pauser
    // MULTISIGWALLET3 blacklster
    // MULTISIGWALLET4 proxy admin
    let data, txId, tx;
    let value = ethers.utils.parseEther("0");

    //3.blacklist
    data = iface.encodeFunctionData("blacklist", [blacklistedAddr]);
    MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET3, deployer);
    tx = await MultiSigWallet.connect(blacklisterOwner).submitTransaction(process.env.FiatToken, value, data);
    await tx.wait();
    console.log(`✅ blacklist submitted for ${blacklistedAddr}`);

    // 3.1. unblacklist
    // data = iface.encodeFunctionData("unBlacklist", [blacklistedAddr]);
    // MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET3, deployer);
    // tx = await MultiSigWallet.connect(blacklisterOwner).submitTransaction(process.env.FiatToken, value, data);
    // await tx.wait();
    // console.log(`✅ unBlacklist submitted for ${blacklistedAddr}`);
}