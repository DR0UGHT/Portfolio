let mousePos = { x: 0, y: 0 };
let paddle, ball, bricks = [], score, gameOver, gameStarted = false;
let moveDirection = { x: 0, y: 0 };
let pauseGame = false;
window.onload = function() {

    CreatePadel();
    CreateBall();
    CreateBricks();
    DebugBrick();
//    CreateScore();
//    CreateGameOver();

    let game = setInterval(update, 1000 / 60);
    let brickBreaker = setInterval(CheckCollisionBricks, 1000 / 240);
    window.addEventListener("mousemove", function(event) {
        mousePos = { x: event.clientX, y: event.clientY };
    });

    window.addEventListener("mousedown", function(event) {
        if(!gameStarted) {
            gameStarted = true;
            let angleRadians = RandomRadians(30, 150);
            moveDirection = { x: Math.cos(angleRadians), y: Math.sin(angleRadians) };
        }
    });
}

function update() {
    if(pauseGame) {
        return;
    }   


    MoveBall();
    MovePaddle();
    CheckCollision();
    console.log("update");
}

function MoveBall() {
    if(moveDirection.x == 0 && moveDirection.y == 0) {
        return;
    }

    let ballX = parseFloat(ball.style.left);
    let ballY = parseFloat(ball.style.bottom);

    ballX += moveDirection.x/2;
    ballY += moveDirection.y/2;

    ball.style.left = ballX + "vw";
    ball.style.bottom = ballY + "vh";
}

function CreatePadel() {
    paddle = document.createElement("div");
    paddle.id = "paddle";
    paddle.style.width = "20vw";
    paddle.style.height = "2vh";
    paddle.style.backgroundColor = "white";
    paddle.style.position = "absolute";
    paddle.style.bottom = "0";
    paddle.style.marginBottom = "2vh";
    document.body.appendChild(paddle);
}
function ResetBall() {
    ball.style.left = "50vw";
    ball.style.bottom = "10vh";
    moveDirection = { x: 0, y: 0 };
    gameStarted = false;
}

function CheckCollision() {
    let ballX = parseFloat(ball.style.left);
    let ballY = parseFloat(ball.style.bottom);
    let paddleX = parseFloat(paddle.style.left);
    let paddleY = parseFloat(paddle.style.marginBottom);

    if(ballY >= 98) {
        moveDirection.y *= -1;
        moveDirection.x += RandomRadians(-5, 5);
        moveDirection.y += RandomRadians(-5, 5);

        let length = Math.sqrt(moveDirection.x * moveDirection.x + moveDirection.y * moveDirection.y);
        moveDirection.x /= length;
        moveDirection.y /= length;
    }

    if(ballY <= -0.5) {
        alert("Game Over");
        ResetBall();
    }

    if(ballX <= 0 || ballX >= 99) {
        moveDirection.x *= -1;
        moveDirection.x += RandomRadians(-5, 5);
        moveDirection.y += RandomRadians(-5, 5);

        let length = Math.sqrt(moveDirection.x * moveDirection.x + moveDirection.y * moveDirection.y);
        moveDirection.x /= length;
        moveDirection.y /= length;
    }

    if(ballY <= paddleY + parseFloat(paddle.style.height) / 2){
        let paddleWidth = parseFloat(paddle.style.width);
        if(ballX >= paddleX - paddleWidth && ballX <= paddleX + paddleWidth) {
            moveDirection.y *= -1;
            moveDirection.x += RandomRadians(-5, 5);
            moveDirection.x += RandomRadians(-5, 5);
            moveDirection.y += RandomRadians(-5, 5);
    
            let length = Math.sqrt(moveDirection.x * moveDirection.x + moveDirection.y * moveDirection.y);
            moveDirection.x /= length;
            moveDirection.y /= length;
        }
    }
}

function DebugBrick() {
    //put a red dot on the 4 sides of the last brick
    let brick = bricks[bricks.length - 1];
    let brickWidth = parseFloat(brick.style.width);
    let brickXMin = parseFloat(brick.style.left) - brickWidth/2;
    let brickXMax = parseFloat(brick.style.left) + brickWidth/2;
    let brickYMin = 99.5 - parseFloat(brick.style.top) - parseFloat(brick.style.height)/2;
    let brickYMax = 99.5 - parseFloat(brick.style.top) + parseFloat(brick.style.height)/2;

    let dot = document.createElement("div");
    dot.style.width = ".25vw";
    dot.style.height = ".25vw";
    dot.style.backgroundColor = "red";
    dot.style.position = "absolute";
    dot.style.left = brickXMin + "vw";
    dot.style.bottom = brickYMin + "vh";
    dot.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(dot);

    dot = document.createElement("div");
    dot.style.width = ".25vw";
    dot.style.height = ".25vw";
    dot.style.backgroundColor = "red";
    dot.style.position = "absolute";
    dot.style.left = brickXMax + "vw";
    dot.style.bottom = brickYMin + "vh";
    dot.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(dot);

    dot = document.createElement("div");
    dot.style.width = ".25vw";
    dot.style.height = ".25vw";
    dot.style.backgroundColor = "red";
    dot.style.position = "absolute";
    dot.style.left = brickXMin + "vw";
    dot.style.bottom = brickYMax + "vh";
    dot.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(dot);

    dot = document.createElement("div");
    dot.style.width = ".25vw";
    dot.style.height = ".25vw";
    dot.style.backgroundColor = "red";
    dot.style.position = "absolute";
    dot.style.left = brickXMax + "vw";
    dot.style.bottom = brickYMax + "vh";
    dot.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(dot);

}

function CheckCollisionBricks() {
    let ballX = parseFloat(ball.style.left);
    let ballY = parseFloat(ball.style.bottom);
    let ballWidth = parseFloat(ball.style.width);
    let ballHeight = parseFloat(ball.style.height);

    for(let i = 0; i < bricks.length; i++) {
        let brick = bricks[i];
        let brickWidth = parseFloat(brick.style.width);
        let brickXMin = parseFloat(brick.style.left) - brickWidth/2;
        let brickXMax = parseFloat(brick.style.left) + brickWidth/2;
        let brickYMin = 99.5 - parseFloat(brick.style.top) - parseFloat(brick.style.height)/2;
        let brickYMax = 99.5 - parseFloat(brick.style.top) + parseFloat(brick.style.height)/2;

        if(ballX >= brickXMin && ballX <= brickXMax && ballY >= brickYMin && ballY <= brickYMax) {
            moveDirection.y *= -1;
            moveDirection.x *= -1;
    
            let length = Math.sqrt(moveDirection.x * moveDirection.x + moveDirection.y * moveDirection.y);
            moveDirection.x /= length;
            moveDirection.y /= length;

            brick.remove();
            bricks.splice(i, 1);
            i--;

        }
    }
}

function CreateBall() {
    ball = document.createElement("div");
    ball.id = "ball";
    ball.style.width = "1vw";
    ball.style.height = "1vw";
    ball.style.backgroundColor = "white";
    ball.style.position = "absolute";
    ball.style.bottom = "10vh";
    ball.style.left = "50vw";
    ball.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(ball);
}

function CreateBricks() {
    let brickWidth = 3;
    let brickHeight = 2;
    let brickMargin = 1;
    let rows = 15;
    let cols = 15;

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols - i; j++) {
            let brick = document.createElement("div");
            brick.style.width = brickWidth + "vw";
            brick.style.height = brickHeight + "vh";
            brick.style.backgroundColor = "white";
            brick.style.position = "absolute";
            brick.style.left = (50 - ((brickWidth + brickMargin)*cols/2)) + (i * 2) + (j * (brickWidth + brickMargin)) + "vw";
            brick.style.top =  i * (brickHeight + brickMargin) + "vh";
            brick.style.transform = "translate(-50%, -50%)";
            document.body.appendChild(brick);
            bricks.push(brick);
        }
    }
}

function MovePaddle() {
    let paddleX =  Clamp((mousePos.x / window.innerWidth) * 100, parseFloat(paddle.style.width)/2, 100 - parseFloat(paddle.style.width)/2) - parseFloat(paddle.style.width)/2;

    paddle.style.left = paddleX + "%";
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function RandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandomRadians(min, max) {
    return RandomRange(min, max) * Math.PI / 180;
}