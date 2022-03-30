const main = async () => {
    // This compiles our contract.
    const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    // // call the function
    // let txn = await nftContract.makeAnEpicNFT();
    // // wait for it to be mined
    // await txn.wait()
    // console.log("Minted NFT #1")

    // // mint another
    // txn = await nftContract.makeAnEpicNFT()
    // // wait for it to be mined
    // await txn.wait()
    // console.log("Minted NFT #2")
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();