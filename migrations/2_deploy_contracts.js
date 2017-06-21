var ValueOwners = artifacts.require("./ValueOwners.sol");

module.exports = function(deployer) {
  deployer.deploy(ValueOwners);
};
