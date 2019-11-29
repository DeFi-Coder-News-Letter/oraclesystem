require('dotenv').config()

const BN = require('bn.js')

const {
    adminPrivateKey,
    privateKey
} = require('./base.config')

const {
    web3Provider
} = require('../server/provider')

// coinbase account
const web3 = web3Provider('mainnet')
// TODO: rename
const posterAccount = web3.eth.accounts.privateKeyToAccount('0x' + privateKey).address
const adminAccount = web3.eth.accounts.privateKeyToAccount('0x' + adminPrivateKey).address
const maxPendingAnchorSwing = 0.1 // 10%
const newPendingAnchorInterval = 3600 // 60 * 60
const mantissaOne = (new BN(10)).pow(new BN(18))
// query current gas price
const ethgasstationAPI = `https://ethgasstation.info/json/ethgasAPI.json`

module.exports = {
    posterAccount,
    adminAccount,
    ethgasstationAPI,
    mantissaOne,
    maxPendingAnchorSwing,
    newPendingAnchorInterval,
}