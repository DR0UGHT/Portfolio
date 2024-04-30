var gameGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

var cellOdds = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    4096: '#3c3a32',
    8192: '#3c3a32',
    16384: '#3c3a32',
    32768: '#3c3a32',
    65536: '#3c3a32',
    131072: '#3c3a32',
    262144: '#3c3a32',
    524288: '#3c3a32',
    1048576: '#3c3a32',
};

var canMove = true;

window.onload = function(){
    //clear all cookies
    let currentGame = GetCookieByName("currentGame");
    let highscore = GetCookieByName("highscore");

    if(currentGame != null){
        gameGrid = JSON.parse(currentGame);
        SetupGrid();
        UpdateScore();
        console.log("Loaded game");
    }else{
        PlaceFirstTiles();
        console.log("Placed first tiles");
    }

    if(highscore != null){
        document.getElementById("best-score-number").innerHTML = highscore;
    }

}


window.onkeydown = function(e){
    if(!canMove) return;
    canMove = false;

    switch(e.key){
        case "ArrowUp":
            MoveUp();
            break;
        case "ArrowDown":
            MoveDown();
            break;
        case "ArrowLeft":
            MoveLeft();
            break;
        case "ArrowRight":
            MoveRight();
            break;
    }
}

function SetupGrid(){
    for(let y = 0; y < 4; y++){
        for(let x = 0; x < 4; x++){
            if(gameGrid[y][x] != 0){
                let numDiv = document.createElement("div");
                numDiv.className = "gameCell";
                numDiv.innerHTML = gameGrid[y][x];
                numDiv.style.left = (x * 25.75) + "%";
                numDiv.style.top = (y * 25.75) + "%";
                numDiv.style.backgroundColor = cellOdds[gameGrid[y][x]];
                numDiv.setAttribute("id", y * 4 + x);
                document.getElementById("gameGrid").appendChild(numDiv);
            }
        }
    }
}

async function MoveUp(){
    let changedTiles = [];
    let currentGrid = JSON.parse(JSON.stringify(gameGrid));
    for(let x = 0; x < 4; x++){
        for(let y = 1; y < 4; y++){
            if(gameGrid[y][x] == 0) continue;

            let newY = y;
            let cell = document.getElementById(y * 4 + x);

            while(newY > 0 && gameGrid[newY - 1][x] == 0){
                newY--;
            }           

            if(newY == y && gameGrid[newY - 1][x] != gameGrid[y][x]) continue;

            //if we are on row 0 or the cell above is not the same value
            if(newY-1 >= 0 && gameGrid[newY-1][x] == gameGrid[y][x]){
                gameGrid[newY - 1][x] *= 2;
                gameGrid[y][x] = 0;   
                AnimateCellY(cell, y * 25.75, (y * 25.75) - ((y - newY + 1) * 25.75), 3);
                cell.setAttribute("id", "soonDelete");     
                changedTiles.push([x, newY - 1]); 
            }else{
                gameGrid[newY][x] = gameGrid[y][x];
                gameGrid[y][x] = 0;
                cell.setAttribute("id", newY * 4 + x);
                AnimateCellY(cell, y * 25.75, (y * 25.75) - ((y - newY) * 25.75), 3);
            }
        }
    }

    await new Promise(r => setTimeout(r, 50));

    if(await CheckForWinLose()){
        return;
    }

    if(JSON.stringify(currentGrid) == JSON.stringify(gameGrid)){
        canMove = true;
        return;
    }

    await new Promise(r => setTimeout(r, 200));
    PlaceRandomTile();
    DeleteSoonTiles();
    UpdateScore();
    UpdateCookies();
    changedTiles.forEach(tile => UpgradeTile(tile[0], tile[1]));
    canMove = true;
}

async function MoveDown(){
    let changedTiles = [];
    let currentGrid = JSON.parse(JSON.stringify(gameGrid));
    for(let x = 0; x < 4; x++){
        for(let y = 2; y >= 0; y--){
            if(gameGrid[y][x] == 0) continue;

            let newY = y;
            let cell = document.getElementById(y * 4 + x);

            while(newY < 3 && gameGrid[newY + 1][x] == 0){
                newY++;
            }           

            if(newY == y && gameGrid[newY + 1][x] != gameGrid[y][x]) continue;

            //if we are on row 0 or the cell above is not the same value
            if(newY+1 <= 3 && gameGrid[newY+1][x] == gameGrid[y][x]){
                gameGrid[newY + 1][x] *= 2;
                gameGrid[y][x] = 0;   
                AnimateCellY(cell, y * 25.75, (y * 25.75) + ((newY - y + 1) * 25.75), 3);
                cell.setAttribute("id", "soonDelete");     
                changedTiles.push([x, newY + 1]); 
            }else{
                gameGrid[newY][x] = gameGrid[y][x];
                gameGrid[y][x] = 0;
                cell.setAttribute("id", newY * 4 + x);
                AnimateCellY(cell, y * 25.75, (y * 25.75) + ((newY - y) * 25.75), 3);
            }
        }
    }

    await new Promise(r => setTimeout(r, 50));

    if(await CheckForWinLose()){
        return;
    }

    if(JSON.stringify(currentGrid) == JSON.stringify(gameGrid)){
        canMove = true;
        return;
    }

    await new Promise(r => setTimeout(r, 200));
    PlaceRandomTile();
    DeleteSoonTiles();
    UpdateScore();
    UpdateCookies();
    changedTiles.forEach(tile => UpgradeTile(tile[0], tile[1]));
    canMove = true;
}

async function MoveLeft(){
    let changedTiles = [];
    let currentGrid = JSON.parse(JSON.stringify(gameGrid));
    for(let y = 0; y < 4; y++){
        for(let x = 1; x < 4; x++){
            if(gameGrid[y][x] == 0) continue;

            let newX = x;
            let cell = document.getElementById(y * 4 + x);

            while(newX > 0 && gameGrid[y][newX - 1] == 0){
                newX--;
            }           

            if(newX == x && gameGrid[y][newX - 1] != gameGrid[y][x]) continue;

            //if we are on row 0 or the cell above is not the same value
            if(newX-1 >= 0 && gameGrid[y][newX-1] == gameGrid[y][x]){
                gameGrid[y][newX - 1] *= 2;
                gameGrid[y][x] = 0;   
                AnimateCellX(cell, x * 25.75, (x * 25.75) - ((x - newX + 1) * 25.75), 3);
                cell.setAttribute("id", "soonDelete");     
                changedTiles.push([newX - 1, y]); 
            }else{
                gameGrid[y][newX] = gameGrid[y][x];
                gameGrid[y][x] = 0;
                cell.setAttribute("id", y * 4 + newX);
                AnimateCellX(cell, x * 25.75, (x * 25.75) - ((x - newX) * 25.75), 3);
            }
        }
    }

    await new Promise(r => setTimeout(r, 50));

    if(await CheckForWinLose()){
        return;
    }

    if(JSON.stringify(currentGrid) == JSON.stringify(gameGrid)){
        canMove = true;
        return;
    }

    await new Promise(r => setTimeout(r, 200));
    PlaceRandomTile();
    DeleteSoonTiles();
    UpdateScore();
    UpdateCookies();
    changedTiles.forEach(tile => UpgradeTile(tile[0], tile[1]));
    canMove = true;
}

async function MoveRight(){
    let changedTiles = [];
    let currentGrid = JSON.parse(JSON.stringify(gameGrid));
    for(let y = 0; y < 4; y++){
        for(let x = 2; x >= 0; x--){
            if(gameGrid[y][x] == 0) continue;

            let newX = x;
            let cell = document.getElementById(y * 4 + x);

            while(newX < 3 && gameGrid[y][newX + 1] == 0){
                newX++;
            }

            if(newX == x && gameGrid[y][newX + 1] != gameGrid[y][x]) continue;

            //if we are on row 0 or the cell above is not the same value
            if(newX+1 <= 3 && gameGrid[y][newX+1] == gameGrid[y][x]){
                gameGrid[y][newX + 1] *= 2;
                gameGrid[y][x] = 0;
                AnimateCellX(cell, x * 25.75, (x * 25.75) + ((newX - x + 1) * 25.75), 3);
                cell.setAttribute("id", "soonDelete");
                changedTiles.push([newX + 1, y]);
            }else{
                gameGrid[y][newX] = gameGrid[y][x];
                gameGrid[y][x] = 0;
                cell.setAttribute("id", y * 4 + newX);
                AnimateCellX(cell, x * 25.75, (x * 25.75) + ((newX - x) * 25.75), 3);
            }
        }
    }

    await new Promise(r => setTimeout(r, 50));

    if(await CheckForWinLose()){
        return;
    }

    if(JSON.stringify(currentGrid) == JSON.stringify(gameGrid)){
        canMove = true;
        return;
    }

    await new Promise(r => setTimeout(r, 200));
    PlaceRandomTile();
    DeleteSoonTiles();
    UpdateScore();
    UpdateCookies();
    changedTiles.forEach(tile => UpgradeTile(tile[0], tile[1]));
    canMove = true;
}

function UpdateScore(){
    let score = document.getElementById("score-number");
    score.innerHTML = sumGrid();
}
function sumGrid(){
    let sum = 0;
    for(let y = 0; y < 4; y++){
        for(let x = 0; x < 4; x++){
            sum += gameGrid[y][x];
        }
    }

    return sum;
}

async function CheckForWinLose(){
    emptyspaces = 16;
    for(let y = 0; y < 4; y++){
        for(let x = 0; x < 4; x++){
            if(gameGrid[y][x] != 0){
                emptyspaces--;
            }
        }
    }

    if(emptyspaces != 0) return false;

    for(let y = 0; y < 4; y++){
        for(let x = 0; x < 4; x++){
            if(x + 1 < 4 && gameGrid[y][x] == gameGrid[y][x + 1]){
                return false;
            }

            if(y + 1 < 4 && gameGrid[y][x] == gameGrid[y + 1][x]){
                return false;
            }

            if(x - 1 >= 0 && gameGrid[y][x] == gameGrid[y][x - 1]){
                return false;
            }

            if(y - 1 >= 0 && gameGrid[y][x] == gameGrid[y - 1][x]){
                return false;
            }
        }
    }

    console.log(JSON.stringify(gameGrid));

    Lose();

    return true;
}

function UpdateCookies(){
    document.cookie = "currentGame=" + JSON.stringify(gameGrid) + "; expires=Thu, 01 Jan 2070 00:00:00 UTC; path=/;";
    document.cookie = "score=" + sumGrid() + "; expires=Thu, 01 Jan 2070 00:00:00 UTC; path=/;";
}


function GetCookieByName(name){
    let cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++){
        let cookie = cookies[i].split("=");
        if(cookie[0].trim() == name){
            return cookie[1];
        }
    }

    return null;
}
function Lose(){
    canMove = false;

    let lose = document.getElementById("lose");
    //fade in lose screen
    lose.style.opacity = 0;
    lose.style.display = "flex";
    let time = 0.0;
    while(time < 1.0){
        lose.style.opacity = time;
        time += 0.01;
    }
    lose.style.opacity = 1;   
    
    if(sumGrid() > GetCookieByName("highscore")){
        document.cookie = "highscore=" + sumGrid() + "; expires=Thu, 01 Jan 2070 00:00:00 UTC; path=/;";
        document.getElementById("best-score-number").innerHTML = sumGrid();
    }
}

function ResetGame(){
    gameGrid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    let cells = document.getElementsByClassName("gameCell");
    while(cells.length > 0){
        cells[0].remove();
    }

    PlaceFirstTiles();

    canMove = true;
    let lose = document.getElementById("lose");
    lose.style.display = "none";

    UpdateCookies();
    UpdateScore();
}

function UpgradeTile(x, y){
    let cell = document.getElementById(y * 4 + x);
    let value = gameGrid[y][x];

    cell.style.backgroundColor = cellOdds[value];
    cell.innerHTML = value;
}

function DeleteSoonTiles(){
    while(document.getElementById("soonDelete") != null){
        document.getElementById("soonDelete").remove();
    }
}

async function PlaceRandomTile(){
    let x = Math.floor(Math.random() * 4);
    let y = Math.floor(Math.random() * 4);

    while(gameGrid[y][x] != 0){
        x = Math.floor(Math.random() * 4);
        y = Math.floor(Math.random() * 4);
    }

    PlaceTile(x, y, Math.random() < 0.9 ? 2 : 4);
}

function PlaceFirstTiles(){
    let x1 = Math.floor(Math.random() * 4);
    let y1 = Math.floor(Math.random() * 4);
    let value = Math.random() < 0.9 ? 2 : 4;

    PlaceTile(x1, y1, value);

    let x2 = Math.floor(Math.random() * 4);
    let y2 = Math.floor(Math.random() * 4);

    while(x2 == x1 && y2 == y1){
        x2 = Math.floor(Math.random() * 4);
        y2 = Math.floor(Math.random() * 4);
    }

    value = Math.random() < 0.9 ? 2 : 4;
    PlaceTile(x2, y2, value);
}

function PlaceTile(x, y, value){
    gameGrid[y][x] = value;

    let numDiv = document.createElement("div");
    numDiv.className = "gameCell";
    numDiv.innerHTML = value;
    numDiv.style.left = (x * 25.75) + "%";
    numDiv.style.top = (y * 25.75) + "%";
    numDiv.setAttribute("id", y * 4 + x);
    document.getElementById("gameGrid").appendChild(numDiv);
}

async function AnimateCellX(cell, from, to, speed = 1.0){
    let time = 0.0;
    while(time < 1.0){
        cell.style.left = lerp(from, to, time) + "%";
        time += 0.01 * speed;

        if(from > to && cell.style.left.replace("%", "") < to) break;
        if(from < to && cell.style.left.replace("%", "") > to) break;

        await new Promise(r => setTimeout(r, 1));
    }

    cell.style.left = to + "%";
}

async function AnimateCellY(cell, from, to, speed = 1.0){
    let time = 0.0;
    while(time < 1.0){
        cell.style.top = lerp(from, to, time) + "%";
        time += 0.01 * speed;

        if(from > to && cell.style.top.replace("%", "") < to) break;
        if(from < to && cell.style.top.replace("%", "") > to) break;

        await new Promise(r => setTimeout(r, 4));
    }

    cell.style.top = to + "%";
}

function lerp(a, b, t){
    return a + (b - a) * t;
}