//ball vars
var playing = false;
var ballMove = { x: 0, y: 0 };
var dir = -1;
var ballSpeed = 0;

//paddle vars
let pongBallSizes = { width: 1, height: 1, posX: 50.25, posY: 50};
let pongPaddleSizes = { width: 1, height: 25, posX: 0, posY: 50};

let lastPaddleMoveSpeed = 0;
let lastPaddlePos = 0;

//Scores
var playerScore = 0;
var cpuScore = 0;

//bool to hold off on restarting the game
let waitingForRestart = false;

window.onload = function() {
    //bind mouse move to player paddle up and down movement
    window.onmousemove = function(e) { MovePaddle(e); };
    window.onclick = function() { 
        if(waitingForRestart) RestartGame();
        else StartGame(); 
    }

    CreateBall();
    CreatePlayerPadle();
    CreateCPUPaddle();
}


/**
 * RestartGame resets the game to the starting state
 * @returns nothing
 */
function RestartGame() {
    var ball = document.getElementById("pongBall");
    ball.style.left = "50.25vw";
    ball.style.top = "50vh";

    ballMove.x = 0.5;
    ballMove.y = Math.random() - 0.5;

    ballSpeed = 0;

    playing = false;
    waitingForRestart = false;
    document.getElementById("winner").innerHTML = "";
    
    var playerPaddle = document.getElementById("pongPaddlePlayer");
    playerPaddle.style.height = "25vh";
}


/**
 * CreateBall creates the ball div and appends it to the pongContent div
 * @returns nothing
*/
function CreateBall() {
    var ball = document.createElement("div");
    ball.id = "pongBall";
    ball.style.position = "absolute";
    ball.style.transform = "translate(-50%, -50%)";
    ball.style.backgroundColor = "white";

    ball.style.top = pongBallSizes.posY + "vh";
    ball.style.left = pongBallSizes.posX + "vw";
    ball.style.width = pongBallSizes.width + "vw";
    ball.style.height = pongBallSizes.height + "vw";

    document.getElementsByClassName("pongContent")[0].appendChild(ball);
}

/**
 * CreatePlayerPadle creates the player paddle div and appends it to the pongContent div
 * @returns nothing
*/
function CreatePlayerPadle() {
    var paddle = document.createElement("div");
    paddle.id = "pongPaddlePlayer";

    paddle.style.position = "absolute";
    paddle.style.transform = "translate(0, -50%)";
    paddle.style.backgroundColor = "white";

    paddle.style.top = pongPaddleSizes.posY + "vh";
    paddle.style.left = pongPaddleSizes.posX + "vw";
    paddle.style.width = pongPaddleSizes.width + "vw";
    paddle.style.height = pongPaddleSizes.height + "vh";

    document.getElementsByClassName("pongContent")[0].appendChild(paddle);
}

/**
 * CreateCPUPaddle creates the cpu paddle div and appends it to the pongContent div
 * @returns nothing
*/
function CreateCPUPaddle() {
    var paddle = document.createElement("div");
    paddle.id = "pongPaddleCPU";

    paddle.style.position = "absolute";
    paddle.style.transform = "translate(-100%, -50%)";
    paddle.style.backgroundColor = "white";

    paddle.style.top = pongPaddleSizes.posY + "vh";
    paddle.style.left = 100 + "vw";
    paddle.style.width = pongPaddleSizes.width + "vw";
    paddle.style.height = pongPaddleSizes.height + "vh";

    document.getElementsByClassName("pongContent")[0].appendChild(paddle);
}

/**
 * MovePaddle moves the player paddle up and down based on the mouse position
 * @param {MouseEvent} e - the mouse event
 * @returns nothing
*/
function MovePaddle(e) {
    var y = e.clientY;
    var paddle = document.getElementById("pongPaddlePlayer")

    y = y / window.innerHeight * 100;
    if(!paddle.style.height) paddle.style.height = "25vh";

    y = Math.min(100 - parseFloat(paddle.style.height)/ 2, Math.max(parseFloat(paddle.style.height)/ 2, y));

    paddle.style.top = y + "%";

    lastPaddleMoveSpeed = (lastPaddlePos - y) * 100;
    lastPaddlePos = y;
}

/**
 * StartGame starts the pong game
 * @returns nothing
*/
function StartGame() {
    if (playing) return;

    playing = true;
    //random x and y direction for the ball that moves it to the left
    ballMove.x = 0.5;
    ballMove.y = Math.random() - 0.5;
    //do the game loop once every 60th of a second, until playing is set to false
    var loop = setInterval(function(){
        if(playing) GameLoop();
        else{
            //kill the interval
            clearInterval(loop);
        }
    }, 1000 / 60);
}

/**
 * GameLoop is the main game loop for the pong game
 * @returns nothing
*/
function GameLoop() {
    console.log("GameLoop");
    //move the ball
    MoveBall();

    //move the cpu paddle
    MoveCPUPaddle();

    //check for collisions
    CheckCollisions();

    //check for win
    CheckForWin();
}

/**
 * MoveBall moves the ball div based on the ballMove object
 * @returns nothing
*/
function MoveBall() {
    var ball = document.getElementById("pongBall");
    var ballX = ball.style.left ? parseFloat(ball.style.left) : 50.25;
    var ballY = ball.style.top ? parseFloat(ball.style.top) : 50.25;

    ballX += (ballMove.x + ballSpeed) * dir;
    ballY += ballMove.y;

    ball.style.left = ballX + "vw";
    ball.style.top = ballY + "vh";

    ballSpeed += 0.00005;
}

/**
 * MoveCPUPaddle moves the cpu paddle based on the ball position
 * @returns nothing
*/
function MoveCPUPaddle() {
    var difficulty = 1.0; // Adjust the difficulty level here (0.1 - 1.0)
    var ball = document.getElementById("pongBall");
    var ballY = ball.style.top ? parseFloat(ball.style.top) : 50.25;

    var paddle = document.getElementById("pongPaddleCPU");
    var paddleY = paddle.style.top ? parseFloat(paddle.style.top) : 50.0;
    var paddleHeight = paddle.style.height ? parseFloat(paddle.style.height) : 25.0;

    if(ballY < paddleY - paddleHeight / 2.0) {
        paddleY -= difficulty;
    }else if(ballY > paddleY + paddleHeight / 2.0) {
        paddleY += difficulty;
    }

    paddle.style.top = paddleY + "vh";
}

/**
 * CheckCollisions checks for collisions between the ball and the paddles or the top and bottom of the screen
 * @returns nothing
*/
function CheckCollisions() {
    var ball = document.getElementById("pongBall");
    var ballX = ball.style.left ? parseFloat(ball.style.left) : pongBallSizes.posX;
    var ballY = ball.style.top ? parseFloat(ball.style.top) : pongBallSizes.posY;
    var ballHeight = ball.style.height ? parseFloat(ball.style.height) : 1;

    var playerPaddle = document.getElementById("pongPaddlePlayer");
    var playerPaddleYMax = (playerPaddle.style.top ? parseFloat(playerPaddle.style.top) : pongPaddleSizes.posY) + (playerPaddle.style.height ? parseFloat(playerPaddle.style.height) : pongPaddleSizes.height) / 2;
    var playerPaddleYMin = (playerPaddle.style.top ? parseFloat(playerPaddle.style.top) : pongPaddleSizes.posY) - (playerPaddle.style.height ? parseFloat(playerPaddle.style.height) : pongPaddleSizes.height) / 2;
    var paddleWidth = playerPaddle.style.width ? parseFloat(playerPaddle.style.width) : pongPaddleSizes.width;

    var cpuPaddle = document.getElementById("pongPaddleCPU");
    var cpuPaddleYMax = (cpuPaddle.style.top ? parseFloat(cpuPaddle.style.top) : pongPaddleSizes.posY) + (cpuPaddle.style.height ? parseFloat(cpuPaddle.style.height) : pongPaddleSizes.height) / 2;
    var cpuPaddleYMin = (cpuPaddle.style.top ? parseFloat(cpuPaddle.style.top) : pongPaddleSizes.posY) - (cpuPaddle.style.height ? parseFloat(cpuPaddle.style.height) : pongPaddleSizes.height) / 2;


    if (ballX < paddleWidth*2 && ballY > playerPaddleYMin && ballY < playerPaddleYMax) {
        dir *= -1;

        if(lastPaddleMoveSpeed < 0 && ballMove.y < 0) ballMove.y *= -1;
        else if(lastPaddleMoveSpeed > 0 && ballMove.y > 0) ballMove.y *= -1;

        ballMove.y += Math.random() - 0.5;
    }else if (ballX > 100 - paddleWidth*2 && ballY > cpuPaddleYMin && ballY < cpuPaddleYMax) {
        dir *= -1;
        ballMove.y += Math.random() - 0.5;
    }

    if(ballY < ballHeight/2 || ballY > 100 - ballHeight/2) {
        ballMove.y *= -1;
    }

    playerPaddle.style.height = (playerPaddle.style.height ? parseFloat(playerPaddle.style.height) : pongPaddleSizes.height) - 0.002 + "vh";
}

/**
 * CheckForWin checks if the ball has gone past the player or cpu paddles
 * @returns nothing
*/
function CheckForWin() {
    var ball = document.getElementById("pongBall");
    var ballX = ball.style.left ? parseFloat(ball.style.left) : pongBallSizes.posX;
    var ballY = ball.style.top ? parseFloat(ball.style.top) : pongBallSizes.posY;

    var playerPaddle = document.getElementById("pongPaddlePlayer");
    var paddleWidth = pongPaddleSizes.width ? parseFloat(playerPaddle.style.width) : pongPaddleSizes.width;

    if(ballX < (paddleWidth/2) || ballX > 100 - (paddleWidth/2)) {
        playing = false;
        waitingForRestart = true;
        document.getElementById("winner").innerHTML = "Winner: " + (ballX > 50 ? "Player" : "CPU") + "!";

        if(dir > 0) playerScore++;
        else cpuScore++;

        document.getElementsByClassName("score2")[0].innerHTML = playerScore + " | " + cpuScore;


    }
}