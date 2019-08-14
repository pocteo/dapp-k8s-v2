const contract = require('truffle-contract');

const paiement_artifact = require("./build/contracts/paiement.json");
var paiement = contract(paiement_artifact);

module.exports = {
    start: function(callback) {
      var self = this;
  
      // Bootstrap the paiement abstraction for Use.
      paiement.setProvider(self.web3.currentProvider);
  
      // Get the initial account balance so it can be displayed.
      self.web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
          console.log("There was an error fetching your accounts.");
          return;
        }
  
        if (accs.length == 0) {
          console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }
        self.accounts = accs;
        self.account = self.accounts[0];
  
        callback(self.accounts);
      });
    },
     refreshBalance:function(account, callback) {
      var self = this;
  
      // Bootstrap the paiement abstraction for Use.
      paiement.setProvider(self.web3.currentProvider);
  
      var paiement_instance;
      paiement.deployed().then(function(instance) {
        paiement_instance = instance;
        const  balance= paiement_instance.getBalance.call({from: account});
        console.log(balance);
        return balance;
      }).then(function(value) {
          callback(value.valueOf());
      }).catch(function(e) {
          console.log(e);
          callback("Error 404");
      });
    },
    sendCoin: function(amount, sender, receiver, callback) {
      var self = this;
  
      // Bootstrap the paiement abstraction for Use.
      paiement.setProvider(self.web3.currentProvider);
  
      var paiement_instance;
      paiement.deployed().then(function(instance) {
        paiement_instance = instance;
        return paiement_instance.send(receiver,{from: sender, value: amount});
      }).then(function() {
        self.refreshBalance(sender, function (answer) {
          callback(answer);
        });
      }).catch(function(e) {
        console.log(e);
        callback("ERROR 404");
      });
    }
  }
  