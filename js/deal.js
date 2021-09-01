"use strict";


function Player(name, money, isDealer) {
  this.name = name;
  this.money = money;
  this.isDealer = isDealer;
  this.hand = [];
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

function Table(dealer) {
  this.players = [null, null, null, null, dealer];
  this.bets = [null, null, null, null];
  this.handInPlay = false;
  Table.tables.push(this);
};
Table.tables = [];

Table.prototype.addPlayer = function(player, position) {
  if (this.players[position] === null) {
    this.players.splice(position, 1, player);
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

Table.prototype.evaluateResults = function() {
  let players = this.players;
  let dealerTotal = players[4].getTotal();
  let bets = this.bets;
  let returnString;
  returnString = "Dealer Total: " + dealerTotal;
  console.log(returnString);
  for (let i = 0; i < players.length - 1; i++) {
    let player = players[i];
    if (player !== null) {
      let playerTotal = players[i].getTotal();
      returnString = player.name + " Total: " + playerTotal;
      console.log(returnString);
      if (playerTotal > 21) {
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
      } else if (playerTotal < dealerTotal) {
        returnString = player.name + " loses " + bets[i];
        console.log(returnString);
      } else {
        returnString = player.name + " pushes!";
        console.log(returnString);
      };
    };
  };
};

let dealer = new Player("Bob", 0, true);
let table = new Table(dealer);
let joe = new Player("Joe", 50000, false);
table.addPlayer(joe, 2);
let jim = new Player("Jim", 50000, false);
table.addPlayer(jim, 1);
let jon = new Player("Jon", 50000, false);
table.addPlayer(jon, 3);


console.log(table.players);
table.takeBet(20000, joe);
table.takeBet(40000, jim);
table.takeBet(15000, jon);

table.dealHands();

for (let i = 0; i < table.players.length; i++) {
  if (table.players[i] !== null) {
    while (table.players[i].getTotal() < 17) {
      table.players[i].getCard();
    };
    console.log(table.players[i].getTotal());
    console.log(table.players[i].hand);
  };
};

table.evaluateResults();