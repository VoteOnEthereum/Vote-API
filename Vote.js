'use strict';

let axios = require('axios')
let Web3 = require('web3');
const SignerProvider = require('ethjs-provider-signer');
var TruffleContract = require("truffle-contract");

class Vote {

  constructor(param) {
    if (param.providerURL === undefined) {
        throw "No provider URL"
    }

    if (param.signer === undefined &&  param.signerURL === undefined) {
        throw "Need either a signer or a signerURL"
    }

    this.providerURL = param.providerURL
    this.wallet = param.wallet
    this.signer = param.signer
    this.signerURL = param.signerURL
    this.contract = TruffleContract(require("./contract.json"))

    this._setProvider()
  }

  _setProvider() {
    let provider
    if(typeof web3 !== 'undefined') {
      console.log("provider found");
      web3 = new Web3(web3.currentProvider);
      provider = web3.currentProvider;

      if (web3.eth.accounts.length > 0) {
          console.log("set default account");
          web3.eth.defaultAccount = web3.eth.accounts[0];
      }

      this.contract.defaults({
        from: web3.eth.defaultAccount
      })

      console.log("web3.eth.defaultAccount", web3.eth.defaultAccount);
      console.log("web3.eth.accounts", web3.eth.accounts);
    }
    else if (this.wallet !== undefined) {
      console.log("signer provided. use node from providerURL and local signer");
      provider = new SignerProvider(this.providerURL, {
        signTransaction: (rawTx, cb) => {

          this.sign(rawTx)
          .then(signedTx => {
            cb(null, signedTx)
          })
          .catch(error => {
            console.log("error", error)
          })

        }
      });

      this.contract.defaults({
        from: this.wallet.public, //@todo: will be better if no public address on the client. when done, merge with next else
      })
    }
    else {
      console.log("no provider found. use node from providerURL and no signer");
      let web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL));
      provider = web3.currentProvider;
    }

    this.contract.setProvider(provider);
  }

  sign(rawTx) {
    console.log('signing...')
    if(this.signer !== undefined) {
      return this.signer(rawTx)
    }
    else if(this.signerURL !== undefined) {
      return this._signer(rawTx)
    }
    else
      Promise.reject("no signer provided")
  }

  _signer(rawTx) {
    return axios.post(this.signerURL, rawTx)
    .then(response => {
      return response.data.signedTx
    })
    .catch(error => {
      console.log(error)
    })
  }

  /*
   * Load a already deployed contract
   * - Return: Promise<Void>
   */
  load(address) {
    return this.contract.at(address)
    .then(_instance => {
      this.instance = _instance
    })
  }

  /*
   * Create a new vote
   * - Parameters
   *   question: String. Ex: "Who is the best?"
   * - Return: Promise<Void>
   */
  create(question) {
    return this.contract.new(question)
    .then(_instance => {
      this.instance = _instance
      // console.log("contract address", this.instance.address);
    })
  }

  /*
   * Add a proposal
   * - Parameters
   *   proposal: String. Ex: "Thomas"
   * - Return: Promise<Void>
   */
  addProposal(proposal) {
    return this.instance.addProposal(proposal)
  }

  /*
   * Vote for a propsal
   * - Parameters
   *   voterHash: byte32. Hash that represent a voter
   *   proposal: Integer. Index of the proposal. Ex: 0
   * - Return: Promise<Void>
   */
  vote(voterHash, proposal) {
    return this.instance.vote(voterHash, proposal)
  }

  /*****************************************************************************
   * Getter
   ****************************************************************************/

  /*
   * Get the question of the vote
   * - Return: Promise<String>
   */
  get question() {
    return this.instance.question()
  }

  get numberOfVote() {
    return this.instance.numberOfVote()
    .then(_data => {
      return _data.valueOf()
    })
  }

  get proposalsCount() {
    return this.instance.proposalsCount()
    .then(_data => {
      return _data.valueOf()
    })
  }

  get allProposals() {
    return this.proposalsCount
    .then(proposalsCount => {
      let promises = []
      for(let i=0; i<proposalsCount; i++) {
        let promiseProposal = this.proposals(i)
        let promiseVote = this.numberOfVoteForProposal(i)
        let promise = Promise.all([promiseProposal, promiseVote])
        .then(data => {
          let proposalData = data[0]
          proposalData["numberOfVote"] = data[1]
          return proposalData
        })
        promises.push(promise)
      }
      return Promise.all(promises)
    })
  }

  proposals(index) {
    return this.instance.proposals(index)
    .then(_data => {
      return {
        "name": _data[0].valueOf()
      }
    })
  }

  numberOfVoteForProposal(index) {
    return this.instance.numberOfVoteForProposal(index)
    .then(_data => {
      return parseInt(_data.valueOf())
    })
  }

  get numberOfVotePerProposal() {
    return this.instance.numberOfVotePerProposal()
    .then(_data => {
      return _data.map(data => {
        return parseInt(data.valueOf())
      })
    })
  }

  get votersHashCount() {
    return this.instance.votersHashCount()
    .then(_data => {
      return _data.valueOf()
    })
  }

  votersHash(index) {
    return this.instance.votersHash(index)
    .then(_data => {
      return _data.valueOf()
    })
  }

  voters(voterHash) {
    return this.instance.voters(voterHash)
    .then(_data => {
      return {
        "voterHash": voterHash,
        "voted": _data[0].valueOf(),
        "proposalVoted": parseInt(_data[1].valueOf()),
        "votersHashIndex": parseInt(_data[2].valueOf())
      }
    })
  }

  get allVoters() {
    return this.votersHashCount
    .then(votersHashCount => {
      let promises = []
      for(let i=0; i<votersHashCount; i++) {
        let promise = this.votersHash(i)
        promises.push(promise)
      }
      return Promise.all(promises)
    })
    .then(votersHash => {
      let promises = votersHash.map(voterHash => {
        return this.voters(voterHash)
      })
      return Promise.all(promises)
    })
  }

}

module.exports = Vote
