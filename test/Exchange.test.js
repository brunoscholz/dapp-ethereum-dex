const Web3 = require('web3')
const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const ether = (n) => {
  return new Web3.utils.BN(
    Web3.utils.toWei(n.toString(), 'ether')
  )
}

const tokens = (n) => ether(n)

contract('Exchange', ([deployer, feeAccount, user1]) => {
  let token
  let exchange
  let feePercent = 10;

  beforeEach(async () => {
    token = await Token.new()
    exchange = await Exchange.new(feeAccount, feePercent)
    token.transfer(user1, tokens(100), { from: deployer })
  })

  describe('deployment', () => {
    it('tracks the fee account', async () => {
      const result = await exchange.feeAccount()
      result.should.equal(feeAccount)
    })

    it('tracks the fee percent', async () => {
      const result = await exchange.feePercent()
      result.toString().should.equal(feePercent.toString())
    })
  })

  describe('fallback', () => {
    it('reverts when ether is sent', async () => {
      await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT)
    })
  })

  describe('depositing ether', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      result = await exchange.depositEther({ from: user1, value: amount })
    })

    describe('success', () => {

      it('tracks the Ether deposit', async() => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1)
        balance.toString().should.equal(amount.toString())
      })

      it('emits a Deposit event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Deposit')
        const event = log.args
        event.token.should.equal(ETHER_ADDRESS, 'ether address is correct')
        event.user.should.equal(user1, 'user address is correct');
        event.amount.toString().should.equal(amount.toString(), 'amount is correct')
        event.balance.toString().should.equal(amount.toString(), 'balance is correct')
      })
    })

    describe('failure', () => {
      // it('reject ether deposits', async () => {
      //   await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
      // })

      // it('fails when no tokens are approved', async () => {
      //   await exchange.depositToken(token.address, tokens(10), { from: user1 })
      // })
    })
  })

  describe('withdrawing ether', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      await exchange.depositEther({ from: user1, value: amount })
    })

    describe('success', () => {
      beforeEach(async () => {
        // withdraw Ether
        result = await exchange.withdrawEther(amount, { from: user1 })
      })

      it('withdraws ehter funds', async() => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1)
        balance.toString().should.equal('0')
      })

      it('emits a Withdraw event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Withdraw')
        const event = log.args
        event.token.should.equal(ETHER_ADDRESS)
        event.user.should.equal(user1);
        event.amount.toString().should.equal(amount.toString())
        event.balance.toString().should.equal('0')
      })
    })

    describe('failure', () => {

    })
  })

  describe('depositing tokens', () => {
    let result
    let amount

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10)
        await token.approve(exchange.address, amount, { from: user1 })
        result = await exchange.depositToken(token.address, amount, { from: user1 })
      })

      it('tracks the token deposit', async() => {
        let balance
        balance = await token.balanceOf(exchange.address)
        balance.toString().should.equal(amount.toString())
        // check tokens on exchange
        balance = await exchange.tokens(token.address, user1)
        balance.toString().should.equal(amount.toString())
      })

      it('emits a Deposit event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Deposit')
        const event = log.args
        event.token.should.equal(token.address, 'token address is correct')
        event.user.should.equal(user1, 'user address is correct');
        event.amount.toString().should.equal(amount.toString(), 'amount is correct')
        event.balance.toString().should.equal(amount.toString(), 'balance is correct')
      })
    })

    describe('failure', () => {
      it('reject ether deposits', async () => {
        await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
      })

      it('fails when no tokens are approved', async () => {
        await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
      })
    })
  })

  describe('withdrawing tokens', () => {
    let result
    let amount

    describe('success', () => {
      beforeEach(async () => {
        // deposit tokens first
        amount = tokens(10)
        await token.approve(exchange.address, amount, { from: user1 })
        await exchange.depositToken(token.address, amount, { from: user1 })

        result = await exchange.withdrawToken(token.address, amount, { from: user1 })
      })

      it('withdraws token funds', async() => {
        const balance = await exchange.tokens(token.address, user1)
        balance.toString().should.equal('0')
      })

      it('emits a Withdraw event', async () => {
        const log = result.logs[0]
        log.event.should.eq('Withdraw')
        const event = log.args
        event.token.should.equal(token.address, 'token address is correct')
        event.user.should.equal(user1, 'user address is correct');
        event.amount.toString().should.equal(amount.toString(), 'amount is correct')
        event.balance.toString().should.equal('0', 'balance is correct')
      })
    })

    describe('failure', () => {
      it('rejects Ether withdraws', async () => {
        await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
      })

      it('fails for insufficient balances', async () => {
        await exchange.withdrawToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
      })
    })
  })

  describe('checking balances', () => {
    beforeEach(async () => {
      await exchange.depositEther({ from: user1, value: ether(1) })
    })

    it('returns user balance', async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
      result.toString().should.equal(ether(1).toString())
    })
  })
})
