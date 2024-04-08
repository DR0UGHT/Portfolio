var snake1 = {
    bodyPos: [],
    htmlElement: [],
    needNewBody: false,
    lastFood: [0, 0],
};
var snake2 = {
    bodyPos: [],
    htmlElement: [],
    needNewBody: false,
    lastFood: [0, 0],
};

const snakes = [snake1, snake2];

var currentDirection = [0, 0];
var died = false;
var food1 = {
    x: 0,
    y: 0,
    htmlElement: null
}
var food2 = {
    x: 0,
    y: 0,
    htmlElement: null
}

var leftScore = 0;
var rightScore = 0;

window.onload = function() {
    newSnake = document.createElement("div");
    newSnake.id = "snake1";
    newSnake.style.position = "absolute";
    newSnake.style.width = "1vw";
    newSnake.style.height = "1vw";
    newSnake.style.backgroundColor = "black";
    newSnake.style.top = "50vh";
    newSnake.style.left = "25vw";
    newSnake.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(newSnake);
    snake1.bodyPos.push([25, 50]);
    snake1.htmlElement.push(newSnake);

    newSnake = document.createElement("div");
    newSnake.id = "snake2";
    newSnake.style.position = "absolute";
    newSnake.style.width = "1vw";
    newSnake.style.height = "1vw";
    newSnake.style.backgroundColor = "black";
    newSnake.style.top = "50vh";
    newSnake.style.left = "75vw";
    newSnake.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(newSnake);    
    snake2.bodyPos.push([75, 50]);
    snake2.htmlElement.push(newSnake);

    food1.htmlElement = document.createElement("div");
    food1.htmlElement.style.position = "absolute";
    food1.htmlElement.style.width = "1vw";
    food1.htmlElement.style.height = "1vw";
    food1.htmlElement.style.backgroundColor = "red";
    food1.htmlElement.style.top = "-1vh";
    food1.htmlElement.style.left = "-1vw";
    food1.htmlElement.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(food1.htmlElement);

    food2.htmlElement = document.createElement("div");
    food2.htmlElement.style.position = "absolute";
    food2.htmlElement.style.width = "1vw";
    food2.htmlElement.style.height = "1vw";
    food2.htmlElement.style.backgroundColor = "blue";
    food2.htmlElement.style.top = "-1vh";
    food2.htmlElement.style.left = "-1vw";
    food2.htmlElement.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(food2.htmlElement);
    
    MoveFood(1);
    MoveFood(2);

    document.addEventListener("keydown", changeDirection);
    setInterval(CheckLeaveBounds, 100);
    setInterval(CheckHitOwnBody, 100);

    setInterval(MoveSnake, 100);
    setInterval(CheckAteFood, 100);

    DropBomb();
}

function ShowGameOver() {
    document.getElementById("loseScreen").style.display = "block";
    document.getElementsByClassName("leftScore")[0].innerHTML = "Left Score : " + leftScore;
    document.getElementsByClassName("rightScore")[0].innerHTML = "Right Score : " + rightScore;
    document.getElementsByClassName("totalScore")[0].innerHTML = "Total Score : " + (leftScore + rightScore);

}

function HideGameOver() {
    document.getElementById("loseScreen").style.display = "none";
}

function ResetGame() {
    //remove all but first snake
    snake1.bodyPos = [];
    snake1.bodyPos.push([25, 50]);
    snake1.htmlElement = [snake1.htmlElement[0]];
    snake1.htmlElement[0].style.left = "25vw";
    snake1.htmlElement[0].style.top = "50vh";
    snake1.needNewBody = false;
    snake1.lastFood = [0, 0];

    snake2.bodyPos = [];
    snake2.bodyPos.push([75, 50]);
    snake2.htmlElement = [snake2.htmlElement[0]];
    snake2.htmlElement[0].style.left = "75vw";
    snake2.htmlElement[0].style.top = "50vh";
    snake2.needNewBody = false;
    snake2.lastFood = [0, 0];

    MoveFood(1);
    MoveFood(2);
    currentDirection = [0, 0];
    died = false;
    HideGameOver();
}
function MoveFood(food) {
    if(food == 1) {
        food1.x = Math.floor(Math.random() * 48 + 1);
        food1.y = Math.floor(Math.random() * 98 + 1);
        food1.htmlElement.style.left = food1.x + "vw";
        food1.htmlElement.style.top = food1.y + "vh";
    }else{
        food2.x = Math.floor(Math.random() * 48 + 51);
        food2.y = Math.floor(Math.random() * 98 + 1);
        food2.htmlElement.style.left = food2.x + "vw";
        food2.htmlElement.style.top = food2.y + "vh";
    }
}

function CheckNeedNewBody() {
    if(snake1.needNewBody) {
        AddBody(1, snake1.lastFood[0], snake1.lastFood[1]);
    }
    if(snake2.needNewBody) {
        AddBody(2, snake2.lastFood[0], snake2.lastFood[1]);
    }
}
function changeDirection(e) {
    switch(e.key.toUpperCase()) {
        case "W":
            currentDirection = [0, -1];
            break;
        case "A":
            currentDirection = [-1, 0];
            break;
        case "S":
            currentDirection = [0, 1];
            break;
        case "D":
            currentDirection = [1, 0];
            break;
    }
}

function MoveSnake() {
    if(currentDirection[0] == 0 && currentDirection[1] == 0 || died) return;
    snakes.forEach(snake => {
        for(var i = snake.bodyPos.length - 1; i > 0; i--) {
            snake.bodyPos[i][0] = snake.bodyPos[i - 1][0];
            snake.bodyPos[i][1] = snake.bodyPos[i - 1][1];
            snake.htmlElement[i].style.left = snake.bodyPos[i][0] + "vw";
            snake.htmlElement[i].style.top = snake.bodyPos[i][1] + "vh";        
        }
        snake.bodyPos[0][0] += currentDirection[0] * (snake == snake1 ? 1 : -1);
        snake.bodyPos[0][1] += currentDirection[1] * (snake == snake1 ? 1 : -1);
        snake.htmlElement[0].style.left = snake.bodyPos[0][0] + "vw";
        snake.htmlElement[0].style.top = snake.bodyPos[0][1] + "vh";            
    });
}

function CheckLeaveBounds() {
    if(snake1.bodyPos[0][0] <= 0 || snake1.bodyPos[0][0] >= 50 || snake1.bodyPos[0][1] <= 0 || snake1.bodyPos[0][1] >= 100) {
        died = true;
        ShowGameOver();
    }
    if(snake2.bodyPos[0][0] <= 50 || snake2.bodyPos[0][0] >= 100 || snake2.bodyPos[0][1] <= 0 || snake2.bodyPos[0][1] >= 100) {
        died = true;
        ShowGameOver();
    }
}

function CheckAteFood() {
    CheckNeedNewBody();
    if(snake1.bodyPos[0][0] == food1.x && snake1.bodyPos[0][1] == food1.y) {
        snake1.needNewBody = true;
        snake1.lastFood = [snake1.bodyPos[snake1.bodyPos.length - 1][0], snake1.bodyPos[snake1.bodyPos.length - 1][1]];
        MoveFood(1);
        leftScore++;
    }
    if(snake2.bodyPos[0][0] == food2.x && snake2.bodyPos[0][1] == food2.y) {
        snake2.needNewBody = true;
        snake2.lastFood = [snake2.bodyPos[snake2.bodyPos.length - 1][0], snake2.bodyPos[snake2.bodyPos.length - 1][1]];
        MoveFood(2);
        rightScore++;
    }
}

function AddBody(snake, x, y){
    var newBody = document.createElement("div");
    newBody.style.position = "absolute";
    newBody.style.width = "1vw";
    newBody.style.height = "1vw";
    newBody.style.top = "-10vh";
    newBody.style.backgroundColor = "black";
    newBody.style.transform = "translate(-50%, -50%)";

    if(snake == 1){
        snake1.bodyPos.push([x, y]);
        snake1.htmlElement.push(newBody);
        snake1.needNewBody = false;
    }else{       
        snake2.bodyPos.push([x, y]);
        snake2.htmlElement.push(newBody);
        snake2.needNewBody = false;
    }

    document.body.appendChild(newBody);
}


function CheckHitOwnBody() {
    snakes.forEach(snake => {
        for(var i = 1; i < snake.bodyPos.length; i++) {
            if(snake.bodyPos[0][0] == snake.bodyPos[i][0] && snake.bodyPos[0][1] == snake.bodyPos[i][1]) {
                died = true;
                ShowGameOver();
            }
        }
    });
}

function OpenCloseControls(){
    var controls = document.getElementsByClassName("Controls")[0];
    var close = controls.style.left ? (parseInt(controls.style.left) == 0) : (true);
    var currPos = close ? 0 : -14;       
    var interval = setInterval(() => {
        console.log(currPos + " " + close);
        if(close){
            controls.style.left = currPos-- + "%";
            if(currPos < -14) clearInterval(interval);
        }else{
            controls.style.left = currPos++ + "%";
            if(currPos > 0) clearInterval(interval);
        }
    }, 20);
}

function DropBomb(){
    let bombInterval = setInterval(() => {
        if(RandomRange(0, 100) < 50 && !died) {
            var x = Math.floor(Math.random() * 100);
            var y = Math.floor(Math.random() * 100);
            var bomb = document.createElement("div");
            bomb.style.position = "absolute";
            bomb.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
            bomb.style.top = y + "vh";
            bomb.style.left = x + "vw";
            bomb.style.zIndex = 20;
            bomb.style.transform = "translate(-50%, -50%)";
            document.body.appendChild(bomb);

            var blinkTimes = 6;
            var bombSize = 2;
            let blink = setInterval(() => {
                if(died){
                    bomb.remove();
                    clearInterval(blink);
                }
                
                if(blinkTimes > 0){
                    bomb.style.width = bombSize + "vw";
                    bomb.style.height = bombSize + "vw";
                    bombSize += 2;
                    bomb.style.display = bomb.style.display == "none" ? "block" : "none";
                } else if (blinkTimes <= -14){
                    clearInterval(blink);
                    bomb.remove();
                } else if (blinkTimes <= -4){
                    bomb.style.backgroundColor = "rgba(255, 0, 0, 1)";
                } else if (blinkTimes <= 0){
                    bomb.style.display = "block";
                }
                blinkTimes--;
            }, 500);
        }
    }, 5000);

}

function RandomRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}