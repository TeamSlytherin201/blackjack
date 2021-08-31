"use strict";
console.log("Initialized");



function createAndAppend(element, parent, textContent) {
  let newElem = document.createElement(element);
  parent.appendChild(newElem);
  if (textContent !== undefined) {
    element.textContent = textContent;
  };
  return newElem;
};

function createSeatAvailDiv() {

};

function createPlayerDiv(parent, player) {
  console.log(player);
  let playerDiv = document.getElementById(parent);
  //let playerDiv = createAndAppend("div", containerDiv);
  let cardDiv = createAndAppend("div", playerDiv)
  cardDiv.classList.add("cards");
  let optionDiv = createAndAppend("div", playerDiv);
  optionDiv.classList.add("options");
  let personDiv = createAndAppend("div", playerDiv);
  personDiv.classList.add("person");
};

console.log(table);
for (let i = 0; i < table.players.length - 1; i++) {
  if (table.players[i] !== null) {
    createPlayerDiv("player-" + i, table.players[i]);
  };
};