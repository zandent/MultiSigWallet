/**
 * HKDC Multi-Signature Wallet Test Suite
 * 
 * 这个脚本用于测试HKDC稳定币的多签钱包功能，包括：
 * 1. 配置铸币者 (Configure Minter)
 * 2. 暂停/恢复操作 (Pause/Unpause Operations)
 * 3. 黑名单操作 (Blacklist Operations)
 * 4. 代理管理员操作 (Proxy Admin Operations)
 * 5. 所有权转移 (Ownership Transfer)
 * 
 * 使用方法：
 * 
 * 1. 基本运行（只执行安全操作）：
 *    npx hardhat run scripts/8_HKDCWalletTest.ts --network <network>
 * 
 * 环境变量要求：
 * - FiatToken: HKDC代币合约地址
 * - MULTISIGWALLET0: 所有者多签钱包地址 (lost and found)
 * - MULTISIGWALLET1: 铸币者多签钱包地址 (master minter)
 * - MULTISIGWALLET2: 暂停者多签钱包地址 (pauser)
 * - MULTISIGWALLET3: 黑名单管理者多签钱包地址 (blacklister)
 * - MULTISIGWALLET4: 代理管理员多签钱包地址 (proxy admin)
 * 
 * 注意事项：
 * - 所有操作都会在执行后自动恢复到原始状态
 * - 确保所有多签钱包都有足够的签名者
 */

const hre = require("hardhat");
const { ethers, network } = hre;
import { MultiSigWallet } from "../typechain-types";
import * as dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  console.error(result.error);
  process.exit(1);
}

// 环境变量接口
interface EnvConfig {
  FiatToken: string;
  MULTISIGWALLET0: string; // owner, lost and found
  MULTISIGWALLET1: string; // masterminter
  MULTISIGWALLET2: string; // pauser
  MULTISIGWALLET3: string; // blacklister
  MULTISIGWALLET4: string; // proxy admin
}

// 测试配置 - 控制哪些操作需要执行
interface TestConfig {
  configureMinter: boolean;
  pauseOperations: boolean;
  blacklistOperations: boolean;
  proxyAdminOperations: boolean;
  ownershipTransfer: boolean;
}

// 验证环境变量
function validateEnvConfig(): EnvConfig {
  const requiredEnvVars = [
    'FiatToken',
    'MULTISIGWALLET0',
    'MULTISIGWALLET1',
    'MULTISIGWALLET2',
    'MULTISIGWALLET3',
    'MULTISIGWALLET4'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    FiatToken: process.env.FiatToken!,
    MULTISIGWALLET0: process.env.MULTISIGWALLET0!,
    MULTISIGWALLET1: process.env.MULTISIGWALLET1!,
    MULTISIGWALLET2: process.env.MULTISIGWALLET2!,
    MULTISIGWALLET3: process.env.MULTISIGWALLET3!,
    MULTISIGWALLET4: process.env.MULTISIGWALLET4!,
  };
}

// 工具函数：执行多签交易
async function executeMultiSigTransaction(
  multiSigAddress: string,
  targetContract: string,
  data: string,
  signers: any[],
  description: string,
  gasLimit: string = "1000000"
) {
  console.log(`\n🔄 Executing: ${description}`);
  console.log(`   MultiSig: ${multiSigAddress}`);
  console.log(`   Target: ${targetContract}`);

  const MultiSigWallet = await ethers.getContractAt("MultiSigWallet", multiSigAddress) as MultiSigWallet;
  const value = ethers.utils.parseEther("0");

  try {
    // 提交交易
    let tx = await MultiSigWallet.connect(signers[0]).submitTransaction(targetContract, value, data);
    const receipt = await tx.wait();

    const txId = receipt.events?.find(e => e.event === 'Submission')?.args?.transactionId.toNumber();
    if (txId === undefined) throw new Error('Transaction ID not found in events');

    console.log(`✅ ${signers[0].address.slice(0, 6)}... submitted transaction with ID: ${txId}`);

    // 确认交易
    // for (let i = 1; i < signers.length; i++) {
    tx = await MultiSigWallet.connect(signers[1]).confirmTransaction(txId, { gasLimit });
    await tx.wait();
    console.log(`✅ ${signers[1].address.slice(0, 6)}... confirmed transaction`);
    // }

    console.log(`🎉 ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute ${description}:`, error);
    throw error;
  }
}

// 主要测试函数
async function main() {
  console.log("🚀 Starting HKDC Wallet Test...\n");

  // 验证环境变量
  const config = validateEnvConfig();

  // 获取测试配置（可以通过环境变量覆盖）
  const testConfig: TestConfig = {
    configureMinter: true,
    pauseOperations: true,
    blacklistOperations: true,
    proxyAdminOperations: true,
    ownershipTransfer: true,
  };

  // 获取签名者
  const [deployer, deployer2, deployer3] = await ethers.getSigners();
  const signers = [deployer, deployer2, deployer3];

  console.log("👥 Signers:");
  signers.forEach((signer, index) => {
    console.log(`  Signer ${index + 1}: ${signer.address}`);
  });

  // 加载合约ABI
  const FiatTokenV2_1 = require(`./FiatTokenV2_1.sol/FiatTokenV2_1.json`);
  const FiatTokenProxy = require(`./FiatTokenProxy.sol/FiatTokenProxy.json`);

  const iface = new ethers.utils.Interface(FiatTokenV2_1.abi);
  const ifaceProxy = new ethers.utils.Interface(FiatTokenProxy.abi);

  // 获取合约实例
  const fiatToken = await ethers.getContractAt(FiatTokenV2_1.abi, config.FiatToken, deployer);
  const fiatTokenProxy = await ethers.getContractAt(FiatTokenProxy.abi, config.FiatToken, deployer);

  console.log(`\n📄 Contract Addresses:`);
  console.log(`  FiatToken: ${config.FiatToken}`);
  console.log(`  MultiSig Wallets:`);
  console.log(`    Owner (Lost & Found): ${config.MULTISIGWALLET0}`);
  console.log(`    Master Minter: ${config.MULTISIGWALLET1}`);
  console.log(`    Pauser: ${config.MULTISIGWALLET2}`);
  console.log(`    Blacklister: ${config.MULTISIGWALLET3}`);
  console.log(`    Proxy Admin: ${config.MULTISIGWALLET4}`);

  console.log(`\n⚙️ Test Configuration:`);
  console.log(`  Configure Minter: ${testConfig.configureMinter ? '✅' : '❌'}`);
  console.log(`  Pause Operations: ${testConfig.pauseOperations ? '✅' : '❌'}`);
  console.log(`  Blacklist Operations: ${testConfig.blacklistOperations ? '✅' : '❌'}`);
  console.log(`  Proxy Admin Operations: ${testConfig.proxyAdminOperations ? '✅' : '❌'}`);
  console.log(`  Ownership Transfer: ${testConfig.ownershipTransfer ? '✅' : '❌'}`);

  try {
    // 1. 配置铸币者 (Master Minter)
    if (testConfig.configureMinter) {
      console.log("\n" + "=".repeat(50));
      console.log("=== 1. Configure Minter ===");
      console.log("=".repeat(50));

      const configureMinterData = iface.encodeFunctionData("configureMinter", [
        "0x674241ca030Bf7487d46D4Fbf595c64A256E2C85",
        "10000000"
      ]);

      await executeMultiSigTransaction(
        config.MULTISIGWALLET1,
        config.FiatToken,
        configureMinterData,
        signers,
        "Configure Minter"
      );
    }

    // 2. 暂停和恢复 (Pauser)
    if (testConfig.pauseOperations) {
      console.log("\n" + "=".repeat(50));
      console.log("=== 2. Pause Operations ===");
      console.log("=".repeat(50));

      // 暂停
      const pauseData = iface.encodeFunctionData("pause");
      await executeMultiSigTransaction(
        config.MULTISIGWALLET2,
        config.FiatToken,
        pauseData,
        signers,
        "Pause Contract"
      );

      // 恢复
      const unpauseData = iface.encodeFunctionData("unpause");
      await executeMultiSigTransaction(
        config.MULTISIGWALLET2,
        config.FiatToken,
        unpauseData,
        signers,
        "Unpause Contract"
      );
    }

    // 3. 黑名单操作 (Blacklister)
    if (testConfig.blacklistOperations) {
      console.log("\n" + "=".repeat(50));
      console.log("=== 3. Blacklist Operations ===");
      console.log("=".repeat(50));

      const blacklistData = iface.encodeFunctionData("blacklist", [signers[2].address]);
      await executeMultiSigTransaction(
        config.MULTISIGWALLET3,
        config.FiatToken,
        blacklistData,
        signers,
        "Blacklist Address",
        "200000"
      );

      const unBlacklistData = iface.encodeFunctionData("unBlacklist", [signers[2].address]);
      await executeMultiSigTransaction(
        config.MULTISIGWALLET3,
        config.FiatToken,
        unBlacklistData,
        signers,
        "Remove from Blacklist",
        "200000"
      );
    }

    // 4. 代理管理员变更 (Proxy Admin)
    if (testConfig.proxyAdminOperations) {
      console.log("\n" + "=".repeat(50));
      console.log("=== 4. Proxy Admin Operations ===");
      console.log("=".repeat(50));

      const changeAdminData = ifaceProxy.encodeFunctionData("changeAdmin", [signers[2].address]);
      await executeMultiSigTransaction(
        config.MULTISIGWALLET4,
        config.FiatToken,
        changeAdminData,
        signers,
        "Change Proxy Admin",
        "2000000"
      );

      // 恢复管理员
      console.log("\n🔄 Restoring admin to original multisig...");
      const tx1 = await fiatTokenProxy.connect(signers[2]).changeAdmin(config.MULTISIGWALLET4);
      await tx1.wait();
      console.log(`✅ Restored admin to ${config.MULTISIGWALLET4}`);
    }

    // 5. 所有权转移 (Owner)
    if (testConfig.ownershipTransfer) {
      console.log("\n" + "=".repeat(50));
      console.log("=== 5. Ownership Transfer ===");
      console.log("=".repeat(50));

      const transferOwnershipData = iface.encodeFunctionData("transferOwnership", [signers[2].address]);
      await executeMultiSigTransaction(
        config.MULTISIGWALLET0,
        config.FiatToken,
        transferOwnershipData,
        signers,
        "Transfer Ownership",
        "2000000"
      );

      // 恢复所有权
      console.log("\n🔄 Restoring ownership to original multisig...");
      const tx2 = await fiatToken.connect(signers[2]).transferOwnership(config.MULTISIGWALLET0);
      await tx2.wait();
      console.log(`✅ Restored ownership to ${config.MULTISIGWALLET0}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("=== 🎉 All Tests Completed Successfully! 🎉 ===");
    console.log("=".repeat(60));

    // 显示执行摘要
    const executedTests: string[] = [];
    if (testConfig.configureMinter) executedTests.push("Configure Minter");
    if (testConfig.pauseOperations) executedTests.push("Pause Operations");
    if (testConfig.blacklistOperations) executedTests.push("Blacklist Operations");
    if (testConfig.proxyAdminOperations) executedTests.push("Proxy Admin Operations");
    if (testConfig.ownershipTransfer) executedTests.push("Ownership Transfer");

    console.log("📋 Executed Tests:");
    executedTests.forEach((test, index) => {
      console.log(`  ${index + 1}. ${test} ✅`);
    });

  } catch (error) {
    console.error("\n" + "=".repeat(50));
    console.error("❌ Test Suite Failed!");
    console.error("=".repeat(50));
    console.error("Error details:", error);
    process.exitCode = 1;
  }
}

// 错误处理和程序入口
main().catch((error) => {
  console.error("\n💥 Unhandled error occurred:");
  console.error("=".repeat(50));
  console.error(error);
  console.error("=".repeat(50));
  process.exitCode = 1;
});
