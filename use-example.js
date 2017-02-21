'use strict';

let Vote = require('vote-api')
let shajs = require('sha.js')

let vote = new Vote({
  providerURL: "http://localhost:8545", //Synced RPC-enabled node URL
  wallet: {
    "public": "0x0E1A.........Dc" //Address use to sign the transaction. Should be the same as in the signerURL or signer function
  },
  signerURL: 'https://URL_TO_THE_ONLINE_SIGNER',
  signer: rawTx => { //Signer function to sign transaction locally
    rawTx.from = "0x0E1A.........Dc"
    rawTx.gas = 3000000
    return Promise.resolve(ethSigner.sign(rawTx, '0xd7bd......cc27c')) //Private key
  }
})

//create new poll
console.log("create new poll");
vote.create("Who is the best?")
.then(_ => {
  console.log("contract created", vote.instance.address)
})

//Add proposal
.then(_ => {
  console.log("will add proposal")
})
.then(_ => {
  return vote.addProposal("Nicolas")
})
.then(_ => {
  return vote.addProposal("Thomas")
})
.then(_ => {
  return vote.addProposal("Anthony")
})
.then(_ => {
  return vote.addProposal("Manu")
})

//Vote
.then(_ => {
  let voterName = "nicolas"
  let voterHash = "0x" + shajs('sha256').update(voterName, 'utf8').digest('hex')
  return vote.vote(voterHash, proposal)
})

//get number of vote
.then(_ => {
  return vote.numberOfVote
})
.then(numberOfVote => {
  console.log(numberOfVote + " total votes");
})

.catch(error => {
  console.log(error)
})
