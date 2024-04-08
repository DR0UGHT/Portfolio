var gridWidth;
var gridHeight;
var grid;

//white, red, orange, yellow, green, blue, indigo, violet
const colors = ['#000000 ', '#FF0000 ', '#FFA500 ', '#FFFF00 ', '#00FF00 ', '#0000FF ', '#4B0082 ', '#EE82EE '];
var gridDivs = [];
var activeGridCells = [];

var isPlaying = false;

window.onload = () => {
    let aspectRatio = window.innerWidth / window.innerHeight;
    gridWidth = 100;
    gridHeight = Math.floor(gridWidth / aspectRatio);
    grid = Array.from({ length: gridWidth }, () => Array.from({ length: gridHeight }, () => 0));

    for(let x = 0; x < gridWidth; x++) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = (100 / gridWidth) + '%';
        div.style.height = '100%';
        div.style.marginLeft = ((100 / gridWidth) * x) + '%';
        div.style.backgroundColor = 'white';
        // div.style.transform = 'translate(-50%, -.625%)';
        //set background attribute

        gridDivs.push(div);
        document.body.appendChild(div);

        DrawColumn(x);
    }

    RunGameOfLife();

    //if press space, flip isPlaying
    window.addEventListener('keydown', (e) => {
        if(e.key == ' ') {
            isPlaying = !isPlaying;
        }
    });

    //bind click to add a cell
    window.addEventListener('click', (e) => {
        let x = Math.floor(e.clientX / (window.innerWidth / gridWidth));
        let y = Math.floor(e.clientY / (window.innerHeight / gridHeight));
        SetCell(x, y, 1);
        DrawColumn(x);
    });
}

async function RunGameOfLife() {
    await new Promise(r => setTimeout(r, 1000));

    var interval = setInterval(() => {
        if(!isPlaying) { return; }

        var newCells = [];
        var killCells = [];
        var needRedraw = [];
        console.log(activeGridCells.length);
        activeGridCells.forEach((cell) => {
            let x = cell[0];
            let y = cell[1];

            if(RulesOfLifeAliveCell(x, y) != null) { killCells.push([x, y]); }

            for(let xx = -1; xx <= 1; xx++) {
                for(let yy = -1; yy <= 1; yy++) {
                    if(xx == 0 && yy == 0) { continue; }
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
            let perc = y + '%, '
            cssText += colors[currentColor] + perc + colors[grid[x][y]] + perc;
            currentColor = grid[x][y];
        }
    }
    if(!cssText.includes('100%')) { cssText += colors[currentColor] + " 100%)"; }
    gridDivs[x].style.background = cssText;
}
