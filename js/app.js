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
  let playerDiv = this.parentNode.parentNode;
  let index = playerDiv.id.substr(7, 1);
  let moveButtons = playerDiv.getElementsByClassName("moves");
  moveButtons[0].removeEventListener('click', handleHit);
  moveButtons[1].removeEventListener('click', handleStand);
  moveButtons[0].classList.add("hidden");
  moveButtons[1].classList.add("hidden");
  let nextIndex = index - 1;
  nextPlayer(nextIndex);
};

function handleHit() {
  let playerDiv = this.parentNode.parentNode;
  let index = playerDiv.id.substr(7, 1);
  let player = table.players[index];
  let cardIndex = player.hand.length;
  player.getCard();
  let card = player.hand[cardIndex];
  let cardDiv = playerDiv.getElementsByClassName("cards")[0];
  let cardImg = createAndAppend("img", cardDiv);
  cardImg.src = card.img;
  let score = playerDiv.getElementsByClassName("score")[0];
  score.textContent = player.getTotal();
  if (player.getTotal() > 21) {
    let nextIndex = index - 1;
    nextPlayer(nextIndex);
    let moveButtons = playerDiv.getElementsByClassName("moves");
    moveButtons[0].removeEventListener('click', handleHit);
    moveButtons[1].removeEventListener('click', handleStand);
    moveButtons[0].classList.add("hidden");
    moveButtons[1].classList.add("hidden");
  };
};

function nextPlayer(nextIndex) {
  if (nextIndex > -2) {
    let currentIndex;
    let playersRemain = false;
    for (let i = nextIndex; i >= 0; i--) {
      if (table.players[i] !== null) {
        playersRemain = true;
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
    if (!playersRemain) {
      table.playDealer();
      let dealer = table.players[4];
      let playerDiv = document.getElementById("dealer");
      let cardDiv = playerDiv.getElementsByClassName("cards")[0];
      let cardBack = cardDiv.childNodes[1];
      let score = playerDiv.getElementsByClassName("score")[0];
      cardBack.remove();
      for (let i = 1; i < dealer.hand.length; i++) {
        let card = createAndAppend("img", cardDiv);
        card.src = dealer.hand[i].img;
        score.textContent = dealer.getTotal();
      };
      let dealerNatural = checkIfNatural(dealer);
      let results = table.evaluateResults(dealerNatural);
      let nextButton = document.getElementById("next");
      nextButton.classList.remove("hidden");
      nextButton.addEventListener("click", nextHand);
      let gameTextDiv = document.getElementById("game-text");
      for (let i = 0; i < results.length; i++) {
        gameTextDiv.textContent += results[i] + " \r\n";
      };
      for (let i = 0; i < table.players.length - 1; i++) {
        if (table.players[i] !== null) {
          let updateDiv = document.getElementById("player-" + i);
          let money = updateDiv.getElementsByClassName("money")[0];
          money.innerHTML = table.players[i].money;
        };
      };
    };
  };
};

function nextHand() {
  let gameText = document.getElementById("game-text");
  gameText.innerHTML = "";
  for (let i = 0; i < table.players.length; i++) {
    let player = table.players[i];
    if (player !== null) {
      let playerDiv;
      if (i !== table.players.length - 1) {
        playerDiv = document.getElementById("player-" + i);
      } else {
        playerDiv = document.getElementById("dealer");
        table.handInPlay = true;
      };
      createPlayerDiv(playerDiv, player);
    };
  };
};


function startDeal() {
  let gameText = document.getElementById("game-text");
  gameText.innerHTML = "";
  let hasBet = true;
  for (let i = 0; i < table.players.length - 1; i++) {
    let player = table.players[i];
    if (player !== null) {
      let betAmountInput = document.getElementById("bet-" + i);
      if (betAmountInput.value === "") {
        hasBet = false;
      };
    };
  };

  if (!hasBet) {
    gameText.innerHTML = "Please make a bet!";
    return;
  };

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
      if (player !== null && player.hand.length !== 0) {
        let playerDiv;
        let scoreDiv;
        if (!player.isDealer) {
          playerDiv = document.getElementById("player-" + j);
          let moneyP = playerDiv.getElementsByClassName("money")[0];
          moneyP.innerHTML = "$" + player.money;
          scoreDiv = playerDiv.getElementsByClassName("score")[0];
          scoreDiv.textContent = player.getTotal();
        } else {
          playerDiv = document.getElementById("dealer");
          scoreDiv = playerDiv.getElementsByClassName("score")[0];
          scoreDiv.textContent = player.hand[0].score;
        } 
        let cardDiv = playerDiv.getElementsByClassName("cards")[0];
        let cardImg = createAndAppend("img", cardDiv);
        let cardNum = 0;
        if (i === 0) {
          if (!player.isDealer) {
            cardNum = 1;
          };
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
  let dealerNatural = checkIfNatural(table.players[4]);
  if (dealerNatural) {
    nextPlayer(-1);
  } else {
    nextPlayer(3);
  };
};

function handleSubmit() {
  let parentNode = this.parentNode;
  let name = this.parentNode.childNodes[1].value;
  if (name === "") {
    let gameText = document.getElementById("game-text");
    gameText.innerHTML = "Please enter a name!";
  } else {
    let player;
    for (let i = 0; i < Player.allPlayers.length; i++) {
      if (Player.allPlayers[i].name.toLowerCase() === name.toLowerCase()) { // check if name matches a name in local storage
        player = Player.allPlayers[i];
      };
    };
    if (player === undefined) { // check if player exists in stored data
      player = new Player(name, 50000, false);
      table.saveData();
    }
      if (table.players.includes(player)){
        let gameText = document.getElementById("game-text");
        gameText.innerHTML = "Player already seated at table!";
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
  submitButton.classList.add("btn");
  submitButton.classList.add("tertiary");
};

function createSeatAvailDiv(playerDiv) {
  playerDiv.innerHTML = "";
  let emptyDiv = createAndAppend("div", playerDiv);
  emptyDiv.classList.add("empty-seat");
  let sitButton = createAndAppend("button", emptyDiv, "Sit");
  sitButton.addEventListener('click', createNewPlayerForm);
  sitButton.classList.add("btn");
  sitButton.classList.add("secondary");
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
  
  let scoreDiv = createAndAppend("div", personDiv);
  scoreDiv.classList.add("score");
  let nameH2 = createAndAppend("h2", personDiv, player.name);
  if (!player.isDealer) {
    let hitButton = createAndAppend("button", optionDiv, "Hit");
    let standButton = createAndAppend("button", optionDiv, "Stand");
    hitButton.classList.add("btn");
    hitButton.classList.add("primary")
    hitButton.classList.add("moves");
    hitButton.classList.add("hidden");
    standButton.classList.add("btn");
    standButton.classList.add("secondary");
    standButton.classList.add("moves");
    standButton.classList.add("hidden");
    let waitingP = createAndAppend("p", cardDiv, "Awaiting Deal");
    waitingP.classList.add("waiting");
    let betP = createAndAppend("p", optionDiv, "Bet Amount");
    betP.classList.add("bet");
    let betInput = createAndAppend("input", optionDiv);
    betInput.id = "bet-" + table.players.indexOf(player);
    betInput.classList.add("bet");
    let money = "$" + player.money;
    let moneyP = createAndAppend("p", personDiv, money);
    moneyP.classList.add("money");
  } else {
    let dealButton = createAndAppend("button", optionDiv, "Deal");
    dealButton.id = "deal";
    dealButton.classList.add("btn");
    dealButton.classList.add("secondary");
    if (table.handInPlay === false) {
      dealButton.classList.add("hidden");
    } else {
      dealButton.addEventListener("click", startDeal);
    };
    let nextButton = createAndAppend("button", optionDiv, "Next");
    nextButton.id = "next";
    nextButton.classList.add("hidden");
    nextButton.classList.add("btn");
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