const TokenPets = artifacts.require('TokenPets');

module.exports = function (deployer) {
  deployer.deploy(TokenPets);
};
