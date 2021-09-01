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

function handleSubmit() {
  let name = this.parentNode.childNodes[1].value;
  if (name === "") {
    alert("Please enter a name!");
  } else {
    let player;
    for (let i = 0; i < Player.allPlayers.length; i++) {
      if (Player.allPlayers[i].name.toLowerCase() === name.toLowerCase()) {
        console.log("name matches records");
        player = Player.allPlayers[i];
      };
    };
    if (player === undefined) { // check if player exists in stored data
      console.log("doesn't exist");
    } else {
      if (table.players.includes(player)){
        alert("Player already seated at table.");
      } else {
        this.parentNode.innerHTML = "";
      };
      console.log(player);
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
  if (!player.isDealer) {
    optionDiv = createAndAppend("div", playerDiv);
    optionDiv.classList.add("options");
  };
  let personDiv = createAndAppend("div", playerDiv);
  personDiv.classList.add("person");
  let nameH2 = createAndAppend("h2", personDiv, player.name);
  if (!player.isDealer) {
    let hitButton = createAndAppend("button", optionDiv, "Hit");
    let standButton = createAndAppend("button", optionDiv, "Stand");
    let moneyP = createAndAppend("p", personDiv, player.money);
  };
};

function startingState() {
  for (let i = 0; i < 4; i++) {
    let playerDiv = document.getElementById("player-" + i);
    createSeatAvailDiv(playerDiv);
  };
};

startingState();


for (let i = 0; i < table.players.length; i++) {
  if (i < 4) {
    let playerDivs = document.getElementsByClassName("players");
    if (table.players[i] !== null) {
      createPlayerDiv(playerDivs[i], table.players[i]);
    }
  } else {
    let dealerDiv = document.getElementById("dealer");
    createPlayerDiv(dealerDiv, table.players[i]);
  };
};
let dealerNatural = checkIfNatural(table.players[4]);
table.evaluateResults(dealerNatural);