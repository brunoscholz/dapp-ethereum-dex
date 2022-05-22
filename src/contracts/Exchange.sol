// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Exchange {
  using SafeMath for uint;

  // variables
  address public feeAccount; // the account that receives exchange fees
  uint256 public feePercent; // the fee percentage
  address constant ETHER = address(0);
  mapping(address => mapping(address => uint256)) public tokens;

  // Events
  event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);

  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  function depositEther() payable public {
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  function depositToken(address _token, uint256 _amount) public {
    require(_token != ETHER);
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

}

// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees
// TODO:
// [X] Set the fee
// [ ] Deposit Ether
// [ ] Withdraw Ether
// [ ] Deposit tokens
// [ ] Withdraw tokens
// [ ] Check Balances
// [ ] Make Order
// [ ] Cancel Order
// [ ] Fill Order
// [ ] Charge fees
