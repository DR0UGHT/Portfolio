var grid;
var flags=[];
var bombs=[];
var revealed=[];
var size = 10;
var maxBombs = 10;
var inGame = false;
var timer = 0;


var flagCounter, bombCounter, timerCounter;
window.onload = function() {
    flagCounter = document.getElementsByClassName('flag')[0];
    bombCounter = document.getElementsByClassName('bomb')[0];
    timerCounter = document.getElementsByClassName('analog')[0];

    let gridDiv = document.getElementsByClassName('grid')[0];
    ResetupGame('medium');
    daTimer();
    CheckWin();
    grid = Array.from({length: size}, () => Array.from({length: size}, () => 0));
    //right click flag cell
    gridDiv.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        let x = Math.floor((event.clientX - gridDiv.offsetLeft) / gridDiv.clientWidth * size);
        let y = Math.floor((event.clientY - gridDiv.offsetTop) / gridDiv.clientHeight * size);

        flagCell(x, y);
    });

    //left click reveal cell
    gridDiv.addEventListener('click', function(event) {
        let x = Math.floor((event.clientX - gridDiv.offsetLeft) / gridDiv.clientWidth * size);
        let y = Math.floor((event.clientY - gridDiv.offsetTop) / gridDiv.clientHeight * size);

        if(document.getElementsByClassName('winner')[0].style.display === 'flex') return;
        if(!inGame) {
            placeBombs(x, y);
            SetupGrid();
            inGame = true;
        }

        if(contains(flags, x, y)) return;
        clickCell(x, y);
    });

}

async function CheckWin() {
    while(true) {
        if(!inGame) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }

        if(revealed.length + flags.length == size*size) {
            inGame = false;
            document.getElementsByClassName('winner')[0].style.display = 'flex';
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}


async function ShowAllBombsWithExplode() {
    let gridDiv = document.getElementsByClassName('grid')[0];
    bombs.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    for (let i = 0; i < maxBombs; i++) {
        let x = bombs[i][0];
        let y = bombs[i][1];
        let cell = gridDiv.children[y*size + x];

        if(cell.children.length !== 0) cell.removeChild(cell.children[0]);
        let bomb = document.createElement('img');
        bomb.src = '../images/explosion.gif?'+Math.random();
        bomb.style.width = '100%';
        bomb.style.height = '100%';
        bomb.style.zIndex = '100';
        cell.appendChild(bomb);

        let bomb2 = document.createElement('img');
        bomb2.src = '../images/bomb.png';
        bomb2.style.width = '90%';
        bomb2.style.height = '90%';
        bomb2.style.marginLeft = '-100%';
        let exp1 = setTimeout(function() {
            cell.appendChild(bomb2);
        }, 700);

        let exp2 = setTimeout(function() {
            bomb2.style.marginLeft = '0%';
            cell.removeChild(cell.children[0]);
        }, 2000);

        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

function ResetupGame(mode) {
    let gridDiv = document.getElementsByClassName('grid')[0];
    gridDiv.innerHTML = '';
    grid = Array.from({length: size}, () => Array.from({length: size}, () => 0));
    SetupGridVisual(mode);
    bombs = [];
    flags = [];
    revealed = [];
    timer = 0;
    inGame = false;
    flagCounter.innerHTML = mode === 'easy' ? 10 : mode === 'medium' ? 50 : 100;
    bombCounter.innerHTML = mode === 'easy' ? 10 : mode === 'medium' ? 50 : 100;
    document.getElementsByClassName('winner')[0].style.display = 'none';
    document.getElementsByClassName('analog')[0].innerHTML = '00';
}
    

function SetupGridVisual(mode) {
    let gridDiv = document.getElementsByClassName('grid')[0];

    if(mode==='easy'){
        size = 10;
        maxBombs = 10;
        gridDiv.style.gridTemplateColumns = 'repeat(10, 1fr)';
        gridDiv.style.gridTemplateRows = 'repeat(10, 1fr)';
    }else if(mode==='medium'){
        size = 25;
        maxBombs = 100;
        gridDiv.style.gridTemplateColumns = 'repeat(25, 1fr)';
        gridDiv.style.gridTemplateRows = 'repeat(25, 1fr)';
    }else if(mode==='hard'){
        size = 50;
        maxBombs = 300;
        gridDiv.style.gridTemplateColumns = 'repeat(50, 1fr)';
        gridDiv.style.gridTemplateRows = 'repeat(50, 1fr)';
    }

    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.width = '100%';
            cell.style.height = '100%';
            cell.style.backgroundColor = 'white';
            cell.style.border = '.1vmin solid black';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.fontSize = mode==='easy' ? '2.0vmin' : mode==='medium' ? '1.0vmin' : '0.5vmin';
            
            gridDiv.appendChild(cell);
        }
    }
}

function placeBombs(cantX, cantY) {
    grid = Array.from({length: size}, () => Array.from({length: size}, () => 0));
    for (let i = 0; i < maxBombs; i++) {
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        if(contains(bombs, x, y) || (x == cantX && y == cantY)) {
            i--;
        }else{
            bombs.push([x, y]);
        }
    }
}

function SetupGrid() {
    for(let i = 0; i < maxBombs; i++) {
        let x = bombs[i][0];
        let y = bombs[i][1];
        
        for(let xPos = -1; xPos <= 1; xPos++) {
            for(let yPos = -1; yPos <= 1; yPos++) {
                if(xPos == 0 && yPos == 0) continue;
                if(x + xPos < 0 || x + xPos >= size || y + yPos < 0 || y + yPos >= size) continue;
                if(contains(bombs, x + xPos, y + yPos)) continue;

                grid[x + xPos][y + yPos]++;
            }
        }
    }
}
function contains(arr, x, y) {
    for (let i = 0; i < arr.length; i++) {
        if(arr[i][0] == x && arr[i][1] == y) {
            return true;
        }
    }
    return false;
}

function toggleBombs() {
    console.log(bombs);
    let gridDiv = document.getElementsByClassName('grid')[0];
    for (let i = 0; i < maxBombs; i++) {
        let x = bombs[i][0];
        let y = bombs[i][1];
        let cell = gridDiv.children[y*size + x];
        if(cell.children.length === 0) {
            let bomb = document.createElement('img');
            bomb.src = '../images/bomb.png';
            bomb.style.width = '90%';
            bomb.style.height = '90%';
            cell.appendChild(bomb);
        }else{
            cell.removeChild(cell.children[0]);
        }
           
    }
}

function revealCell(x, y, needDepth) {
    if(contains(revealed, x, y)) return;
    if(contains(flags, x, y)) return;
    let cell = document.getElementsByClassName('grid')[0].children[y*size + x];
    cell.style.backgroundColor = 'darkgray';
    if(grid[x][y] !== 0) cell.innerHTML = grid[x][y];
    revealed.push([x, y]);

    if(!needDepth) return;

    for(let newX = -1; newX <= 1; newX++) {
        for(let newY = -1; newY <= 1; newY++) {
            if(newX == 0 && newY == 0) continue;
            if(x + newX < 0 || x + newX >= size || y + newY < 0 || y + newY >= size) continue;
            if(contains(bombs, x + newX, y + newY)) continue;
            if(contains(revealed, x + newX, y + newY)) continue;

            revealCell(x + newX, y + newY, grid[x + newX][y + newY] == 0);
        }
    }
}
function flagCell(x, y) {
    if(!inGame) return;
    if(contains(revealed, x, y)) return;
    let gridDiv = document.getElementsByClassName('grid')[0];
    if(gridDiv.children[y*size + x].children.length === 0){
        if(flags.length >= maxBombs) return;
        flags.push([x, y]);
        addFlagToHtml(x, y);
        flagCounter.innerHTML = parseInt(flagCounter.innerHTML) - 1;
    }else {
        flags.splice(flags.findIndex(e => e[0] == x && e[1] == y), 1);
        removeFlagFromHtml(x, y);
        flagCounter.innerHTML = parseInt(flagCounter.innerHTML) + 1;
    }
}

function clickCell(x, y) {
    if(contains(bombs, x, y)) {
        inGame = false;
        ShowAllBombsWithExplode();
        return;
    }
    
    revealCell(x, y, true);
}

async function daTimer() {
    while(true) {
        if(!inGame){
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }

        timer++;
        timerCounter.innerHTML = timer < 10 ? '0' + timer : timer;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function addFlagToHtml(x, y) {
    //cell is a grid in html, use y*size + x to get the correct cell
    let cell = document.getElementsByClassName('grid')[0].children[y*size + x];
    let flag = document.createElement('img');
    flag.src = '../images/flag.png';
    flag.style.width = '75%';
    flag.style.height = '75%';
    cell.appendChild(flag);
}

function removeFlagFromHtml(x, y) {
    let cell = document.getElementsByClassName('grid')[0].children[y*size + x];
    cell.removeChild(cell.children[0]);
}

function clickCellHtml(x, y) {
    let cell = document.getElementsByClassName('grid')[0].children[y*size + x];
    cell.style.backgroundColor = 'darkgray';
}   
