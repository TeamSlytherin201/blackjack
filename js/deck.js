'use strict';

function Card(value, suit, score, img) {
  this.value = value;
  this.suit = suit;
  this.score = score;
  this.img = img;
};

function Deck() {
  this.suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  this.values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  this.deck = [];
};

Deck.prototype.assembleDeck = function() {
  for (let v = 0; v < this.values.length; v++) {
    for (let s = 0; s < this.suits.length; s++) {
      var score = parseInt(this.values[v]);
      if (this.values[v] === "J" || this.values[v] === "Q" || this.values[v] === "K") {
        score = 10;
      } else if (this.values[v] === "A") {
        score = 11;
      };
      var cardImg = "card_";
      cardImg += this.suits[s].toLowerCase().substr(0,3);
      cardImg += this.values[v].toLowerCase();
      cardImg += ".png";
      var card = new Card(this.values[v], this.suits[s], score, cardImg);
      this.deck.push(card);
    };
  };
};


function DeckShoe() {
  this.shoeSize = 7;
  this.shoe = [];
};

DeckShoe.prototype.assembleShoe = function() {
  for (let i = 0; i < this.shoeSize; i++) {
    let newDeck = new Deck();
    newDeck.assembleDeck();
    for (let j = 0; j < newDeck.deck.length; j++) {
      this.shoe.push(newDeck.deck[j]);
    }; 
  };
};

DeckShoe.prototype.shuffleShoe = function() {
  for (var i = 0; i < 5000; i++) {
    let cardOne, cardTwo, cardThree;
    cardOne = Math.floor((Math.random() * this.shoe.length));
    while (cardTwo === cardOne || cardTwo === undefined) {
      cardTwo = Math.floor((Math.random() * this.shoe.length));
    }
    while (cardThree === cardOne || cardThree === cardTwo || cardThree === undefined) {
      cardThree = Math.floor((Math.random() * this.shoe.length));
    }
    let tempCard = this.shoe[cardOne];
    this.shoe[cardOne] = this.shoe[cardTwo];
    this.shoe[cardTwo] = this.shoe[cardThree];
    this.shoe[cardThree] = tempCard;
  };
  console.log(this.shoe);
};

// code for getting a shoe of cards to be dealt
let deckShoe = new DeckShoe();
deckShoe.assembleShoe();
deckShoe.shuffleShoe();
