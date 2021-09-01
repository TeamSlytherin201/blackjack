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

function createSeatAvailDiv() {

};

function createPlayerDiv(playerDiv, player) {
  let cardDiv = createAndAppend("div", playerDiv)
  cardDiv.classList.add("cards");
  for (let i = 0; i < player.hand.length; i++) {
    let cardImg = createAndAppend("img", cardDiv);
    cardImg.src = player.hand[i].img;
  };
  let optionDiv = createAndAppend("div", playerDiv);
  optionDiv.classList.add("options");
  let hitButton = createAndAppend("button", optionDiv, "Hit");
  let standButton = createAndAppend("button", optionDiv, "Stand");
  let personDiv = createAndAppend("div", playerDiv);
  personDiv.classList.add("person");
  let nameH2 = createAndAppend("h2", personDiv, player.name);
  let moneyP = createAndAppend("p", personDiv, player.money);
};

function createEmptyDiv(playerDiv) {

};


for (let i = 0; i < table.players.length; i++) {
  if (i < 4) {
    let playerDivs = document.getElementsByClassName("players");
    if (table.players[i] !== null) {
      console.log(table.players[i]);
      createPlayerDiv(playerDivs[i], table.players[i]);
    } else {
      createEmptyDiv(playerDivs[i]);
    }
  } else {
    let dealerDiv = document.getElementById("dealer");
    createPlayerDiv(dealerDiv, table.players[i]);
  };
};
let dealerNatural = checkIfNatural(table.players[4]);
table.evaluateResults(dealerNatural);