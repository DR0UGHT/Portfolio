const url= 'https://api.api-ninjas.com/v1/webscraper?url=https://random-word-api.herokuapp.com/word?length=5';
const headers = { 'X-Api-Key': 'Ml432Sl9mqBHGtRfXN8kBQ==nPc5X62r9yOpniLF' };
const contentType = 'application/json';
var debug = false;

var currRow = 1;
var currCol = 1;
var canType = true;
var badLetters = [];
var word = "";

window.onload = async function() {
    resetGame();

    document.addEventListener('contextmenu', event => event.preventDefault());
}

window.addEventListener('keydown', function(event) {
    if(event.key.length == 1 && event.key.match(/[a-z]/i)) {
        addLetter(event.key.toUpperCase());
    }else if(event.key == 'Backspace') {
        backspace();
    }else if(event.key == 'Enter') {
        checkWord();
    }
});

function resetGame() {
    for(var i = 1; i < 7; i++) {
        for(var j = 1; j < 6; j++) {
            var letterBox = document.getElementById('Row' + i + 'Box' + j);
            letterBox.innerHTML = "";
            letterBox.style.backgroundColor = 'transparent';
        }
    }

    for(var i = 65; i < 91; i++) {
        var letter = String.fromCharCode(i);
        var letterBox = document.getElementById(letter);
        letterBox.style.backgroundColor = 'rgb(111, 111, 111)';;
    }
    currRow = 1;
    currCol = 1;
    canType = true;
    badLetters = [];
    document.getElementById('winScreen').style.display = 'none';
    SetNewWord();
}
async function GetWord() {
    let myPromise = new Promise((myResolve, myReject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader('X-Api-Key', 'Ml432Sl9mqBHGtRfXN8kBQ==nPc5X62r9yOpniLF');
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = () => {
            if (req.status == 200) {
                //get the json response
                const rt = JSON.parse(req.responseText);
                var word = rt.data.substring(2, rt.data.length - 2);
                myResolve(word);
            } else {
                //lorum ipsum
                myReject('quick');
            }
        };
        req.send();
    });
    return myPromise;
}


function SetNewWord() {
    if(!debug) {
        GetWord().then((result) => {
            word = result.toLowerCase();
        });
    }else{
        word = "quick";
    }
}

function addLetter(letter) {
    if(badLetters.includes(letter.toLowerCase())) return;
    if(currCol > 5 || !canType) return;
    var letterBox = document.getElementById('Row' + currRow + 'Box' + currCol);
    
    letterBox.innerHTML = letter;

    if(currCol < 6) currCol++;
}

function backspace() {
    console.log(currCol);
    if(currCol <= 1 || !canType) return;
    var letterBox = document.getElementById('Row' + currRow + 'Box' + (currCol - 1));

    if(letterBox.innerHTML == "") return;

    letterBox.innerHTML = "";

    if(currCol > 1) {
        currCol--;
    }
}

async function checkWord() {
    if(currCol < 6 || !canType) return;
    canType = false;
    let letterRep = '';
    let correct = true;
    for(var i = 1; i < 6; i++) {
        let time = 0;
        let letterBox = document.getElementById('Row' + currRow + 'Box' + i);
        let letter = letterBox.innerHTML.toLowerCase();
        let correctLetter = letter == word[i-1];

        let correctLetterWrongPlace = word.includes(letter);
        if(correctLetterWrongPlace){
            let numLetterInWord = word.split(letter).length - 1;
            if(numLetterInWord > letterRep.split(letter).length - 1){
                letterRep += letter;
            }else{
                correctLetterWrongPlace = false;
            }
        }

        if(correctLetter) {
            fadeInBackgroundColor(letterBox, '89, 158, 113');
        }else if(correctLetterWrongPlace) {
            fadeInBackgroundColor(letterBox, '213, 219, 118');
            correct = false;
        }else{
            fadeInBackgroundColor(letterBox, '217, 48, 48');
            if(!word.includes(letter)) document.getElementById(letter.toUpperCase()).style.backgroundColor = 'rgba(0, 0, 40, 0.5)';
            correct = false;
            badLetters.push(letter);
        }

        await new Promise(resolve => setTimeout(resolve, 200));
    }

    if(correct) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        winGame();
    }else{
        currRow++;
        currCol = 1;
        if(currRow > 6) {
            loseGame();
        }
        canType = true;
    }
}

function winGame() {
    let winScreen = document.getElementById('winScreen');   
    let winText = document.getElementById('winText');
    winText.innerHTML = "Congratulations! You have won!";
    winScreen.style.display = 'flex';
}

function loseGame() {
    let winScreen = document.getElementById('winScreen');
    let winText = document.getElementById('winText');
    winText.innerHTML = "You have lost! The word was \"" + word + "\"";
    winScreen.style.display = 'flex';
}


async function fadeInBackgroundColor(element, color) {
    let time = 0;
    while(time < 1000) {
        time += 6;
        element.style.backgroundColor = 'rgba(' + color + ', ' + time/1000 + ')';
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}