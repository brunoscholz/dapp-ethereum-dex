const { Web3 } = require('web3')

(function () {
	'use strict';

  const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
  const EVM_REVERT = 'VM Exception while processing transaction: revert'
  const ether = (n) => {
    return new Web3.utils.BN(
      Web3.utils.toWei(n.toString(), 'ether')
    )
  }

  const tokens = (n) => ether(n)

  var helpers = {
    ether: function (n: number) { return ether(n); },
    tokens: function (n: number) { return ether(n); }
  }

  Object.defineProperties(helpers, {
    ETHER_ADDRESS: { 
      get: function() {
        return ETHER_ADDRESS;
      },
    },
    EVM_REVERT: { 
      get: function() {
        return EVM_REVERT;
      },
    }
  });

  if (isCommonjs) {
		module.exports = helpers;
	} else {
		window.helpers = helpers;
	}

})();
