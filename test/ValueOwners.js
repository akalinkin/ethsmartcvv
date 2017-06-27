var ValueOwners = artifacts.require("./ValueOwners.sol");

contract('ValueOwners', function(accounts) {
  it("should set 10000000000000000 Wei in cost", function() {
    return ValueOwners.deployed().then(function(instance) {
      return instance.cost();
    }).then(function(cost) {
      assert.equal(cost.valueOf(),10000000000000000,'Constract cost isn\'t 10000000000000000 Wei');
    });
  });

  it("should return zero balance for the owner address", function() {
    var owner_address = accounts[0];
    return ValueOwners.deployed().then(function(instance) {
      return instance.getBalance.call(owner_address);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, 'Owner balance isn\'t 0');
    });
  });

  it("should return zero balance for the other address", function() {
    var other_address = accounts[1];
    return ValueOwners.deployed().then(function(instance) {
      return instance.getBalance.call(other_address);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, 'Other balance isn\'t 0');
    });
  });

  it("should return new cost after cost was changed by owner", function() {
    return ValueOwners.deployed().then(function(instance) {
      return instance.setCost.call(15000000000000000);
    }).then(function(newCost) {
      assert.equal(newCost, 15000000000000000, 'New cost doesn\' equals new value 15000000000000000');
    });
  });

  it("should return zero from payedAmount", function() {
    return ValueOwners.deployed().then(function(instance) {
      return instance.payedAmount.call();
    }).then(function(amount) {
      assert.equal(amount, 0,'Amount isn\'t 0')
    });
  });

  it("should return true if payed 10000000000000000 Wei", function() {
    var vo_contract;
    var account_one = accounts[0];

    return ValueOwners.deployed().then(function(instance) {
      vo_contract = instance;
      return instance.buyValue.call({from: account_one, value:10000000000000000});
    }).then(function(success) {
      assert.equal(success, true,'buyValue doesn\'t returns true');
    });
  });

  /*it("should return false when not correct amount of Ether sended", function() {
    var account_one = accounts[0];

    return ValueOwners.deployed().then(function(instance) {
      return instance.buyValue.call({from: account_one, value:10000000000000001});
    }).then(function(success) {
      assert.equal(success,false,'buyValue doesn\'t return false');
    });
  });*/

  // TODO: Find out how to wait while first transaction will be applied to new block and only after that try to call method second time
  /*it("should return false if payed 10000000000000000 Wei double times from one account", function() {
    var vo_contract;
    var account_one = accounts[0];
    //console.log(web3.fromWei(account_one, "ether"));

    return ValueOwners.deployed().then(function(instance) {
      vo_contract = instance;
      return vo_contract.buyValue.call({from: account_one, value:10000000000000000});
    }).then(function(success) {
      assert.equal(success, true, 'buyValue doesn\'t returns true first time');
    }).then(function() {
      return vo_contract.buyValue.call({from: account_one,
      value:10000000000000000});
    }).then(function(success) {
      assert.equal(success, false, 'buyValue doesn\'t returns false second time');
    });
  });*/

});
