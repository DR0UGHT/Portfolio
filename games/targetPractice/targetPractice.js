var button;
var firstTime = true;
var counter = 0;
window.onload = function() {
    button = document.querySelector('.targetPracticeButton');
    button.addEventListener('click', function() {
        if(counter == 29){
            document.querySelector('.game').style.display = 'none';
            document.querySelector('.gameOver').style.display = 'block';
            var newPin = document.createElement('div');
            newPin.classList.add('pin');
            newPin.style.left = button.style.left;
            newPin.style.top = button.style.top;
            newPin.style.transform = 'translate(50%, 50%)';
            newPin.style.zIndex = '100';
            document.querySelector('.pins').appendChild(newPin);
            document.querySelector('.pins').appendChild(document.querySelector('.targetPracticeButton'));
            
        }else{
            counter++;
            document.querySelector('.targetsHit').innerHTML = counter + '/30';
            randomizeButton();
        }
    });
    randomizeButton();
};


function randomizeButton() {
    if(!firstTime) {
        var newPin = document.createElement('div');
        newPin.classList.add('pin');
        newPin.style.left = button.style.left;
        newPin.style.top = button.style.top;
        newPin.style.transform = 'translate(50%, 50%)';
        document.querySelector('.pins').appendChild(newPin);
    }
    firstTime = false;
    button.style.left = RandomRange(3, 97) + '%';
    button.style.top =  RandomRange(3, 97) + '%';
}

function RandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame() {
    document.getElementsByClassName("menu")[0].style.display = "none";
    document.getElementsByClassName("game")[0].style.display = "block";
}