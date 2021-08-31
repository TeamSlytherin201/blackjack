"use strict";


function Player(name, money, isDealer) {
  this.name = name;
  this.money = money;
  this.isDealer = isDealer;
  this.hand = [];
  this.id = Player.allPlayers.length;
  Player.allPlayers.push(this);
};
Player.allPlayers = [];

Player.prototype.getCard = function() {
  this.hand.push(deckShoe.getCard());
};

Player.prototype.getTotal = function() {
  let total = 0;
  let aces = [];
  for (let i = 0; i < this.hand.length; i++) {
    if (this.hand[i].value === "A") {
      aces.push(this.hand[i].value);
    } else {
      total += this.hand[i].score;
    };
  };
  for (let i = 0; i < aces.length; i++) {
    if (total + aces.length - 1 + 11 <= 21) {
      total += 11;
    } else {
      total += 1;
    };
  };
  return total;
};

Player.prototype.makeBet = function(amount) {
  amount = parseInt(amount);
  if (this.money >= amount) {
    this.money -= amount;
    return amount;
  };
  return 0;
};

Player.prototype.giveMoney = function(amount) {
  this.money += amount;
};

function Table(dealer) {
  this.players = [null, null, null, null, dealer];
  this.bets = [null, null, null, null];
  Table.tables.push(this);
};
Table.tables = [];

Table.prototype.addPlayer = function(player, position) {
  if (this.players[position] === null) {
    this.players.splice(position, 1, player);
    this.saveData();
    return true;
  }
  console.log("Sorry, there is already a player seated there.");
  return false;
};

Table.prototype.dealHands = function() {
  for (let i = 0; i < this.bets.length; i++) { // check if all players have bet
    if (this.players[i] !== null) {
      if (this.bets[i] === null) {
        this.players.splice(i, 1, null);
      };
    };
  };
  for (let i = 0; i < 2; i++) {
    for (let i = 0; i < Player.allPlayers.length; i++) { // give card to players seated twice
      if (Player.allPlayers[i] !== null) {
        Player.allPlayers[i].getCard();
      };
    };
  };
};

Table.prototype.playDealer = function() {
  let dealer = this.players[4];
  while (dealer.getTotal() < 17) {
    dealer.getCard();
  }
}

Table.prototype.takeBet = function(amount, player) {
  let checkAmount = player.makeBet(amount);
  if (checkAmount !== 0) {
    for (let i = 0; i < this.players.length - 1; i++) { // exclude dealer -1
      if (this.players[i] === player) {
        this.bets[i] = amount;
        return true;
      };
    };
  };
  return false;
};

Table.prototype.evaluateResults = function(dealerNatural) {
  let players = this.players;
  let dealerTotal = players[4].getTotal();
  let bets = this.bets;
  let returnString;
  returnString = "Dealer Total: " + dealerTotal;
  console.log(returnString);
  for (let i = 0; i < players.length - 1; i++) {
    let player = players[i];
    if (player !== null) {
      let playerNatural = checkIfNatural(player);
      let playerTotal = players[i].getTotal();
      returnString = player.name + " Total: " + playerTotal;
      console.log(returnString);
      if (dealerNatural && !playerNatural) {
        returnString = "Dealer has natural 21, player loses.";
        console.log(returnString);
      } else if (playerNatural && !dealerNatural) {
        returnString = player.name + " has natural 21, player wins " + (bets[i] * 2.5);
        console.log(returnString);
        player.giveMoney((bets[i] * 2.5));
      } else if (playerTotal > 21) {
        returnString = player.name + " busted and lost " + bets[i];
        console.log(returnString);
      } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        if (dealerTotal > 21) {
          returnString = "Dealer busted, ";
        } else {
          returnString = "";
        };
        returnString += player.name + " wins " + (bets[i] * 2);
        console.log(returnString);
        player.giveMoney((bets[i] * 2));
      } else if (playerTotal < dealerTotal) {
        returnString = player.name + " loses " + bets[i];
        console.log(returnString);
      } else {
        if (dealerNatural) {
          returnString = "Both players natural 21, ";
        } else {
          returnString = "";
        };
        returnString += player.name + " pushes!";
        console.log(returnString);
      };
      player.hand = [];
    };
  };
  players[4].hand = [];
  this.resetBets();
  this.saveData();
};

Table.prototype.resetBets = function() {
  this.bets = [null, null, null, null];
};

Table.prototype.saveData = function() {
  let playerData = Player.allPlayers.slice();
  for (let i = 0; i < this.bets.length; i++) {
    let bet = this.bets[i];
    if (bet !== null) {
      for (let j = 0; j < playerData.length; j++) {
        if (this.players[i].id == playerData[i].id) {
          playerData[i].money += bet;
          playerData[i].hand = [];
        };
      };
    };
  };
  let stringPlayerData = JSON.stringify(playerData);
  localStorage.setItem("players", stringPlayerData);
};

Table.prototype.loadData = function() {
  let oldData = localStorage.getItem("players");
  if (oldData !== null) {
    let playerPojo = JSON.parse(oldData);
    for (let i = 0; i < playerPojo.length; i++) {
      let player = playerPojo[i];
      player.money = parseInt(player.money);
      player.money = (player.isDealer === "true");
      new Player(player.name, player.money, player.isDealer);
    };
  } else {
    let joe = new Player("Joe", 50000, false);
    table.addPlayer(joe, 2);
    let jim = new Player("Jim", 50000, false);
    table.addPlayer(jim, 1);
    let jon = new Player("Jon", 50000, false);
    table.addPlayer(jon, 3);
    table.takeBet(20000, joe);
    table.takeBet(40000, jim);
    table.takeBet(15000, jon);
  };
};

function checkIfNatural(player) { // check if natural 21
  let playerTotal = parseInt(player.getTotal());
  if (playerTotal === 21 && player.hand.length === 2) {
    return true;
  };
  return false;
};


let dealer = new Player("Bob", 0, true);
let table = new Table(dealer);
table.loadData();







table.dealHands();

let dealerNatural = checkIfNatural(table.players[4]);
if (!dealerNatural) {
  for (let i = 0; i < table.players.length; i++) {
    if (table.players[i] !== null) {
      while (table.players[i].getTotal() < 17) {
        table.players[i].getCard();
      };
    };
  };
};
table.evaluateResults(dealerNatural);

