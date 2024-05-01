let dino;
let isPlaying = false;

var upPressed = false, downPressed = false
var isJumping = false, isDucking = false;

var gameSpeed = .5;
var obstacles = [];
var minSpawnTime = 2500;
var maxSpawnTime = 750;
var timeSinceLastSpawn = 0;
var score = 0;
var dead = false
window.onload = function() {
    dino = document.getElementById('dino');

    setInterval(animateDino, 1000 / 30);
    setInterval(Game, 1000 / 60);
    if(!isPlaying) setInterval(() => {score += 1}, 100);
}

window.onkeydown = function(e) {
    //if any arrow key is pressed, start the game
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if(!isPlaying && !dead) isPlaying = true;
    }

    if (e.key === 'ArrowUp' && !isJumping) {
        upPressed = true;
        isJumping = true;
        jump();
    }else if (e.key === 'ArrowDown') {
        downPressed = true;
    }
}

function resetGame(){
    isPlaying = false;
    score = 0;
    timeSinceLastSpawn = 0;
    gameSpeed = .5;
    obstacles = [];
    while(document.getElementsByClassName('rock').length > 0){
        document.getElementsByClassName('rock')[0].remove();
    }
    while(document.getElementsByClassName('tree').length > 0){
        document.getElementsByClassName('tree')[0].remove();
    }
    while(document.getElementsByClassName('bird').length > 0){
        document.getElementsByClassName('bird')[0].remove();
    }
    dino.style.animation = '';
    dino.style.marginBottom = '4%';
    dead = false;
    document.getElementById('lose').style.display = 'none';
    document.getElementById('score').innerHTML = 'Score: ' + score;
}



window.onkeyup = function(e) {
    if (e.key === 'ArrowUp') {
        upPressed = false;
        keyHoldTime = 0;
    }else if (e.key === 'ArrowDown') {
        downPressed = false;
    }
}

function Game(){
    if(isPlaying){
        gameSpeed += 0.0001;
        document.getElementById('score').innerHTML = 'Score: ' + score;
        timeSinceLastSpawn += 1000 / 60;
        if((Math.random() >= 0.995 || timeSinceLastSpawn > minSpawnTime) && timeSinceLastSpawn > maxSpawnTime){
            timeSinceLastSpawn = 0;
            if(Math.random() >= 0.4){
                if(Math.random() >= 0.5){
                    SpawnRock();
                }else{
                    SpawnTree();
                }
            }else{
                SpawnBird();
            }
        }

        for(let i = 0; i < obstacles.length; i++){
            let num = parseFloat(obstacles[i].style.left.replace('%', '')) - gameSpeed;
            obstacles[i].style.left = num + '%';
            if(num < -100){
                obstacles[i].remove();
                obstacles.splice(i, 1);
            }

            let dinoHeight = parseFloat(dino.style.marginBottom.replace('%', ''));
            if(obstacles[i].classList.contains('tree') && num < 30 && num > 22){

                if(dinoHeight < 12){
                    console.log('game over');
                    isPlaying = false;
                    document.getElementById('lose').style.display = 'flex';
                    document.getElementById('finalScore').innerHTML = score;

                }
            }else if(obstacles[i].classList.contains('rock') && num < 28 && num > 23){
                if(dinoHeight < 7){
                    console.log('game over');
                    isPlaying = false;
                    document.getElementById('lose').style.display = 'flex';
                    document.getElementById('finalScore').innerHTML = score;

                }
            }else if(obstacles[i].classList.contains('bird') && num < 30 && num > 22){
                if(!downPressed && dinoHeight < 12){
                    console.log('game over');
                    isPlaying = false;
                    document.getElementById('lose').style.display = 'flex';
                    document.getElementById('finalScore').innerHTML = score;

                }
            }
        }
    }
}

function SpawnRock(){
    let rock = document.createElement('div');
    rock.classList.add('rock');
    rock.style.left = '120%';
    document.getElementById('gameField').appendChild(rock);
    obstacles.push(rock);
}

function SpawnTree(){
    let tree = document.createElement('div');
    tree.classList.add('tree');
    tree.style.left = '120%';
    document.getElementById('gameField').appendChild(tree);
    obstacles.push(tree);
}

function SpawnBird(){
    let bird = document.createElement('div');
    bird.classList.add('bird');
    bird.style.left = '120%';
    bird.style.animation = 'fly 1s infinite';
    document.getElementById('gameField').appendChild(bird);
    obstacles.push(bird);
}

async function jump() {
    //move dino up and down in a cubic curve
    let startHeihgt = 4;
    let timeS = 0;
    while (timeS < 0.5){
        startHeihgt += cubicBezier(timeS, 0, 1, 2, -0.1);
        timeS += .02;
        await new Promise(r => setTimeout(r, 13));
        dino.style.marginBottom = startHeihgt + '%';
    }

    if(upPressed){
        while (timeS < 1){
            startHeihgt += cubicBezier(timeS, 0, 1, 1, -0.1);
            timeS += .02;
            await new Promise(r => setTimeout(r, 13));
            dino.style.marginBottom = startHeihgt + '%';
        }

        while (timeS > 0){
            startHeihgt -= cubicBezier(timeS, 0, 1, 1, -0.1);
            timeS -= .0175;
            await new Promise(r => setTimeout(r, 13));
            dino.style.marginBottom = startHeihgt + '%';
        }
    }else{
        while (timeS > 0){
            startHeihgt -= cubicBezier(timeS, 0, 1, 1.7, -0.1);
            timeS -= .02;
            await new Promise(r => setTimeout(r, 13));
            dino.style.marginBottom = startHeihgt + '%';
        }
    }
    dino.style.animation = 'run 0.5s infinite';
    dino.style.marginBottom = '4%';
    isJumping = false;
}


function cubicBezier(t, p0, p1, p2, p3) {
    return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
}
function animateDino() {
    if (isPlaying) {
        if(isJumping){
            console.log('jumping');
            dino.style.animation = '';
        }
        else if(!upPressed && !downPressed) dino.style.animation = 'run 0.5s infinite';
        else if (downPressed) dino.style.animation = 'duck 0.5s infinite';
    }else{
        dino.style.animation = '';
        for(let i = 0; i < obstacles.length; i++){
            if(obstacles[i].classList.contains('bird')){
                obstacles[i].style.animation = '';
            }
        }
    }
}