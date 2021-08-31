"use strict";

function Hand(position) {
  this.hand = [];
}

function Player(name, money, isDealer) {
  this.name = name;
  this.money = money;
  this.isDealer = isDealer;
  this.hand = new Hand();
  Player.allPlayers.push(this);
}
Player.allPlayers = [];


function Table(dealer) {
  this.players = [dealer, null, null, null, null];
  Table.tables.push(this);
}
Table.tables = [];

Table.prototype.addPlayer = function(player, position) {
  this.players.splice(position, 0, player);
}

Table.prototype.dealHands = function() {

}


let dealer = new Player("Bob", 0, true);
let table = new Table(dealer);

console.log(table);