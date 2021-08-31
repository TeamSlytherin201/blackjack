console.log("Initialized");

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

compareHands();