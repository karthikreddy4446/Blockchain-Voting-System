const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  // Deploy with initial candidates
  const candidates = ["Karthik", "Sadwik", "Anirudh", "Nikhil", "Ganesh"];
  deployer.deploy(Voting, candidates);
};