let button, menu, game, gameOver, startButton, timeDisplay, targetsHitDisplay, countFunc, returnToMenuButton, restartButton;
var firstTime = true;
var counter = 0;
var timer = 0;
window.onload = function() {
    button = document.querySelector('.targetPracticeButton');
    menu = document.querySelector('.menu');
    game = document.querySelector('.game');
    gameOver = document.querySelector('.gameOver');
    timeDisplay = document.querySelector('.timer');
    targetsHitDisplay = document.querySelector('.targetsHit');
    returnToMenuButton = document.querySelector('.menuButton');
    startButton = document.querySelector('.startButton');
    restartButton = document.querySelector('.restartButton');

    button.addEventListener('click', function() {
        if(counter == 29){
            HideGame();
            ShowGameOver();
            CreatePin(button.style.left, button.style.top);
            clearInterval(countFunc);
            document.querySelector('.finalScore').innerHTML = "Average time per target : <br>" + Math.round(timer / 3) + 'ms'
            return;
        }
            
        targetsHitDisplay.innerHTML = ++counter + '/30';
        randomizeButton();
    });

    HideTarget();

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    returnToMenuButton.addEventListener('click', ReturnToMenu);
};


function randomizeButton() {
    if(!firstTime) CreatePin(button.style.left, button.style.top);
    
    firstTime = false;
    button.style.left = RandomRange(10, 90) + 'vw';
    button.style.top =  RandomRange(10, 90) + 'vh';
}

function RandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function startGame() {
    timer = 0;
    timeDisplay.innerHTML = '0.00s';
    targetsHitDisplay.innerHTML = '0/30';
    counter = 0;
    firstTime = true;
    
    HideMenu();
    HideGameOver();
    ShowGame();
    ClearPins();
    HideTarget();

    await new Promise(resolve => setTimeout(resolve, 3000));

    ShowTarget();
    randomizeButton();

    countFunc = setInterval(function() {
        timer+=1;
        timeDisplay.innerHTML = (timer/100).toFixed(2) + 's';
    }, 10);
    
}

function ShowTarget() {
    button.style.display = 'block';
}

function HideTarget() {
    button.style.display = 'none';
}

function ClearPins() {
    document.querySelectorAll('.pin').forEach(function(pin) {
        pin.remove();
    });
}

function CreatePin(x, y) {
    var newPin = document.createElement('div');
    newPin.classList.add('pin');
    newPin.style.left = x;
    newPin.style.top = y;
    newPin.style.transform = 'translate(50%, 50%)';
    document.querySelector('.pins').appendChild(newPin);
}

function HideMenu() {
    menu.style.display = 'none';
}

function ShowMenu() {
    menu.style.display = 'block';
}

function HideGame() {
    game.style.display = 'none';
}

function ShowGame() {
    game.style.display = 'block';
}

function HideGameOver() {
    gameOver.style.display = 'none';
}

function ShowGameOver() {
    gameOver.style.display = 'block';
}

function ReturnToMenu(){
    HideGameOver();
    HideGame();
    ShowMenu();
    ClearPins();
    timer = 0;
    timeDisplay.innerHTML = '0.00s';
    targetsHitDisplay.innerHTML = '0/30';
    counter = 0;
    firstTime = true;
    clearInterval(countFunc);
}