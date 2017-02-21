# Vote-API

This package provide an easy to use API for interacting with the Vote Contract in a blockchain.

## Installation

```console
npm install
```

## Test

You need to have [Testrpc](https://github.com/ethereumjs/testrpc) installed and running. Execute in a separate terminal:

```console
npm install -g ethereumjs-testrpc
testrpc
```

Update `test.js` to match the wallet address and private key returned by Testrpc.

To test, execute:

```console
npm test
```

## Contract.json

The file `contract.json` is the interface of the voting contract. See [Vote-On-Ethereum/Contract](https://github.com/Vote-On-Ethereum/Contract) how to make it.


## Use example

See [use-example.js](https://github.com/Vote-On-Ethereum/Vote-API/blob/master/use-example.js)


## API

## Constructor

Initialize the object.

#### Parameter
Encode as one JSON:

- `providerURL` **[URL]** Synced RPC-enabled node URL
- `wallet` **[JSON]**
	- `public` **[address]** Address use to sign the transaction. Should be the same as in the signerURL or signer function
- `signerURL` **[URL]** The URL of the online signer
- `signer` **[function]** Local signer function to sign transaction locally

Only one of `signerURL` and `signer` is required. `signer` is available for test purpose.


## load(address)

Load a contract already deployed

#### Parameter
- `address` **[address]** The address of the deployed contract

#### Return [Promise]


## create(question)

Create a new vote

#### Parameter
- `question` **[string]** The question for the new vote

#### Return [Promise]


## addProposal(proposal)

Add a proposal to the vote

#### Parameter
- `proposal` **[string]** The proposal to add

#### Return [Promise]


## vote(voterHash, proposal)

Vote for a proposal

#### Parameter
- `voterHash` **[bytes64]** The sha256 encoded hex identification string of the voter *Ex: 0xa18aaa6c6b929b866051b69a785a6cdce5bdd564d41be247c7d5ef7c2e2e2271*
- `proposal` **[integer]** The id of the proposal

#### Return [Promise]
The promise will resolve when the vote is verify and on the blockchain. It may take time.


## question

The vote question

#### Return [Promise(string)]

## numberOfVote

The number of total vote

#### Return [Promise(integer)]

## proposalsCount

The number of proposals

#### Return [Promise(integer)]

## allProposals

Get all proposals data

#### Return [Promise(JSON)]

- **[array]** Proposal array
	- `name` **[string]** The name of the proposal

## proposals(index)

Get a specific proposal data

#### Parameter
- `index` **[integer]** The index of the proposal

#### Return [Promise(JSON)]
- `name` **[string]** The name of the proposal

## numberOfVoteForProposal(index)

Get the number of vote for a specific proposal

#### Parameter
- `index` **[integer]** The index of the proposal

#### Return [Promise(integer)]

## numberOfVotePerProposal

Get the number of vote per proposal

#### Return [Promise(JSON)]

- **[array]** Proposal array
	- **[integer]** The number of vote for this proposal

## votersHashCount

Get the number of votersHash array

#### Return [Promise(integer)]

## votersHash(index)

Get the hash of a voter by its index

#### Parameter
- `index` **[integer]** The index of the voter

#### Return [Promise(bytes64)]

## voters(voterHash)

Get the data of a voter

#### Parameter
- `voterHash ` **[bytes64]** The index of the voter

#### Return [Promise(JSON)]
- `voterHash` **[bytes64]** The hash of the voter
- `voted` **[boolean]** True if the voter has voted
- `proposalVoted` **[integer]** The index of the voted proposal
- `votersHashIndex` **[integer]** The index of voter in the votersHash array

## allVoters

Get the data of all voters

#### Return [Promise(JSON)]
- **[array]** Voter array
	- `voterHash` **[bytes64]** The hash of the voter
	- `voted` **[boolean]** True if the voter has voted
	- `proposalVoted` **[integer]** The index of the voted proposal
	- `votersHashIndex` **[integer]** The index of voter in the votersHash array