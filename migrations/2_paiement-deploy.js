var paiement = artifacts.require("paiement");

module.exports = function(deployer) {
  deployer.deploy(paiement);
};