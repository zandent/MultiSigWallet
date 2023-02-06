# NUT MultiSig Wallet
## Set up environment
```bash
yarn
touch .env
```
Then following ".env.example" file, write your private key into ".env"
## Submit & Confirm a new Transaction (which should be done ONLY by one of the MultiSig owners. Please contact this repo owner about the transaction details first if needed)
Change MultiSigWallet value line 20 under scripts/1_submitTx.ts to ond of the MultiSig Wallet addresses. The addresses are: 

Marketing:	0xea41549df7196805cd9bb30e790e86389f4c13af

Treasury:	0xbeb910ae81e3dd1622633660d47443ae37894f75

DAO:	0xdfbf3c11024023262a3f41cf33175357a136ddb0

Then run:
```bash
npx hardhat --network espace scripts/1_submitTx.ts
```
Record the transaction hash from the terminal output after the script runs
## Confirm the transaction (which should be done ONLY by other MultiSig owners.)
Go to ConfluxScan and check the log event "event Confirmation(address indexed sender, uint indexed transactionId)" according to the recorded transaction hash.
Then Change MultiSigWallet value line 24 under scripts/2_confirmTx.ts to the MultiSig Wallet address. Then change value "-1" in the line 30 under scripts/2_confirmTx.ts to the transaction id from the log event. Then run:
```bash
npx hardhat --network espace scripts/2_confirmTx.ts
```
## Once the number of confirmations reached the required threshold, the transaction will be executed automatically. Done.