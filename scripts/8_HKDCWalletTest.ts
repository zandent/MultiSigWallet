import { BigNumber, constants } from "ethers";
import { ethers, network } from "hardhat";
import {
  MultiSigWallet
} from "../typechain-types";
import * as fs from 'fs';
import { string } from "hardhat/internal/core/params/argumentTypes";
let MultiSigWallet: MultiSigWallet;
let FiatTokenV2_1 = require(`./FiatTokenV2_1.sol/FiatTokenV2_1.json`);
let FiatTokenProxy = require(`./FiatTokenProxy.sol/FiatTokenProxy.json`);
async function main() {
  const [deployer, deployer2, deployer3] = await ethers.getSigners();
  let iface = new ethers.utils.Interface(FiatTokenV2_1.abi);
  let ifaceProxy = new ethers.utils.Interface(FiatTokenProxy.abi);
  FiatTokenV2_1 = await ethers.getContractAt(FiatTokenV2_1.abi, process.env.FiatToken, deployer);
  FiatTokenProxy = await ethers.getContractAt(FiatTokenProxy.abi, process.env.FiatToken, deployer);
  // await FiatTokenV2_1.updatePauser(process.env.MULTISIGWALLET2);
  // await FiatTokenV2_1.updateBlacklister(process.env.MULTISIGWALLET3);
  // await FiatTokenV2_1.mint("0xD2C381068Af11834BC36941DfeCc00019cAA3d5a", "90000000");
  // return;

  // MULTISIGWALLET0 owner, lost and found
  // MULTISIGWALLET1 masterminter
  // MULTISIGWALLET2 pauser
  // MULTISIGWALLET3 blacklster
  // MULTISIGWALLET4 proxy admin
  //1. configure minter
  let data = iface.encodeFunctionData("configureMinter", ["0x674241ca030Bf7487d46D4Fbf595c64A256E2C85",  "10000000"]);
  let value = ethers.utils.parseEther("0");
  let txId = 0;
  let tx;
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET1, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  console.log(`✅ deployer submitted`);
  return;
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  console.log(`✅ deployer2 confirmed`);
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  console.log(`✅ configureMinter`);
  return;
  //2. pause and unpause
  txId = 0;
  data = iface.encodeFunctionData("pause");
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET2, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  console.log(`✅ deployer submitted`);
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  console.log(`✅ deployer2 confirmed`);
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  console.log(`✅ pause`);
  return;
  txId = txId + 1;
  data = iface.encodeFunctionData("unpause");
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET2, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  console.log(`✅ unpause`);
  return;
  //3.blacklist
  txId = 0;
  data = iface.encodeFunctionData("blacklist", [deployer3.address]);
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET3, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "100000"});
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "200000"});
  await tx.wait();
  console.log(`✅ blacklist`);
  return;
  txId = txId + 1;
  data = iface.encodeFunctionData("unBlacklist", [deployer3.address]);
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET3, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "100000"});
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "200000"});
  await tx.wait();
  console.log(`✅ unBlacklist`);
  return;
  //4. changeadmin
  txId = 0;
  data = ifaceProxy.encodeFunctionData("changeAdmin", [deployer3.address]);
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET4, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "2000000"});
  await tx.wait();
  console.log(`✅ changeAdmin to ${deployer3.address}`);  
  tx = await FiatTokenProxy.connect(deployer3).changeAdmin(process.env.MULTISIGWALLET4);
  await tx.wait();
  console.log(`✅ changeAdmin to ${process.env.MULTISIGWALLET4}`);  
  //5. transfer ownership
  txId = 0;
  data = iface.encodeFunctionData("transferOwnership", [deployer3.address]);
  MultiSigWallet = await ethers.getContractAt("MultiSigWallet", process.env.MULTISIGWALLET0, deployer);
  tx = await MultiSigWallet.connect(deployer).submitTransaction(process.env.FiatToken, value, data);
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer2).confirmTransaction(txId, {gasLimit: "1000000"});
  await tx.wait();
  tx = await MultiSigWallet.connect(deployer3).confirmTransaction(txId, {gasLimit: "2000000"});
  await tx.wait();
  console.log(`✅ transferOwnership to ${deployer3.address}`);  
  tx = await FiatTokenV2_1.connect(deployer3).transferOwnership(process.env.MULTISIGWALLET0);
  await tx.wait();
  console.log(`✅ transferOwnership to ${process.env.MULTISIGWALLET0}`); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
