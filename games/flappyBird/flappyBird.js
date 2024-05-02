var isPlaying = false;
var dying = false;
var bird = null;
var ground = null;
var clickTimer = 0.0;
var score = 0;
var gravity = -0.5;
var pipes = [];
window.onload = function() {
    bird = document.getElementById("bird");
    ground = document.getElementById("gameField");
    
    bird.style.top = "50%";
    let timeSincePipe = 0;
    setInterval(function() {
        if (isPlaying) {
            if(timeSincePipe++ > 100) {
                timeSincePipe = 0;
                spawnPipe();
            }
            checkPipeCollision();
            movePipes();

            rotDown();
            moveDown();
        }else if(dying) {
            rotDown();
            moveDown();
        }
    }, 1000/60);
    
    document.addEventListener('contextmenu', event => event.preventDefault());
}

window.onmousedown = function() {
    if (event.button !== 0 || bird == null || dying || document.getElementById("lose").style.display !== "none")  return;

    if (!isPlaying  && !dying){
        isPlaying = true;
        document.getElementById("start").style.display = "none";
    }

    clickTimer = 1.0;
    Flap();
}

function Flap() {
    bird.style.rotate = "-20deg";
    gravity = -1.2;
}

function rotDown() {
    if(clickTimer > 0.0) {;
        clickTimer -= .04;
        return;
    }

    let currRot = parseFloat(bird.style.rotate.replace("deg", ""));
    let newRot = Math.min(currRot + 5, 90);
    bird.style.rotate = newRot + "deg";
}

function moveDown() {
    gravity = Math.min(gravity + 0.07, 2);
    let currTop = parseFloat(bird.style.top.replace("%", "")) || 0;
    let newTop = currTop + gravity;

    bird.style.top = newTop + "%";

    if(newTop > 85) {
        isPlaying = false;
        if(dying) dying = false;
        bird.style.animationPlayState = "paused";
        ground.style.animationPlayState = "paused";

        document.getElementById("lose").style.display = "flex";
        document.getElementById("fScore").innerHTML = score;
        if(score > GetCookieByName("highScore") || GetCookieByName("highScore") == null){
            document.cookie = "highScore=" + score + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            document.getElementById("newHighScore").style.display = "flex";
        }else{
            document.getElementById("newHighScore").style.display = "none";
        }
        document.getElementById("hScore").innerHTML = GetCookieByName("highScore");
    }
}


function GetCookieByName(name) {
    let cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if(cookie[0].trim() == name) {
            return cookie[1];
        }
    }
    return null;
}
function spawnPipe(){
    let pipesDiv = document.getElementById("pipes");
    let UpPipe = document.createElement("div");
    let DownPipe = document.createElement("div");
    UpPipe.className = "pipeUp";
    DownPipe.className = "pipeDown";

    let pipeHeight = (Math.random() * 40);
    
    UpPipe.style.top = (-pipeHeight + 82) + "%";
    DownPipe.style.top = (0 - pipeHeight) + "%";
    UpPipe.style.left = "120%";
    DownPipe.style.left = "120%";
    
    pipesDiv.appendChild(UpPipe);
    pipesDiv.appendChild(DownPipe);

    pipes.push(UpPipe);
    pipes.push(DownPipe);
}

function movePipes() {  
    for(let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let currLeft = parseFloat(pipe.style.left.replace("%", "")) || 0;
        let newLeft = currLeft - 0.25;
        pipe.style.left = newLeft + "%";
        if(newLeft < -10) {
            //remove first 2 pipes
            pipes.shift();
            pipes.shift();
        }
    }
}


function checkPipeCollision(){
    for(let i = 0; i < pipes.length; i+=2) {
        let birdTop = parseFloat(bird.style.top.replace("%", "")) || 0;
        let pipeTop = parseFloat(pipes[i+1].style.top.replace("%", "")) + 60 || 0;
        let pipeBottom = parseFloat(pipes[i].style.top.replace("%", "")) - 4.5 || 0;
        let pipeInZone = parseFloat(pipes[i].style.left.replace("%", "")) < 51.5 && parseFloat(pipes[i].style.left.replace("%", "")) > 41.5;
        
        if(!pipeInZone){
            if(parseFloat(pipes[i].style.left.replace("%", "")) < 41.5 && pipes[i].style.right != "0%") {
                score++;
                document.getElementById("score").innerHTML = score;
                pipes[i].style.right = "0%";
            }
            continue;
        }
        
        if(birdTop > pipeTop && birdTop < pipeBottom) continue;

        console.log("Bird: " + birdTop + " PipeTop: " + pipeTop + " PipeBottom: " + pipeBottom);
        isPlaying = false;
        dying = true;
        ground.style.animationPlayState = "paused";
        if(gravity < 0) gravity = 0;
    }
}


function playAgain(){
    document.getElementById("lose").style.display = "none";
    document.getElementById("pipes").innerHTML = "";
    bird.style.top = "50%";
    bird.style.rotate = "0deg";
    score = 0;
    document.getElementById("score").innerHTML = score;
    isPlaying = false;
    dying = false;
    bird.style.animationPlayState = "running";
    ground.style.animationPlayState = "running";
    gravity = -0.5;
    pipes = [];
    document.getElementById("start").style.display = "flex";
}