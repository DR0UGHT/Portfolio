let canvas;
let ctx;

let playerScore = 0;
let computerScore = 0;
let playerTurn = true;
let gameOver = false;

let dotPositions = [];
let boxDots = [];
let fromTo = [];
let mouse = {startX: 0, startY: 0, endX: 0, endY: 0};
let mousedown = false;
let linesInBox = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]
window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth;
    canvas.height = canvas.width;
    ctx = canvas.getContext("2d", {alpha: false, antialias: true, willReadFrequently: false, storage: "persistent"});

    ClearCanvas();
    DrawDots();

    canvas.addEventListener("mousedown", function(event){
        if(!playerTurn) return;
        //convert X and Y to a percentage of the canvas width and height, canvas is in the middle of the screen
        let x = (event.clientX - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * 100;
        let y = (event.clientY - canvas.getBoundingClientRect().top) / canvas.getBoundingClientRect().height * 100;
        //round to the nearest dot, there are 5 dots in each row and column
        x = Math.round((x+10) / 20) * .2 - 0.1;
        y = Math.round((y+10) / 20) * .2 - 0.1;
        mouse = {startX: x, startY: y, endX: x, endY: y};

        mousedown = true;
    });

    window.addEventListener("mouseup", function(event){
        if(!playerTurn) return;
        mousedown = false;
        if(mouse.startX == 0 && mouse.startY == 0) return;
        if(mouse.startX == mouse.endX && mouse.startY == mouse.endY ||
           mouse.startX < 0.1 || mouse.startX > 0.9 || mouse.startY < 0.1 || mouse.startY > 0.9 ||
           mouse.endX < 0.1 || mouse.endX > 0.9 || mouse.endY < 0.1 || mouse.endY > 0.9 ||
           boxDots.some((dot) => {
                return dot.startX == mouse.startX && dot.startY == mouse.startY && dot.endX == mouse.endX && dot.endY == mouse.endY ||
                         dot.startX == mouse.endX && dot.startY == mouse.endY && dot.endX == mouse.startX && dot.endY == mouse.startY;
        }))
        {
            mouse = {startX: 0, startY: 0, endX: 0, endY: 0};
            ClearCanvas();
            DrawDots();
            DrawPreviousLines();
            return;
        }

        boxDots.push({startX: mouse.startX, startY: mouse.startY, endX: mouse.endX, endY: mouse.endY, color: "blue"});
        if(!CheckForNewBox()){
            // console.log("Computer's turn");
            playerTurn = false;
            ComputerTurn();
        }
        
        CheckForGameOver();
    });

    canvas.addEventListener("mousemove", function(event){
        if(!mousedown || !playerTurn) return;

        let x = (event.clientX - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * 100;
        let y = (event.clientY - canvas.getBoundingClientRect().top) / canvas.getBoundingClientRect().height * 100;
        //round to the nearest dot, there are 5 dots in each row and column
        x = Math.round((x+10) / 20) * .2 - 0.1;
        y = Math.round((y+10) / 20) * .2 - 0.1;

        if(mouse.endX == x && mouse.endY == y) return;
        if(mouse.startX == x && mouse.startY == y){
            mouse = {startX: x, startY: y, endX: x, endY: y};
            ClearCanvas();
            DrawDots();
            DrawPreviousLines();
            return;
        }
        if(mouse.startX != x && mouse.startY != y) return;
        if(Math.abs(mouse.startX - x) > .3 || Math.abs(mouse.startY - y) > .3) return;

        mouse = {startX: mouse.startX, startY: mouse.startY, endX: x, endY: y};

        ClearCanvas();
        DrawDots();
        DrawPreviousLines();
        DrawCurrentLine();
    });
}


function ClearCanvas(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//the dots are centered and there are 5 dots in each row and column
function DrawDots(){
    //sizes are in percent form
    let dotSize = 1;
    let dotSpacing = 20;
    ctx.fillStyle = "black";
    for(let x = 0; x < 5; x++){
        for(let y = 0; y < 5; y++){
            ctx.beginPath();
            ctx.arc((canvas.width * (x * dotSpacing + dotSpacing/2) / 100), (canvas.height * (y * dotSpacing + dotSpacing/2) / 100), (canvas.width * dotSize / 100), 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function DrawPreviousLines(){
    ctx.lineWidth = canvas.width / 100;

    for(let i = 0; i < boxDots.length; i++){
        ctx.strokeStyle = boxDots[i].color;
        ctx.beginPath();
        ctx.moveTo(boxDots[i].startX * canvas.width, boxDots[i].startY * canvas.height);
        ctx.lineTo(boxDots[i].endX * canvas.width, boxDots[i].endY * canvas.height);
        ctx.stroke();
    }
}

function DrawCurrentLine(){
    ctx.strokeStyle = "blue";
    ctx.lineWidth = canvas.width / 100;

    ctx.beginPath();
    ctx.moveTo(mouse.startX * canvas.width, mouse.startY * canvas.height);
    ctx.lineTo(mouse.endX * canvas.width, mouse.endY * canvas.height);
    ctx.stroke();
}

function CheckForNewBox(){
    let newBox = 0
    let oldBox = 0;
    let oldDotBoxes = JSON.parse(JSON.stringify(boxDots));
    oldDotBoxes.pop();

    console.log(boxDots);

    let linesX = 0;
    let linesY = 0;
    for(let x = 0.1; x <= 0.7; x+=0.2){
        linesY = 0;

        for(let y = 0.1; y <= 0.7; y+=0.2){
            let conditionsMetNew = 0;
            let conditionsMetOld = 0;
            let s = boxDots.some((dot) => {
                //if there is a line from 
                //x, y to x+0.2, y and 
                //x, y to x, y+0.2 and
                //x, y+0.2 to x+0.2, y+0.2 and
                //x+0.2, y to x+0.2, y+0.2
                let o1 = (Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - y) < 0.01) || (Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - y) < 0.01);
                let o2 = (Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01) || (Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01);
                let o3 = (Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01) || (Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01);
                let o4 = (Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01) || (Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01);
                if(o1 || o2 || o3 || o4){
                    conditionsMetNew++;
                }
            });
            
            let t = oldDotBoxes.some((dot) => {
                //if there is a line from 
                //x, y to x+0.2, y and 
                //x, y to x, y+0.2 and
                //x, y+0.2 to x+0.2, y+0.2 and
                //x+0.2, y to x+0.2, y+0.2
                let o1 = (Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - y) < 0.01) || (Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - y) < 0.01);
                let o2 = (Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01) || (Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01);
                let o3 = (Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01) || (Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01);
                let o4 = (Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01) || (Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01);
                if(o1 || o2 || o3 || o4){
                    conditionsMetOld++;
                }
            });

            linesInBox[linesY][linesX] = conditionsMetNew;

            if(conditionsMetNew == 4){
                newBox++;
            }

            if(conditionsMetOld == 4){
                oldBox++;
            }

            linesY++;
        }
        linesX++;
    }

    console.log(linesInBox);
    console.log("newBox: " + newBox);
    console.log("oldBox: " + oldBox);
    if(oldBox != newBox){
        if(playerTurn){
            playerScore += newBox - oldBox;
            document.getElementById("pScore").innerText = playerScore;
        }else{
            computerScore += newBox - oldBox;
            document.getElementById("cScore").innerText = computerScore;
        }
        console.log("new box");
        return true;
    }

    return false;
}


function CheckForGameOver(){
    if(boxDots.length == 40){
        gameOver = true;
        if(playerScore > computerScore){
            alert("Player wins!");
        }else if(playerScore < computerScore){
            alert("Computer wins!");
        }else{
            alert("Tie game!");
        }
    }
}

function ComputerTurn(){
    let bestMove = {x: 0, y: 0};
    let bestMoveValue = 0;
    let num3s = [];
    let num2s = [];
    let num1s = [];
    let num0s = [];
    for(let x = 0; x < 4; x++){
        for(let y = 0; y < 4; y++){
            if(linesInBox[y][x] == 3){
                num3s.push({x: x, y: y});
                if(bestMoveValue < 3) bestMoveValue = 3;

            }
        }
    }

    if(bestMoveValue == 2){
        let x = Math.floor(Math.random() * 4);
        let y = Math.floor(Math.random() * 4);
        while(linesInBox[y][x] == 4){
            x = Math.floor(Math.random() * 4);
            y = Math.floor(Math.random() * 4);
        }
        bestMove = {x: x, y: y};
    }

    MakeLineInSquareWhenEmpty(bestMove.x * 0.2 + 0.1, bestMove.y * 0.2 + 0.1);
    ClearCanvas();
    DrawDots();
    DrawPreviousLines();
    CheckForNewBox();
    CheckForGameOver();
    playerTurn = true;
}


function MakeLineInSquareWhenEmpty(x, y){
    console.log("x: " + x + " y: " + y);
    let topLineTaken = boxDots.some((dot) => {
        return Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - y) < 0.01 || Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - y) < 0.01;
    });

    let leftLineTaken = boxDots.some((dot) => {
        return Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01 || Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01;
    });

    let bottomLineTaken = boxDots.some((dot) => {
        return Math.abs(dot.startX - x) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01 || Math.abs(dot.endX - x) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01;
    });

    let rightLineTaken = boxDots.some((dot) => {
        return Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - y) < 0.01 && Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - 0.2 - y) < 0.01 || Math.abs(dot.endX - x - 0.2) < 0.01 && Math.abs(dot.endY - y) < 0.01 && Math.abs(dot.startX - x - 0.2) < 0.01 && Math.abs(dot.startY - 0.2 - y) < 0.01;
    });

    while(true){
        let rand = Math.floor(Math.random() * 4);
        if(rand == 0 && !topLineTaken){
            boxDots.push({startX: x, startY: y, endX: x + 0.2, endY: y, color: "red"});
            break;
        }else if (rand == 1 && !leftLineTaken){
            boxDots.push({startX: x, startY: y, endX: x, endY: y + 0.2, color: "red"});
            break;
        }else if (rand == 2 && !bottomLineTaken){
            boxDots.push({startX: x, startY: y + 0.2, endX: x + 0.2, endY: y + 0.2, color: "red"});
            break;
        }else if (rand == 3 && !rightLineTaken){
            boxDots.push({startX: x + 0.2, startY: y, endX: x + 0.2, endY: y + 0.2, color: "red"});
            break;
        }

        console.log("rand: " + rand);
    }
}
