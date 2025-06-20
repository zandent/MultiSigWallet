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
  sepolia: {
    Owner: [[
        "0xcd372B293ca6C5be6a6B3C3a8a772A48572E5F8f",
        "0xf912A1EfEf43e874A9AcDEeb45eb2A8607DeC272",
        "0x34E6EE9A246eCf794EBA0b4b3e059c7245999447",
        "0x5caB40A1f117CB3657C630Ca3443cEb7EF13A1C6",
      ],
    [
        "0xcd372B293ca6C5be6a6B3C3a8a772A48572E5F8f",
        "0xf912A1EfEf43e874A9AcDEeb45eb2A8607DeC272",
        "0x34E6EE9A246eCf794EBA0b4b3e059c7245999447",
        "0x5caB40A1f117CB3657C630Ca3443cEb7EF13A1C6",
      ],
    [
        "0xcd372B293ca6C5be6a6B3C3a8a772A48572E5F8f",
        "0xf912A1EfEf43e874A9AcDEeb45eb2A8607DeC272",
        "0x34E6EE9A246eCf794EBA0b4b3e059c7245999447",
        "0x5caB40A1f117CB3657C630Ca3443cEb7EF13A1C6",
      ],
    [
        "0xcd372B293ca6C5be6a6B3C3a8a772A48572E5F8f",
        "0xf912A1EfEf43e874A9AcDEeb45eb2A8607DeC272",
        "0x34E6EE9A246eCf794EBA0b4b3e059c7245999447",
        "0x5caB40A1f117CB3657C630Ca3443cEb7EF13A1C6",
      ],
    [
        "0xcd372B293ca6C5be6a6B3C3a8a772A48572E5F8f",
        "0xf912A1EfEf43e874A9AcDEeb45eb2A8607DeC272",
        "0x34E6EE9A246eCf794EBA0b4b3e059c7245999447",
        "0x5caB40A1f117CB3657C630Ca3443cEb7EF13A1C6",
      ],
    ],
    OwnerRequired: 3,
  },
  eth: {
    Owner:
    [
      ["0xd335886e7c547207b67c87da2718e57d64fcca05","0x7c5809e789aA15E0AfFd826a5e1CBdb846263257","0xf80bff9cfbdbeb87e768994e4e52294f8a421d4e","0x918045CEec4Cb26Be19e1103ABACa6A178628d13",],
      ["0xccef4766247dbe38ea08f3516e762e8e1ae049df","0xfe0ef5959cae1e47609b4e987662fa3ddd67b0b5","0xca7554f86a176b4080b654729b67d1bca6d73503","0x213C69cAB0839235Ec792A118F857735ee8bb8eE",],
      ["0x568b70496c5f39946d870917a59135bf55778215","0x29e7791091185ce7b944424010236c91a2d7f525","0xb5393a3f653833111e95aa92a1807f851e6beeb0","0x657b4985cFAA2d34C08cd2DfCbBc63D56946708F",],
      ["0x1920fae5dc9f583fff8bee32906931dd752343e4","0x0d14629fa8152159956505c3690e14ab254e9c7a","0x121fa9957c1744d7dcf3c72c9ebe1327a6cecd03","0x5892b0217D2cd5426b67246859F42551D31ACdCA",],
      ["0x2C98C1f473Fd7b8C08317de32Bf8Ef5620F78612","0x5d2ae6086639f3349e091eda5eae9b206dd2b292","0x5234040CC5722fb7574f472548A2fde8c4816E01","0x1891fA3e47dF16CF7c5E453cFA2557c802cd0dC0",],
    ],
    OwnerRequired: 3,
  },
  espace: {
    Owner: [
      [
        "0xb987A2dFfb989677Cb101a6A92EBeAe877cD7BD2",
        "0x81C4d9771b893D83de033C496FF5071def7D79B6",
        "0xbBA02240e89197b50A9DfbB88787Ad855154bE6c",
        "0x3D01EdF635D198Eb4Cf52B9828fbaa123d2Da3b4",
      ],
      [
        "0x311c5F43E7b5AdcC6329A64FC943Fe3C92fbBA38",
        "0x53F2Ec2f50aC9182F7E8CE38e5091D2dC4dd188c",
        "0x68b0BbcEc23b1451B29BC648E0E8065Ccc300235",
        "0x134586B2Ea4A13c208590568668C21B13457aD26",
      ],
      [
        "0x0f9de607900980df7c7e5783d289491b48297470",
        "0x761f58a4bF95c90BbDA222170B2941C157040c98",
        "0xc49c67772d5E019C712D1dd60adf48c8cf7671D5",
        "0x3A06A0bA0f36D1dE19e310A2867d63a612D73eC5",
      ],
      [
        "0x68f35214bCadf9A7d12Afa2b45Bd67Eed2931237",
        "0x4FDC8ad16E117A0a855d0c668E633f909C523FbB",
        "0xb178AEc519600858f1A27292D3a912817818780f",
        "0x86c7159b3BF6e2d61484320fDc7a2E67Be904a8B",
      ],
      [
        "0xCA7AC1cA1887AFD919096Bb2832d0F39FD513681",
        "0x8138a76a1848fE7bC15B5e2e1a1DF2f6E2a32EB6",
        "0x25235cFC66b2F3f9b1588677c891F038CF018DA1",
        "0x15e05dae15e14af14704ec32610f30eb327e2Cd4",
      ],
    ],
    OwnerRequired: 3,
  },
};
// let MultiSigWalletFactory: MultiSigWalletFactory;
let MultiSigWallet: MultiSigWallet;

async function main() {
  const [deployer] = await ethers.getSigners();
  const addresses = ADDRESSES[network.name];
  const multiSigWallet  = await ethers.getContractFactory("MultiSigWallet", deployer);
  let wallet = ethers.Wallet.createRandom()
    console.log('mnemonic:', wallet.mnemonic.phrase)
    console.log('address:', wallet.address)
    console.log('privateKey:', wallet.privateKey)
    return;
  for(var i = 0; i < addresses.Owner.length; i++){
    // let wallet = ethers.Wallet.createRandom()
    // console.log('mnemonic:', wallet.mnemonic.phrase)
    // console.log('address:', wallet.address)
    // console.log('privateKey:', wallet.privateKey)

    // MultiSigWallet = await multiSigWallet.deploy(addresses.Owner[i], addresses.OwnerRequired);
    // await MultiSigWallet.deployed();
    // console.log(`MULTISIGWALLET${i}=${MultiSigWallet.address}`);

    // for(var j = 0; j < addresses.Owner[i].length; j++){
    //   const tx = await deployer.sendTransaction({
    //     to: addresses.Owner[i][j],
    //     value: '10000000000000000',
    //     // value: ethers.utils.parseUnits('9', 'ether'),
    //   });
    //   await tx.wait();
    //   console.log(`Sent to ${addresses.Owner[i][j]} hash: ${tx.hash}`);
    // }
    break;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
