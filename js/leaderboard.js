function sortMoney(players) {
  players.sort(function (a, b) {
      let bMoney = b.money;
      let aMoney = a.money;
      return bMoney - aMoney;
  });
    return players;
};

function updateLeaderboard() {
    let leaderboard = document.getElementById("leaderboard");

    let players = Player.allPlayers.slice();
    players = sortMoney(players);
    for (let i = 0; i < players.length; i++) {
      if (!players[i].isDealer) {
        let playerDiv = document.createElement("div");
        playerDiv.classList.add("lb-position");
        let nameDiv = document.createElement("div");
        playerDiv.appendChild(nameDiv);
        let moneyDiv = document.createElement("div");
        playerDiv.appendChild(moneyDiv);
        nameDiv.textContent = players[i].name;
        moneyDiv.textContent = "$" + players[i].money;
        document.getElementById("leaderboard").appendChild(playerDiv);
      };
    };
}

updateLeaderboard();
