"use strict";
console.log("Initialized");



function createAndAppend(element, parent, textContent) {
  let newElem = document.createElement(element);
  parent.appendChild(newElem);
  if (textContent !== undefined) {
    newElem.textContent = textContent;
  };
  return newElem;
};

function takeBets() {
  for (let i = 0; i < table.players.length - 1; i++) {
    if (table.players[i] !== null) {
      let amount = document.getElementById("bet-" + i).value;
      amount = parseInt(amount);
      let betApproved = table.takeBet(amount, table.players[i]);
      if (!betApproved) {
        let playerDiv = document.getElementById("player-" + i);
        createSeatAvailDiv(playerDiv);
      };
    };
  };
};

function handleStand() {
  console.log(this);
  console.log("stand");
};

function handleHit() {
  console.log(this);
  console.log("hit");
};

function nextPlayer(nextIndex) {
  if (nextIndex > -1) {
    let currentIndex;
    for (let i = nextIndex; i >= 0; i--) {
      console.log(i);
      if (table.players[i] !== null) {
        currentIndex = i;
        let playerDiv = document.getElementById("player-" + i);
        let moveButtons = playerDiv.getElementsByClassName("moves");
        for (let j = 0; j < moveButtons.length; j++) {
          moveButtons[j].classList.remove("hidden");
        };
        moveButtons[0].addEventListener('click', handleHit);
        moveButtons[1].addEventListener('click', handleStand);
        i = -1;
      };
    };
  };
};

function startDeal() {
  this.classList.add("hidden");
  let waitingPs = document.getElementsByClassName("waiting");
  let betElems = document.getElementsByClassName("bet");
  takeBets();
  table.dealHands();
  for (let i = 0; i < waitingPs.length; i++) {
    waitingPs[i].classList.add("hidden");
  };
  for (let i = 0; i < betElems.length; i++) {
    betElems[i].classList.add("hidden");
  };
  for (let i = 1; i > - 1; i--) {
    for (let j = 4 - i; j >= 0; j--) {
      let player = table.players[j];
      if (player !== null) {
        let playerDiv;
        if (!player.isDealer) {
          playerDiv = document.getElementById("player-" + j);
        } else {
          playerDiv = document.getElementById("dealer");
        } 
        let cardDiv = playerDiv.getElementsByClassName("cards")[0];
        let cardImg = createAndAppend("img", cardDiv);
        let cardNum = 0;
        if (i === 0) {
          cardNum = 1;
        } else {
          cardNum = 0;
        };
        cardImg.src = player.hand[cardNum].img;
      };
    };
  };
  let dealerDiv = document.getElementById("dealer");
  let cardDiv = dealerDiv.getElementsByClassName("cards")[0];
  let cardImg = createAndAppend("img", cardDiv);
  cardImg.src = "./img/card_back.png";
  nextPlayer(3);
};

function handleSubmit() {
  let parentNode = this.parentNode;
  let name = this.parentNode.childNodes[1].value;
  if (name === "") {
    alert("Please enter a name!");
  } else {
    let player;
    for (let i = 0; i < Player.allPlayers.length; i++) {
      if (Player.allPlayers[i].name.toLowerCase() === name.toLowerCase()) { // check if name matches a name in local storage
        player = Player.allPlayers[i];
      };
    };
    if (player === undefined) { // check if player exists in stored data
      let newPlayer = new Player(name, 50000, false);
      table.saveData();
    } else {
      if (table.players.includes(player)){
        alert("Player already seated at table.");
      } else {
        let index = parentNode.id.substr(7, 1);
        let success = table.addPlayer(player,index);
        if (success) {
          parentNode.innerHTML = "";
          createPlayerDiv(parentNode, player);
        } else {
          console.log("Error app.js:42, player already seated at position.");
        };
      };
    };
    let dealButton = document.getElementById("deal");
    let isHidden = dealButton.classList.contains("hidden");
    if (isHidden) {
      dealButton.classList.remove("hidden");
      dealButton.addEventListener('click', startDeal);
    };
  };
};

function createNewPlayerForm() {
  let playerDiv = this.parentNode.parentNode;
  this.removeEventListener('click', createNewPlayerForm);
  playerDiv.innerHTML = "";
  createAndAppend("p", playerDiv, "Enter Your Name");
  let newPlayerInput = createAndAppend("input", playerDiv);
  newPlayerInput.id = playerDiv.id + "-name";
  let submitButton = createAndAppend("button", playerDiv, "Submit");
  submitButton.addEventListener('click', handleSubmit);
};

function createSeatAvailDiv(playerDiv) {
  playerDiv.innerHTML = "";
  let emptyDiv = createAndAppend("div", playerDiv);
  emptyDiv.classList.add("empty-seat");
  let sitButton = createAndAppend("button", emptyDiv, "Sit Here");
  sitButton.addEventListener('click', createNewPlayerForm);
};

function createPlayerDiv(playerDiv, player) {
  playerDiv.innerHTML = "";
  let cardDiv = createAndAppend("div", playerDiv)
  cardDiv.classList.add("cards");
  for (let i = 0; i < player.hand.length; i++) {
    let cardImg = createAndAppend("img", cardDiv);
    cardImg.src = player.hand[i].img;
  };
  let optionDiv;
  optionDiv = createAndAppend("div", playerDiv);
  optionDiv.classList.add("options");
  let personDiv = createAndAppend("div", playerDiv);
  personDiv.classList.add("person");
  let nameH2 = createAndAppend("h2", personDiv, player.name);
  if (!player.isDealer) {
    let hitButton = createAndAppend("button", optionDiv, "Hit");
    let standButton = createAndAppend("button", optionDiv, "Stand");
    hitButton.classList.add("moves");
    hitButton.classList.add("hidden");
    standButton.classList.add("moves");
    standButton.classList.add("hidden");
    let waitingP = createAndAppend("p", cardDiv, "Awaiting Deal");
    waitingP.classList.add("waiting");
    let betP = createAndAppend("p", optionDiv, "Bet Amount");
    betP.classList.add("bet");
    let betInput = createAndAppend("input", optionDiv);
    betInput.id = "bet-" + table.players.indexOf(player);
    betInput.classList.add("bet");
    let moneyP = createAndAppend("p", personDiv, player.money);
  } else {
    let dealButton = createAndAppend("button", optionDiv, "Deal");
    dealButton.id = "deal";
    dealButton.classList.add("hidden");
  };
};

function startingState() {
  for (let i = 0; i < 4; i++) {
    let playerDiv = document.getElementById("player-" + i);
    createSeatAvailDiv(playerDiv);
  };
  let dealerDiv = document.getElementById("dealer");
  createPlayerDiv(dealerDiv, table.players[4]);
};

startingState();

// let dealerNatural = checkIfNatural(table.players[4]);
// table.evaluateResults(dealerNatural);