const HDWalletProvider = require('truffle-hdwallet-provider')
require('dotenv').config()

module.exports = {

  networks: {
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          process.env.SEED,
          `https://ropsten.infura.io/v3/${process.env.PROJECTID}`
        ),
      network_id: 3
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
