import Web3 from 'web3';
import EtherWallet from '../build/contracts/EtherWallet.json';

let web3;
let etherWallet;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = async () => {
  const networkId = await web3.eth.net.getId();
  return new web3.eth.Contract(
    EtherWallet.abi, 
    EtherWallet
      .networks[networkId]
      .address
  );
};

const initApp = () => {

  let accounts = [];

  web3.eth.getAccounts()
    .then(_accounts => {
      accounts = _accounts;
    })

  // DEPOSIT
  const deposit = document.getElementById('deposit')
  const depositResult = document.getElementById('deposit-result')

  deposit.addEventListener('submit', e => {
    e.preventDefault();
    const amount = e.target.elements[0].value
    etherWallet.methods.deposit()
      .send({
        from: accounts[0],
        value: amount
      })
      .then(result => {
        depositResult.innerHTML = `You have successfully deposited ${amount} wei`
        refreshBalance()
      })
      .catch(e => {
        depositResult.innerHTML = `There was a error making your deposit.`
      })
  })

  // SEND
  const send = document.getElementById('send')
  const sendResult = document.getElementById('send-result')

  send.addEventListener('submit', e => {
    e.preventDefault();
    const to = e.target.elements[0].value
    const amount = e.target.elements[1].value
    etherWallet.methods.send(to, amount)
      .send({
        from: accounts[0]
      })
      .then(result => {
        sendResult.innerHTML = `You have successfully sent ${amount} wei to ${to}`
        refreshBalance()
      })
      .catch(e => {
        sendResult.innerHTML = `There was a error in sending wei.`
      })
  })

  // UPDATE BALANCE
  const refreshBalance = () => {
    const balance = document.getElementById('balance');
    etherWallet.methods.balanceOf()
    .call()
      .then(result => {
        balance.innerHTML = result
      })
      .catch(e => {
        balance.innerHTML = `There was an error displaying your balance.`
      })
  }
  refreshBalance()

}

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      return initContract();
    })
    .then(_etherWallet => {
      etherWallet = _etherWallet;
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
