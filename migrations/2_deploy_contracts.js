var OwnedMortal = artifacts.require("./OwnedMortal.sol");
var ValueOwners = artifacts.require("./ValueOwners.sol");

module.exports = function(deployer) {
  deployer.deploy(OwnedMortal);
  deployer.link(OwnedMortal, ValueOwners);
  deployer.deploy(ValueOwners);
};
