# MultiSig Wallet
## Set up environment
```bash
yarn
touch .env
```
Check out ".env.example" file. Write your private key into ".env"
## Submit & Confirm a new Transaction (which should be done ONLY by one of the MultiSig owners. Please contact this repo owner about the transaction details first if needed)
Change MultiSigWallet value line 25 under scripts/1_submitTx.ts to the MultiSig Wallet address.
```bash
npx hardhat --network espace scripts/1_submitTx.ts
```
Record the transaction hash from the terminal output after the script runs
## Confirm the transaction (which should be done ONLY by other MultiSig owners.)
Go to ConfluxScan and check the log event "event Confirmation(address indexed sender, uint indexed transactionId)" according to the recorded transaction hash.
Then Change MultiSigWallet value line 27 under scripts/2_confirmTx.ts to the MultiSig Wallet address. Then change value "-1" in the line 30 under scripts/2_confirmTx.ts to the transaction id from the log event. Then run:
```bash
npx hardhat --network espace scripts/2_confirmTx.ts
```
## Once the number of confirmations reached the required threshold, the transaction will be executed automatically. Done.