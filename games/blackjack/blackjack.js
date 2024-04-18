var totalBalance = 1000;
var didAction = false;
var debug = true;
var players = {
    player1: {
        position: 1,
        hand: [],
        score: 0,
        bet: 0,
        isPlaying: false,
        insurance: false
    },
    player2: {
        position: 2,
        hand: [],
        score: 0,
        bet: 0,
        isPlaying: false,
        insurance: false
    },
    player3: {
        position: 3,
        hand: [],
        score: 0,
        bet: 0,
        isPlaying: false,
        insurance: false
    },
    player4: {
        position: 4,
        hand: [],
        score: 0,
        bet: 0,
        isPlaying: false,
        insurance: false
    },
    player5: {
        position: 5,
        hand: [],
        score: 0,
        bet: 0,
        isPlaying: false,
        insurance: false
    },
    dealer: {
        position: 6,
        hand: [],
        score: 0,
        isPlaying: true,
        insurance: false
    }
}

function ResetGame(){
    for (const player of Object.values(players)) {
        for (const card of player.hand) {
            deck.push(card);
        }
        player.hand = [];
        player.score = 0;
        document.getElementById("handValue" + player.position).innerHTML = player.score;
        if(player.position !== 6){
            player.bet = 0;
            player.isPlaying = false;
            player.insurance = false;
            document.getElementById("handMoneyValue" + player.position).innerHTML = "$" +  player.bet;
            document.getElementById("player" + player.position + "Outcome").style.display = "none";
        }
        document.getElementById("cardStack" + player.position).innerHTML = "";
    }
}

var deck = [
    "aceOfClubs", "twoOfClubs", "threeOfClubs", "fourOfClubs", "fiveOfClubs", "sixOfClubs", "sevenOfClubs", "eightOfClubs", "nineOfClubs", "tenOfClubs", "jackOfClubs", "queenOfClubs", "kingOfClubs",
    "aceOfDiamonds", "twoOfDiamonds", "threeOfDiamonds", "fourOfDiamonds", "fiveOfDiamonds", "sixOfDiamonds", "sevenOfDiamonds", "eightOfDiamonds", "nineOfDiamonds", "tenOfDiamonds", "jackOfDiamonds", "queenOfDiamonds", "kingOfDiamonds",
    "aceOfHearts", "twoOfHearts", "threeOfHearts", "fourOfHearts", "fiveOfHearts", "sixOfHearts", "sevenOfHearts", "eightOfHearts", "nineOfHearts", "tenOfHearts", "jackOfHearts", "queenOfHearts", "kingOfHearts",
    "aceOfSpades", "twoOfSpades", "threeOfSpades", "fourOfSpades", "fiveOfSpades", "sixOfSpades", "sevenOfSpades", "eightOfSpades", "nineOfSpades", "tenOfSpades", "jackOfSpades", "queenOfSpades", "kingOfSpades"
]

function ShuffleDeck(deck) {
    for(var x = 0; x < 3; x++){
        for (var i = 0; i < deck.length; i++) {
            var randomIndex = Math.floor(Math.random() * deck.length);
            var temp = deck[i];
            deck[i] = deck[randomIndex];
            deck[randomIndex] = temp;
        }
    }

    if(debug){
        deck[50] = "aceOfSpades";
        console.log(deck[50]);
    }
}

function IncreaseBet(player) {
    if(totalBalance > 0){
        players[Object.keys(players)[player-1]].bet+= 100;
        totalBalance-=100;
        document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
        players[Object.keys(players)[player-1]].isPlaying = true;
        document.getElementById("handMoneyValue" + player).innerHTML = "$" +  players[Object.keys(players)[player-1]].bet;
    }
}

function DecreaseBet(player) {
    if(players[Object.keys(players)[player-1]].bet > 0){
        players[Object.keys(players)[player-1]].bet-= 100;
        totalBalance+=100;
        document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
        document.getElementById("handMoneyValue" + player).innerHTML = "$" +  players[Object.keys(players)[player-1]].bet;

        if(players[Object.keys(players)[player-1]].bet === 0){
            players[Object.keys(players)[player-1]].isPlaying = false;
        }
    }
}



async function Game(){
    ShuffleDeck(deck);
    //disable all "buttonsBet" class
    var buttons = document.getElementsByClassName("buttonsBet");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "none";
    }
    for (var i = 0; i < 2; i++) {
        for (const player of Object.values(players)) {
            if (player.isPlaying) {
                player.hand.push(deck.pop());
                let pos = document.getElementById("cardStack" + player.position);
                let img = document.createElement("div");
                let isFirstCard = i === 0;
                if(!isFirstCard && player.position === 6){
                    img.setAttribute("id", "backOfCard");
                }else{
                    img.setAttribute("id", player.hand[player.hand.length - 1]);
                    player.score = CalculateScore(player.hand);
                    document.getElementById("handValue" + player.position).innerHTML = player.score;
                }
                img.setAttribute("class", isFirstCard ? "firstCard" : "card");
                pos.appendChild(img);
                await new Promise(r => setTimeout(r, 600));
            }
        }
    }

    for (const player of Object.values(players)) {
        if(player.position === 6) continue;
        if(player.isPlaying){
            document.getElementById("buttons" + player.position).style.display = "flex";
            //hit button
            document.getElementById("buttons" + player.position).children[0].onclick = function() {
                GivePlayerCard(player);
                if(player.score >= 21){
                    player.isPlaying = false;
                }
            }
            //stand button
            document.getElementById("buttons" + player.position).children[1].onclick = function() {
                player.isPlaying = false;
            }
            //double down button
            document.getElementById("buttons" + player.position).children[2].onclick = function() {
                if(totalBalance >= player.bet){
                    player.bet *= 2;
                    totalBalance -= player.bet;
                    document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
                    GivePlayerCard(player);
                    player.isPlaying = false;
                }
            }

            //show insurance button if dealer has ace
            if(players.dealer.hand[0].includes("ace")){
                document.getElementById("buttons" + player.position).children[3].style.display = "flex";
                //insurance button
                document.getElementById("buttons" + player.position).children[3].onclick = function() {
                    if(totalBalance >= player.bet/2){
                        player.insurance = true;
                        totalBalance -= player.bet/2;
                        player.bet += player.bet/2;
                        document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
                        document.getElementById("handMoneyValue" + player.position).innerHTML = "$" +  player.bet;
                        document.getElementById("buttons" + player.position).children[3].style.display = "none";
                    }
                }
            }

            //

            while (player.isPlaying) {
                await new Promise(r => setTimeout(r, 100));
            }
            document.getElementById("buttons" + player.position).children[3].style.display = "none";
            document.getElementById("buttons" + player.position).style.display = "none";
        }
    }

    //reveal dealer card
    document.getElementById("backOfCard").id = players.dealer.hand[1];
    players.dealer.score = CalculateScore(players.dealer.hand);
    document.getElementById("handValue" + players.dealer.position).innerHTML = players.dealer.score;
    await new Promise(r => setTimeout(r, 1600));

    while (players.dealer.score < 17) {
        GivePlayerCard(players.dealer);
        await new Promise(r => setTimeout(r, 600));
    }

    //pay out
    for (const player of Object.values(players)) {
        if(player.position === 6) continue;
        if(player.hand.length === 0) continue;
        document.getElementById("player" + player.position + "Outcome").style.display = "block";
        if(player.score > 21){
            player.isPlaying = false;
            document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Bust!";
            console.log(document.getElementById("player" + player.position + "Outcome").children[0].innerHTML);
            if(players.dealer.score === 21 && players.dealer.hand.length === 2 && player.insurance && player.dealer.hand[0].includes("ace")){
                totalBalance += player.bet / 3 * 2;
                document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
                document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Insurance!";
            }
        }else if(player.score > players.dealer.score || players.dealer.score > 21){
            if(player.score === 21 && player.hand.length === 2){
                document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Blackjack!";
                totalBalance += player.bet*2.5;
                document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
            }else{
                document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Win!";
                totalBalance += player.bet*2;
                document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
            }
        }else if(player.score === players.dealer.score){
            document.getElementById("handMoneyValue" + player.position).innerHTML = "$" +  player.bet;
            document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Push!";
            totalBalance += player.bet;
        }else{
            console.log(player.insurance);
            console.log(players.dealer.score);
            console.log(players.dealer.hand.length);
            console.log(players.dealer.hand[0]);
            if(players.dealer.score === 21 && players.dealer.hand.length === 2 && player.insurance && players.dealer.hand[0].includes("ace")){
                //remove a third of the bet
                totalBalance += player.bet / 3 * 2;
                document.getElementsByClassName("balance")[0].innerHTML = "Balance : $" +  totalBalance;
                document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Insurance!";
            }else{
                document.getElementById("player" + player.position + "Outcome").children[0].innerHTML = "Lose!";
            }
        }

        player.bet = 0;
        document.getElementById("handMoneyValue" + player.position).innerHTML = "$" +  player.bet;
    }

    await new Promise(r => setTimeout(r, 4000));
    //disable all  document.getElementById("buttons" + player.position)
    for (const player of Object.values(players)) {
        if(player.position === 6) continue;
        document.getElementById("buttons" + player.position).style.display = "none";
    }
    var buttons = document.getElementsByClassName("buttonsBet");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "flex";
    }
    document.getElementsByClassName("play")[0].style.display = "block";
    ResetGame();
}

function GivePlayerCard(player) {
    player.hand.push(deck.pop());
    let pos = document.getElementById("cardStack" + player.position);
    let img = document.createElement("div");
    img.setAttribute("id", player.hand[player.hand.length - 1]);
    player.score = CalculateScore(player.hand);
    document.getElementById("handValue" + player.position).innerHTML = player.score;
    img.setAttribute("class", "card");
    pos.appendChild(img);
    if (player.score > 21) {
        player.isPlaying = false;
    }
}

function CalculateScore(player) {
    let score = 0;
    let aceCount = 0;
    for (const card of player) {
        if (card.includes("ace")) {
            aceCount++;
        }
        score += CalculateCardValue(card);
    }
    while (aceCount > 0 && score > 21) {
        score -= 10;
        aceCount--;
    }
    return score;
}

function CalculateCardValue(card) {
    if (card.includes("ace")) {
        return 11;
    } else if (card.includes("two")) {
        return 2;
    } else if (card.includes("three")) {
        return 3;
    } else if (card.includes("four")) {
        return 4;
    } else if (card.includes("five")) {
        return 5;
    } else if (card.includes("six")) {
        return 6;
    } else if (card.includes("seven")) {
        return 7;
    } else if (card.includes("eight")) {
        return 8;
    } else if (card.includes("nine")) {
        return 9;
    } else if(card.includes("back")){
        return 0;
    }else{
        return 10;
    }
}


window.onload = function(){
    //bind E to start game
    document.addEventListener("keydown", function(event){
        if(event.key === "e"){
            Game();
        }
    });
    
    document.getElementsByClassName("play")[0].onclick = function() {
        //if no players are playing, return
        var playGame = false;
        for (const player of Object.values(players)) {
            if(player.position === 6) continue;
            if(player.isPlaying){
                playGame = true;
                break;
            }
        }

        if(!playGame) return;

        Game();
        document.getElementsByClassName("play")[0].style.display = "none";
    }
}

