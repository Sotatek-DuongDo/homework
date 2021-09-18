import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";

import { Contract } from "@ethersproject/contracts";

import { injected, walletconnect } from "./utils/connector";
import WalletConnect from './WalletConnect/WalletConnect';

import './App.css';

function App() {

  // set up block listener 
  const [blockNumber, setBlockNumber] = useState();
  const [ethBalance, setEthBalance] = useState();
  const [deposit, setdeposit] = useState();
  const [withdraw, setwithdraw] = useState();
  const convert = require('ether-converter');

  // smart contract
  const SmartContractABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }]
  const smartContractAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab';

  const { active, chainId, library, account, activate } = useWeb3React();

  useEffect(() => {
    if (library) {
      let stale = false;

      debugger;
      library
        .getBlockNumber()
        .then(blockNumber => {
          if (!stale) {
            setBlockNumber(blockNumber);
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null);
          }
        });

      const updateBlockNumber = blockNumber => {
        setBlockNumber(blockNumber);
      };
      library.on("block", updateBlockNumber);

      return () => {
        library.removeListener("block", updateBlockNumber);
        stale = true;
        setBlockNumber(undefined);
      };
    }
  }, [library, chainId]);

  useEffect(() => {
    if (library && account) {
      let stale = false;

      library
        .getBalance(account)
        .then(balance => {
          if (!stale) {
            setEthBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null);
          }
        });

      return () => {
        stale = true;
        setEthBalance(undefined);
      };
    }
  }, [library, account, chainId]);


  const handleConnect = (wallet) => {
    switch (wallet) {
      case 'metamask':
        activate(injected)
        break;
      case 'walletconnect':
        activate(walletconnect)
        break;
      default:
        break;
    }
  }

  const handleChange = (e) => {
    let { value, name } = e.target;
    value = e.target.value.replace(/\D/g, "");

    switch (name) {
      case 'deposit':
        setdeposit(value);
        break;
      case 'withdraw':
        setwithdraw(value);
        break;
      default:
        break;
    }
  };

  const handleDeposit = async () => {
    if (!deposit || (deposit && isNaN(deposit)) || (deposit && deposit === "")) {
      return;
    }

    try {
      debugger;
      const contract = new Contract(smartContractAddress, SmartContractABI, library.getSigner());
      let amount = {
        value: convert(deposit, 'eth', 'wei'),
        gasLimit: 2000000000, // 2 GWei
      }
      await contract.deposit(amount);
    } catch (error) {
      console.log(error);
    }

  }

  const handleWithdraw = async () => {
    if (!withdraw || (withdraw && isNaN(withdraw)) || (withdraw && withdraw === "")) {
      return;
    }

    try {
      const contract = new Contract(smartContractAddress, SmartContractABI, library.getSigner());
      let amount = convert(deposit, 'eth', 'wei');
      await contract.withdraw(amount);
    } catch (error) {
      console.log(error);
    }
  }

  const renderAccountInfo = () => {
    return (
      <div className="wallet-info">

        <h3
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "1fr min-content 1fr",
            maxWidth: "20rem",
            lineHeight: "2rem",
            margin: "auto"
          }}
        >
          <span>Chain Id</span>
          <span role="img" aria-label="chain">
            ⛓
          </span>
          <span>{chainId === undefined ? "..." : chainId}</span>

          <span>Block Number</span>
          <span role="img" aria-label="numbers">
            🔢
          </span>
          <span>
            {blockNumber === undefined
              ? "..."
              : blockNumber === null
                ? "Error"
                : blockNumber.toLocaleString()}
          </span>

          <span>Account</span>
          <span role="img" aria-label="robot">
            🤖
          </span>
          <span>
            {account === undefined
              ? "..."
              : account === null
                ? "None"
                : `${account.substring(0, 6)}...${account.substring(
                  account.length - 4
                )}`}
          </span>

          <span>Balance</span>
          <span role="img" aria-label="gold">
            💰
          </span>
          <span>
            {ethBalance === undefined
              ? "..."
              : ethBalance === null
                ? "Error"
                : `Ξ${parseFloat(formatEther(ethBalance)).toPrecision(4)} ETH`}
          </span>
        </h3>

        <div className="balance-item">
          <input className="amount" value={deposit} name="deposit" onChange={handleChange} placeholder="Input amount deposit value"></input>
          <button className="btn" onClick={handleDeposit}>Deposit ETH</button>
        </div>

        <div className="balance-item">
          <input className="amount" value={withdraw} name="withdraw" onChange={handleChange} placeholder="Input amount withdraw value"></input>
          <button className="btn" onClick={handleWithdraw}>Widthdraw ETH</button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">Using web3js sample </header>
      <div className="wrapper-content">
        {
          active
            ? renderAccountInfo()
            : <WalletConnect handleConnected={handleConnect}></WalletConnect>
        }
      </div>

    </div>
  );
}

export default App;
