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
      assert.equal(newCost, 15000000000000000, 'New cost doesn\' eqals new value 15000000000000000');
    });
  });

});
