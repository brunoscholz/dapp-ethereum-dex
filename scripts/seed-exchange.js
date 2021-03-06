const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_REVERT = 'VM Exception while processing transaction: revert'
const ether = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

const tokens = (n) => ether(n)

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async function(cb) {
  try {
    // fetch accounts from wallet - these are unlocked
    const accounts = await web3.eth.getAccounts();

    // fetch the deployed token
    const token = await Token.deployed();
    console.log('Token fetched: ', token.address)

    // fetch the deployed exchange
    const exchange = await Exchange.deployed();
    console.log('Eschange fetched: ', exchange.address)

    // give tokens to account[1]
    const user1 = accounts[0] // sender
    const user2 = accounts[1] // receiver
    let amount = web3.utils.toWei('100000', 'ether') // 10,000 tokens

    await token.transfer(user2, amount, { from: user1 })
    console.log(`Transfered ${amount} tokens from ${user1} to ${user2}`)

    // set up exchange
    // user 1 deposits ether
    amount = 0.5
    await exchange.depositEther({ from: user1, value: ether(amount) })
    console.log(`Deposited ${amount} Ether from ${user1}`)

    // user 2 approves tokens
    amount = 10000
    await token.approve(exchange.address, tokens(amount), { from: user2 })
    console.log(`Approved ${amount} tokens from ${user2}`)

    // user 2 deposits tokens
    await exchange.depositToken(token.address, tokens(amount), { from: user2 })
    console.log(`Deposited ${amount} Tokens from ${user2}`)

    /////////////////////////////////////////////////////////
    // Seed a Cancelled Order


    // user 1 makes an order to get tokens
    let result
    let orderId
    result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
    console.log(`Made order from ${user1}`)

    // user 1 cancels order
    orderId = result.logs[0].args.id
    await exchange.cancelOrder(orderId, { from: user1 })
    console.log(`Cancelled order from ${user1}`)

    ///////////////////////////////////////////////////////////////////
    // Seed Filled Orders
    //

    // User 1 makes an order
    result = await exchange.makeOrder(token.address, tokens(100), ETHER_ADDRESS, ether(0.1), { from: user1 })
    console.log(`Made order from ${user1}`)
    // User 2 fills order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log(`Filled order from ${user1}`)
    // wait 1 second
    await wait(1)

    // User 1 makes an order
    result = await exchange.makeOrder(token.address, tokens(50), ETHER_ADDRESS, ether(0.01), { from: user1 })
    console.log(`Made order from ${user1}`)
    // User 2 fills order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log(`Filled order from ${user1}`)
    // wait 1 second
    await wait(1)

    // User 1 makes an order
    result = await exchange.makeOrder(token.address, tokens(200), ETHER_ADDRESS, ether(0.15), { from: user1 })
    console.log(`Made order from ${user1}`)
    // User 2 fills order
    orderId = result.logs[0].args.id
    await exchange.fillOrder(orderId, { from: user2 })
    console.log(`Filled order from ${user1}`)
    // wait 1 second
    await wait(1)

    ///////////////////////////////////////////////////////////////////
    // Seed Open Orders
    //

    // user 1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(token.address, tokens(10*i), ETHER_ADDRESS, ether(0.01), { from: user1 })
      console.log(`Made order from ${user1}`)
      // wait 1 second
      await wait(1)
    }

    // user 2 makes 10 orders
    for (let i = 1; i <= 10; i++) {
      result = await exchange.makeOrder(ETHER_ADDRESS, ether(0.01), token.address, tokens(10 * i), { from: user2 })
      console.log(`Made order from ${user2}`)
      // wait 1 second
      await wait(1)
    }

  } catch (error) {
    console.log(error)
  }
  cb()
}
