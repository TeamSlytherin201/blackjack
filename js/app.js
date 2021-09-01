console.log("Initialized");



function createAndAppend(element, parent, textContent) {
  let newElem = document.createElement(element);
  parent.appendChild(newElem);
  if (textContent !== undefined) {
    newElem.textContent = textContent;
  };
  return newElem;
};

function startDeal() {
  let waitingPs = document.getElementsByClassName("waiting");
  let first;
  table.dealHands();
  for (let i = 0; i < waitingPs.length; i++) {
    waitingPs[i].classList.add("hidden");
  };
  for (let i = 1; i < 3; i++) {
    for (let j = table.players.length - 2; j > 0; j--) {
      let player = table.players[j];
      console.log(player);
      if (player !== null) {
        let playerDiv = document.getElementById("player-" + j);
        let cardDiv = playerDiv.getElementsByClassName("cards")[0];
        let cardImg = createAndAppend("img", cardDiv);
        console.log(player.hand);
        cardImg.src = player.hand[(i - 1)].img;
        if (i === 1 && first === undefined) {
          let buttons = playerDiv.getElementsByClassName("moves");
          for (let k = 0; k < buttons.length; k++) {
            buttons[k].classList.remove("hidden");
          };
          first = false;
        };
      };
    };
  };
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
    let betInput = createAndAppend("input", optionDiv);
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
let testArray = [{name: "bob", money: 0, isDealer: false, hand: [{value: "10", suit: "Hearts", score: 10, img: "card_hea10.png"}, {value: "A", suit: "Diamonds", score: 11, img: "card_diaa.png"} ]},
  {name: "joe", money: 0, isDealer: false, hand: [{value: "K", suit: "Diamonds", score: 10, img: "card_diak.png"}, {value: "A", suit: "Diamonds", score: 11, img: "card_diaa.png"}]},
  ]

function compareHands() {
  var h1;
  var h2;
  var totalValues = [];
  for (let j = 0; j < testArray.length; j++) {
    let total = 0;
    for (let i = 0; i < testArray[j].hand.length; i++) {
      total += testArray[j].hand[i].score;
    }
    totalValues.push(total);
  }
  if (totalValues[0] > 21 ) {
    console.log("bob bust");
    //testArray[0].name busts
    //testArray[0].money --
  } if (totalValues[1] > 21) {
    console.log("joe bust");
    //testArray[1].name busts
    //testArray[1].money --
  } else if (totalValues[0] > totalValues[1]) {
    console.log("bob > joe");
    //testArray[0].name has a higher card count value
    //testArray[0].money ++
  } else if (totalValues[0] < totalValues[1]) {
    console.log("bob < joe");
    //testArray[1].name has a higher card count value
    //testArray[1].money ++
  } else if (totalValues[0] == totalValues[1]) {
    console.log("bob == joe")
    //testArray[1].name and testArray[0].name have the same value in cards
    //testArray[1].money and testArray[0].money ++
  }
}

//compareHands();
