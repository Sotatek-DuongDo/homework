require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
    defaultNetwork: "mainnet",
    networks: {
        hardhat: {
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/795e5c9e33b34b438b8e2e10f90a4862`,
            accounts: [`0x18c4b3cfe28de9c612ca7fb051bc19e4f4802aba510f4d1fc886a258656c8c52`]
        },
        mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            accounts: ['0x18c4b3cfe28de9c612ca7fb051bc19e4f4802aba510f4d1fc886a258656c8c52']
        },
        testnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            accounts: ['0x18c4b3cfe28de9c612ca7fb051bc19e4f4802aba510f4d1fc886a258656c8c52']
        }
    },
    solidity: {
        version: "0.4.18",
        settings: {
            optimizer: {
                enabled: true
            }
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    etherscan: {
        apiKey: "4HRZX4NISBE6V5P1AXR5FWAHNPZ47CN9SH", // Etherscan API
        // apiKey: "9GVFKXEJGS34531RHBPDPT5AY5652CF3F3" // Bscscan API
    }
};