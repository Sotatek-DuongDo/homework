const hre = require("hardhat");

async function main() {

    // deploy WETH9 smart contract
    const smartcontract = await hre.ethers.getContractFactory("WETH9");
    const SCdeploy = await smartcontract.deploy();
    await SCdeploy.deployed();

    console.log(`SCdeploy`, SCdeploy.address);

    // verify WETH9 smart contract
    try {
        await hre.run("verify:verify", {
            contract: "contracts/WETH9.sol:WETH9",
            address: SCdeploy.address,
            constructorArguments: [],
        });
    } catch (error) {
        console.log(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
