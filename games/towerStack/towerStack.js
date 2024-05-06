var towerStack = [];
var tower;
var moveSpeed = .5;
var stackSize = 1;
var isPlaying = true;
var towerPiece, lastTowerPiece;
let moveDirection = 1;
var leftValue = 0;
var centerValue = -1;
var maxSize = 50;
//32 points of all colors, on the paler side
var allColors = ["#ff8080", "#ff9999", "#ff99cc", "#ff99ff", "#ffcc99", "#ffcccc", "#ffccff", "#ffff99", "#ffffcc", "#ffffff", "#cc8080", "#cc9999", "#cc99cc", "#cc99ff", "#cccc99", "#cccccc", "#ccccff", "#ccff99", "#ccffcc", "#ccffff", "#998080", "#999999", "#9999cc", "#9999ff", "#99cc99", "#99cccc", "#99ccff", "#99ff99", "#99ffcc", "#99ffff"];
window.onload = function() {
    tower = document.getElementById("towerStack");
    towerPiece = tower.lastElementChild;
    towerPiece.style.backgroundColor = allColors[Math.floor(Math.random() * allColors.length)];
    setInterval(Game, 1000 / 60);
    
}

//ensure its left click
window.onmousedown = function(e) {
    if(e.button !== 0) return;
    
    CheckForClick();
}
//disable right click
window.oncontextmenu = function() {
    return false;
}

function Game() {
    if(isPlaying) {
        MoveTowerPiece();
    }
}


function ResetGame() {
    stackSize = 1;
    moveSpeed = 0.5;
    maxSize = 50;
    isPlaying = true;
    leftValue = 0;
    document.getElementById("endScreen").style.display = "none";
    tower.innerHTML = "";
    towerPiece = document.createElement("div");
    towerPiece.style.width = maxSize + "%";
    towerPiece.style.left = "0%";
    towerPiece.style.bottom = "0%";
    towerPiece.style.backgroundColor = allColors[Math.floor(Math.random() * allColors.length)];
    towerPiece.setAttribute("class", "towerBrick");
    tower.appendChild(towerPiece);
    lastTowerPiece = towerPiece;
    document.getElementById("tsScore").innerText = "Score: 0";
}

function MoveTowerPiece() {
    if(leftValue <= 0)       moveDirection = 1;
    else if(leftValue >= 50 + (50-maxSize)) moveDirection = -1;
    leftValue += (moveSpeed * moveDirection);

    towerPiece.style.left = leftValue + "%";
}

async function CheckForClick() {
    if(!isPlaying) return;

    isPlaying = false;
    let newBlock = towerPiece.cloneNode(true);

    newBlock.style.left = leftValue + "%";
    newBlock.style.bottom = (stackSize * 5) + "%";

    if(stackSize > 1){
        var lastTowerLeft = parseFloat(towerPiece.style.left.replace("%", "")) || 0;
        var secondLastTowerLeft = parseFloat(lastTowerPiece.style.left.replace("%", "")) || 0;
        if(await ShowCuttoff(lastTowerLeft, secondLastTowerLeft) == "lose") return;
    }else{
        isPlaying = true;
    }

    newBlock.style.width = maxSize + "%";
    newBlock.style.backgroundColor = allColors[Math.floor(Math.random() * allColors.length)];
    tower.appendChild(newBlock);
    lastTowerPiece = towerPiece;
    towerPiece = newBlock;

    document.getElementById("tsScore").innerText = "Score: " + stackSize;
    stackSize++;
}

async function ShowCuttoff(firstBlock, secondBlock) {
    let distanceFromLast = maxSize - Math.abs(firstBlock - secondBlock);

    if(distanceFromLast <= 0) {
        Lose();
        return "lose"
    }
    towerPiece.style.width = distanceFromLast + "%";

    let newBlock = towerPiece.cloneNode(true);
    newBlock.style.width = (maxSize - distanceFromLast) + "%";
    //light red
    newBlock.style.backgroundColor = "#ff8080";

    if(secondBlock > firstBlock) {
        let lastLeft = parseFloat(lastTowerPiece.style.left.replace("%", ""));
        towerPiece.style.left = (lastLeft) + "%";
        
    }else{
        let currentLeft = parseFloat(towerPiece.style.left.replace("%", ""));
        towerPiece.style.right = (currentLeft - distanceFromLast) + "%";
        newBlock.style.left = (newBlock.style.left.replace("%", "") - (maxSize - distanceFromLast) + maxSize) + "%";
    }

    tower.appendChild(newBlock);

    await new Promise(r => setTimeout(r, 500));
    let startHeight = parseFloat(newBlock.style.bottom.replace("%", ""));
    let t = 0.0;
    let towerStartHeight = parseFloat(tower.style.top);
    console.log(towerStartHeight);
    let towerEndHeight = towerStartHeight + 5;
    while(t < 1.0) {
        if(stackSize >= 10){
            console.log(lerp(towerStartHeight, towerEndHeight, t));
            tower.style.top = lerp(towerStartHeight, towerEndHeight, t) + "%";
        }
        t += 0.02;
        newBlock.style.bottom = lerp(startHeight, -5.5, t) + "%";
        await new Promise(r => setTimeout(r, 10));
    }
    await new Promise(r => setTimeout(r, 350));
    moveSpeed += 0.075;
    isPlaying = true;
    maxSize = distanceFromLast
    leftValue = parseFloat(newBlock.style.left.replace("%", ""));
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}

async function Lose(){
    stackSize--;
    towerPiece.style.backgroundColor = "#ff0000";
    await new Promise(r => setTimeout(r, 1500));
    let t = 0.0;
    let startHeight = parseFloat(towerPiece.style.bottom.replace("%", ""));
    while(t < 1.0) {
        t += 0.006;
        towerPiece.style.bottom = lerp(startHeight, -5.5, t) + "%";
        await new Promise(r => setTimeout(r, 10));
    }

    if(stackSize > GetCookie("endBest")) {
        console.log("new best");
        document.cookie = "endBest=" + stackSize + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
        document.getElementById("endBest").innerText = "Best Score: " + stackSize;
        document.getElementById("newBest").style.display = "flex";
    }else if(document.getElementById("endBest").innerText == "Best Score: 0"){
        console.log("new best first time");
        document.getElementById("newBest").style.display = "none";
        document.getElementById("endBest").innerText = "Best Score: " + GetCookie("endBest");
    }else {
        console.log("no new best");
        document.getElementById("newBest").style.display = "none";
    }
    await new Promise(r => setTimeout(r, 350));
    document.getElementById("endScreen").style.display = "flex";
    document.getElementById("endScore").innerText = "Score: " + stackSize;
}

function GetCookie(name) {
    let cookie = document.cookie;
    let cookieArray = cookie.split(";");
    for(let i = 0; i < cookieArray.length; i++) {
        let cookiePair = cookieArray[i].split("=");
        if(name == cookiePair[0].trim()) {
            return cookiePair[1];
        }
    }
    return null;
}