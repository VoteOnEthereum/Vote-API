const assert = require('assert')
const ethSigner = require('ethjs-signer')

let walletLocal = {
  "public": "0x866dbd65b4eae31526303639b36d53fdbcd57a26"
}

let Vote = require('./Vote')
let vote = new Vote({
  providerURL: "http://localhost:8545",
  wallet: walletLocal,
  signer: rawTx => {
    rawTx.from = walletLocal.public
    rawTx.gas = 3000000
    return Promise.resolve(ethSigner.sign(rawTx, '0x4056667ce5b7efc1b30b52f0cc21b1fb41b97658f9e68e2487e3acabe75837c9'))
  }
})

let question = "Who is the best?"
let proposals = ["Nicolas", "Thomas"]
let numberOfVote = 0
let numberOfVotePerProposal = [0, 0]
let voters = ['0xa18aaa6c6b929b866051b69a785a6cdce5bdd564d41be247c7d5ef7c2e2e2271', '0xb18aaa6c6b929b866051b69a785a6cdce5bdd564d41be247c7d5ef7c2e2e2271']

describe('Contract', function() {
  it('should create contract', function() {
    return vote.create(question, proposals)
    .then(_ => {
      console.log("address", vote.instance.address)
      assert(vote.instance.address, "address is null")
    })
  })

  it('should add proposal', function() {
    let promises = proposals.map(proposal => {
      return vote.addProposal(proposal)
    })
    return Promise.all(promises)
    .then(_ => {
      return vote.proposalsCount
    })
    .then(proposalsCount => {
      assert.equal(proposalsCount, proposals.length, "proposalsCount is not correct")
    })
  })

  it('should load contract', function() {
    return vote.load(vote.instance.address)
    // return vote.load("0x6cb52c04bb40cac69db234cd3fd0586ef80008ca")
  })

  it('A should vote for first proposal', function() {
    numberOfVote++
    numberOfVotePerProposal[0]++
    return vote.vote(voters[0], 0)
  })

  it('B should vote for second proposal', function() {
    numberOfVote++
    numberOfVotePerProposal[1]++
    return vote.vote(voters[1], 1)
  })

  it('should get question', function() {
    return vote.question
    .then(_question => {
      assert.equal(_question, question, "question are not the same")
    })
  })

  it('should get numberOfVote', function() {
    return vote.numberOfVote
    .then(_numberOfVote => {
      assert.equal(_numberOfVote, numberOfVote, "number of vote is not good")
    })
  })

  it('should get proposalsCount', function() {
    return vote.proposalsCount
    .then(proposalsCount => {
      assert.equal(proposalsCount, proposals.length, "proposalsCount is not good")
    })
  })

  it('should get first proposals', function() {
    return vote.proposals(0)
    .then(proposal => {
      assert.equal(proposal.name, proposals[0], "proposal name is not good")
    })
  })

  it('should get all proposals #1', function() {
    return vote.allProposals
    .then(_proposals => {
      assert.equal(_proposals.length, proposals.length, "proposal count is not good")
    })
  })

  it('should get all proposals #2', function() {
    return vote.proposalsCount
    .then(proposalsCount => {
      let promises = []
      for(let i=0; i<proposalsCount; i++) {
        let promise = vote.proposals(i)
        .then(proposal => {
          assert.equal(proposal.name, proposals[i], "proposal name is not good")
        })
        promises.push(promise)
      }
      return Promise.all(promises)
    })
  })

  it('should get numberOfVoteForProposal first', function() {
    return vote.numberOfVoteForProposal(0)
    .then(_numberOfVoteForProposal => {
      assert.equal(_numberOfVoteForProposal, numberOfVotePerProposal[0], "numberOfVoteForProposal is not good")
    })
  })

  it('should get all numberOfVoteForProposal', function() {
    return vote.proposalsCount
    .then(proposalsCount => {
      let promises = []
      for(let i=0; i<proposalsCount; i++) {
        let promise = vote.numberOfVoteForProposal(i)
        .then(_numberOfVoteForProposal => {
          assert.equal(_numberOfVoteForProposal, numberOfVotePerProposal[i], "numberOfVoteForProposal is not good")
        })
        promises.push(promise)
      }
      return Promise.all(promises)
    })
  })

  it('should get numberOfVotePerProposal', function() {
    return vote.numberOfVotePerProposal
    .then(_numberOfVotePerProposal => {
      assert.deepEqual(_numberOfVotePerProposal, numberOfVotePerProposal, "numberOfVotePerProposal is not good")
    })
  })

  it('should get votersHashCount', function() {
    return vote.votersHashCount
    .then(_votersHashCount => {
      assert.equal(_votersHashCount, numberOfVote, "votersHashCount is not good")
    })
  })

  it('should get all votersHash', function() {
    return vote.votersHashCount
    .then(votersHashCount => {
      let promises = []
      for(let i=0; i<votersHashCount; i++) {
        let promise = vote.votersHash(i)
        .then(_voterHash => {
          assert.equal(_voterHash, voters[i], "voterHash is not good")
        })
        promises.push(promise)
      }
      return Promise.all(promises)
    })
  })

  it('should get first voters', function() {
    return vote.voters(voters[0])
    .then(voter => {
      assert(voter.voterHash, "voter.voterHash is not good")
      assert.equal(voter.voted, true, "voter.voted is not good")
      assert.equal(voter.proposalVoted, 0, "voter.voted is not good")
      assert.equal(voter.votersHashIndex, 0, "voter.voted is not good")
    })
  })

  it('should get all voters #1', function() {
    let promises = voters.map(_voter => {
      return vote.voters(_voter)
      .then(voter => {
        assert.equal(voter.voted, true, "voter.voted is not good")
      })
    })
    return Promise.all(promises)
  })

  it('should get all voters #2', function() {
    return vote.allVoters
    .then(allVoters => {
      allVoters.forEach(voter => {
        assert.equal(voter.voted, true, "voter.voted is not good")
      })
    })
  })

})
