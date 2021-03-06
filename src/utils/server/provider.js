require('dotenv').config();

const Web3 = require('web3');
const {
  infuraKey,
} = require('../config/base.config');

const getProvider = (networkType) => {
  const providerConfig = `https://${networkType}.infura.io/v3/${infuraKey}`;
  const provider = new Web3.providers.HttpProvider(providerConfig);

  return provider;
};
const web3Provider = (networkType) => {
  return new Web3(getProvider(networkType));
};

module.exports = {
  web3Provider,
};
