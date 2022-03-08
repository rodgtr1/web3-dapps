import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

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

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {

  let accounts = [];

  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
  })

  // CREATE
  const $create = document.getElementById("create")
  const $createResult = document.getElementById("create-result")

  $create.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    crud.methods
      .create(name)
      .send({from: accounts[0]})
      .then(() => {
        $createResult.innerHTML = `New user ${name} was successfully created!`
      })
      .catch(() => {
        $createResult.innerHTML = 'Oops there was an error while trying to create the new user.'
      })
  })

  // READ
  const $read = document.getElementById('read')
  const $readResult = document.getElementById('read-result')

  $read.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods
      .read(id)
      .call()
      .then(result => {
        $readResult.innerHTML = `Id: ${result[0]}, Name: ${result[1]}`
      })
      .catch(() => {
        $readResult.innerHTML = 'Oops there was an error while trying to read the user id.'
      })
  })

  // UPDATE
  const $edit = document.getElementById('edit')
  const $editResult = document.getElementById('edit-result')

  $edit.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    crud.methods
      .update(id, name)
      .send({from: accounts[0]})
      .then(() => {
        $editResult.innerHTML = `Changed name of user ${id} to ${name}`
      })
      .catch(() => {
        $editResult.innerHTML = `Oops there was a problem updating the user ${id}`
      })
  })

  // DELETE
  const $delete = document.getElementById('delete')
  const $deleteResult = document.getElementById('delete-result')

  $delete.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods
      .destroy(id)
      .send({from: accounts[0]})
      .then(() => {
        $deleteResult.innerHTML = `Deleted user ${id} successfully`
      })
      .catch(() => {
        $deleteResult.innerHTML = `Oops there was a problem deleting user ${id}`
      })
  })

};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
