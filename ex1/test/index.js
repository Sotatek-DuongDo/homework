const Web3 = require('web3');
const ethereumMulticall = require('ethereum-multicall');

const main = async () => {
    const web3 = new Web3('wss://rinkeby.infura.io/ws/v3/795e5c9e33b34b438b8e2e10f90a4862');
    const smartContractAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
    const SmartContractABI = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "dst", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "src", "type": "address" }, { "indexed": false, "name": "wad", "type": "uint256" }], "name": "Withdrawal", "type": "event" }]
    const contract = new web3.eth.Contract(SmartContractABI, smartContractAddress);
    const multicall = new ethereumMulticall.Multicall({ web3Instance: web3, tryAggregate: true });
    const wallets = [
        '0x0bEe24D48E22A7a161D0B6B576775315890CE7C4',
        '0x7edB83209611f18386f67CDeE63BAEe695fA0aab',
        "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c",
        "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
        "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
        "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
        "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678",
        "0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC",
    ]

    const init = async () => {
        await getBalance('0x0bEe24D48E22A7a161D0B6B576775315890CE7C4');
        await getLastestBlock(100);
        await multiCallSmartContract(wallets);
    };
    init();

    // Create an Event Listener tranfer
    contract.events.Transfer()
        .on('data', (event) => {
            console.log(event);
        })
        .on('error', console.error);

    // get balance of address
    async function getBalance(address) {
        const balance = await contract.methods.balanceOf(address).call();
        console.log(`balanceOf ${address}: ${web3.utils.fromWei(balance)} WETH`);
    }

    // get 100 block lastest
    async function getLastestBlock(number) {
        const blockNumberLatest = await web3.eth.getBlockNumber();
        const options = {
            fromBlock: blockNumberLatest - number,
            toBlock: 'latest'
        };
        contract.getPastEvents('Transfer', options)
            .then(result => console.log('queryTransfer: ', result))
    }

    // using multical function
    async function multiCallSmartContract(wallets) {

        const contractCallContext = wallets.map((address, index) => {
            return {
                reference: address,
                contractAddress: smartContractAddress,
                abi: SmartContractABI,
                calls: [{ reference: 'balance' + index, methodName: 'balanceOf', methodParameters: [address] }]
            }
        })
        const balanceList = await multicall.call(contractCallContext);
        for (const [wallet, resultObj] of Object.entries(balanceList.results)) {
            const balanceHex = resultObj.callsReturnContext[0].returnValues[0].hex;
            console.log(`wallet: ${wallet}, Balance : ${web3.utils.fromWei(balanceHex)} WETH`);
        }
    }
}

main();