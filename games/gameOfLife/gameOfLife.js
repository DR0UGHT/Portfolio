var gridWidth, gridHeight, grid;
var gridDivs = [];
var activeGridCells = [];
var prevScroll = 0;
//white, red, orange, yellow, green, blue, indigo, violet
const colors = ['#000000 ', '#FF0000 ', '#FFA500 ', '#FFFF00 ', '#00FF00 ', '#0000FF ', '#4B0082 ', '#EE82EE '];

var isPlaying = false;
var isOptionsOpen = true;
var lock = false;

window.onload = () => {
    let aspectRatio = window.innerWidth / window.innerHeight ;
    gridHeight = 100;
    gridWidth = Math.floor(gridHeight * aspectRatio);
    grid = Array.from({ length: gridWidth }, () => Array.from({ length: gridHeight }, () => 0));
    var gridHolder = document.getElementsByClassName('grid')[0];
    for(let x = 0; x < gridWidth; x++) {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.style.width = (100.0 / gridWidth) + '%';
        div.style.height = '100%';
        div.style.backgroundColor = 'black';

        gridDivs.push(div);
        gridHolder.appendChild(div);

        DrawColumn(x);
    }

    RunGameOfLifeOptimized();

    //bind click to add a cell
    window.addEventListener('click', (e) => {
        let xPercent = (e.clientX / window.innerWidth) * 100;
        let yPercent = (e.clientY / window.innerHeight) * 100;
        let x = Math.floor((e.clientX / window.innerWidth) * gridWidth);
        let y = Math.floor((e.clientY / window.innerHeight) * gridHeight);

        if(isOptionsOpen && (xPercent < 10 && yPercent < 40)) { return; }
        if(isOptionsOpen && (xPercent < 14 && yPercent < 4)) { return; }
        if(!isOptionsOpen && (xPercent < 5 && yPercent < 4)) { return; }
        
        if(grid[x][y] == 0) {
            SetCell(x, y, 1);
        } else {
            KillCell(x, y);
        }
        DrawColumn(x);
    });

    //bind scroll to zoom in and out
    window.addEventListener('wheel', (e) => {
        if(e.deltaY > 0 && prevScroll < 0) {
            prevScroll = 1;
            return;
        }else if(e.deltaY < 0 && prevScroll > 0) {
            prevScroll = 0;
            return;
        }

        if(e.deltaY < 0) {
            DecreaseGridSize();
        } else {
            IncreaseGridSize();
        }
    });

    //on slider value change
    document.getElementById('randomChance').addEventListener('input', (e) => {
        document.getElementById('randomChanceValue').innerText = e.target.value;
    });
}

function randomGame() {
    clearGame();
    for(let x = 0; x < gridWidth; x++) {
        for(let y = 0; y < gridHeight; y++) {
            if(Math.random() > 1 - parseInt(document.getElementById('randomChanceValue').innerText) / 100.0) {
                SetCell(x, y, 1);
            }
        }
        DrawColumn(x);
    }
}

function clearGame() {
    for(let x = 0; x < gridWidth; x++) {
        for(let y = 0; y < gridHeight; y++) {
            KillCell(x, y);
            DrawColumn(x);
        }
    }
}

function startGame(){
    isPlaying = true;
}

function stopGame(){
    isPlaying = false;
}

async function toggleOptions(){
    if(lock) { return; }
    lock = true;

    let options = document.getElementsByClassName('controls')[0];
    var t = 0.0;
    let opener = setInterval(async() => {
        t += 0.01;

        if(isOptionsOpen) {
            options.style.left = lerp(0, -10, t) + 'vw';
        } else {
            options.style.left = lerp(-10, 0, t) + 'vw';
        }

        if(t >= 1) {
            clearInterval(opener);
            isOptionsOpen = !isOptionsOpen;
            lock = false;
        }
    }, 10);

}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function IncreaseGridSize() {
    if(gridWidth >= 600) { return; }
    let aspectRatio = window.innerWidth / window.innerHeight ;
    gridWidth++;
    gridHeight = Math.floor(gridWidth / aspectRatio);
    //add row and column to grid
    grid = grid.map((row) => {
        row.push(0);
        return row;
    });

    grid.push(Array.from({ length: gridHeight }, () => 0));

    let gridHolder = document.getElementsByClassName('grid')[0];
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.height = '100%';
    div.style.backgroundColor = 'black';

    gridDivs.push(div);
    gridHolder.appendChild(div);

    for(let x = 0; x < gridWidth; x++) {
        gridDivs[x].style.width = (100.0 / gridWidth) + '%';
    }    

    RedrawEntireGrid();
}


function DecreaseGridSize() {
    if(gridHeight <= 100) { return; }

    gridWidth--;
    gridHeight = Math.floor(gridWidth / (window.innerWidth / window.innerHeight));
    //remove row and column from grid
    grid = grid.map((row) => {
        row.pop();
        return row;
    });

    grid.pop();

    let gridHolder = document.getElementsByClassName('grid')[0];
    gridHolder.removeChild(gridDivs[gridDivs.length - 1]);
    gridDivs.pop();

    for(let x = 0; x < gridWidth; x++) {
        gridDivs[x].style.width = (100.0 / gridWidth) + '%';
    }

    activeGridCells = activeGridCells.filter((cell) => {
        return cell[0] < gridWidth && cell[1] < gridHeight;
    });

    RedrawEntireGrid();
}

async function RunGameOfLife() {
    await new Promise(r => setTimeout(r, 1000));

    var interval = setInterval(() => {
        if(!isPlaying) { return; }

        var newCells = [];
        var killCells = [];
        var needRedraw = [];

        activeGridCells.forEach((cell) => {
            let x = cell[0];
            let y = cell[1];

            if(RulesOfLifeAliveCell(x, y) != null) { killCells.push([x, y]); }

            for(let xx = -1; xx <= 1; xx++) {
                for(let yy = -1; yy <= 1; yy++) {
                    if(xx == 0 && yy == 0) { continue; }
                    if(x + xx < 0 || x + xx >= gridWidth || y + yy < 0 || y + yy >= gridHeight) { continue; }
                    if(grid[x + xx][y + yy] != 0) { continue; } 
                    
                    let newCell = RulesOfLifeDeadCell(x + xx, y + yy);
                    if(newCell != null){
                        newCells.push(newCell);
                    }
                    
                }
            }
        });

        for(let i = 0; i < killCells.length; i++) {
            KillCell(killCells[i][0], killCells[i][1]);
            if(!needRedraw.includes(killCells[i][0])) needRedraw.push(killCells[i][0]);
        }

        for(let i = 0; i < newCells.length; i++) {
            SetCell(newCells[i][0], newCells[i][1], 1);
            if(!needRedraw.includes(newCells[i][0])) needRedraw.push(newCells[i][0]);
        }

        needRedraw.forEach((x) => {
            DrawColumn(x);
        });


    }, 1000);
}

async function RunGameOfLifeOptimized() {
    await new Promise(r => setTimeout(r, 1000));
    
    var newCells = [];
    var killCells = [];
    var needRedraw = [];

    while(true) {
        if(!isPlaying) { 
            await new Promise(r => setTimeout(r, 100));
            continue;
         }

        let start = 0;
        let end = Math.floor(gridWidth / 10);
        let step = Math.floor(gridWidth / 10);
        for(let i = 0; i < 10; i++) {
            for(let x = start; x < end; x++) {
                for(let y = 0; y < gridHeight; y++) {
                    if(grid[x][y] == 0) { continue; }

                    if(RulesOfLifeAliveCell(x, y) != null) { killCells.push([x, y]); }

                    for(let xx = -1; xx <= 1; xx++) {
                        for(let yy = -1; yy <= 1; yy++) {
                            if(xx == 0 && yy == 0) { continue; }
                            if(x + xx < 0 || x + xx >= gridWidth || y + yy < 0 || y + yy >= gridHeight) { continue; }
                            if(grid[x + xx][y + yy] != 0) { continue; } 
                            
                            let newCell = RulesOfLifeDeadCell(x + xx, y + yy);
                            if(newCell != null){
                                newCells.push(newCell);
                            }
                            
                        }
                    }
                }
            }

            start += step;
            end += step;
            await new Promise(r => setTimeout(r, 100));
        }
        
        for(let i = 0; i < killCells.length; i++) {
            KillCell(killCells[i][0], killCells[i][1]);
            if(!needRedraw.includes(killCells[i][0])) needRedraw.push(killCells[i][0]);
        }

        for(let i = 0; i < newCells.length; i++) {
            SetCell(newCells[i][0], newCells[i][1], 1);
            if(!needRedraw.includes(newCells[i][0])) needRedraw.push(newCells[i][0]);
        }

        needRedraw.forEach((x) => {
            DrawColumn(x);
        });

        newCells = [];
        killCells = [];
        needRedraw = [];
    }
}

function RulesOfLifeAliveCell(x, y) {
    let liveNeighbors = CountNeighbors(x, y);
    
    if(liveNeighbors == 2 || liveNeighbors == 3) { return null; } //rule 1 and 3

    return [x, y];
}

function RulesOfLifeDeadCell(x, y) {  
    if(CountNeighbors(x, y) == 3) { return [x, y]; } //rule 4

    return null;
}

function CountNeighbors(x, y) {
    let count = 0;
    for(let xx = -1; xx <= 1; xx++) {
        for(let yy = -1; yy <= 1; yy++) {
            if(xx == 0 && yy == 0) { continue; }
            if(x + xx < 0 || x + xx >= gridWidth || y + yy < 0 || y + yy >= gridHeight) { continue; }
            
            if(grid[x + xx][y + yy] == 1) { count++; }
        }
    }
    return count;
}

function SetCell(x, y, value) {
    if(grid[x][y] == value) { return; }

    if(x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) { return; }
    grid[x][y] = value;
    activeGridCells.push([x, y]);
}

function KillCell(x, y) {
    if(grid[x][y] == 0) { return; }
    if(x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) { return; }
    grid[x][y] = 0;
    //remove from activeGridCells
    activeGridCells = activeGridCells.filter((cell) => {
        return cell[0] != x || cell[1] != y;
    });
}

function DrawColumn(x) {
    let currentColor = 0;
    var cssText = 'linear-gradient(to bottom, ' + colors[grid[x][0]] + " 0%, ";
    for(let y = 0; y < gridHeight; y++) {
        if(grid[x][y] != currentColor) {
            let perc = ((y / gridHeight) * 100) + '%, ';
            cssText += colors[currentColor] + perc + colors[grid[x][y]] + perc;
            currentColor = grid[x][y];
        }
    }
    if(!cssText.includes('100%')) { cssText += colors[currentColor] + " 100%)"; }
    gridDivs[x].style.background = cssText;
}

function RedrawEntireGrid() {
    for(let x = 0; x < gridWidth; x++) {
        DrawColumn(x);
    }
}