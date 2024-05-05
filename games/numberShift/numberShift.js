var gridSize = 3;
var gridDiv, grid;

var time, moves, playing = false;

window.onload = function() {
    gridDiv = document.getElementById("nsGrid");
    ChangeGridSize();

    setInterval(function(){
        if(playing){
            time++;
            document.getElementById("nsTime").innerHTML = "Time: " + Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
        }
    }, 1000);
}

function changeSize(value){
    gridSize = value;
    document.getElementById("gSize").innerHTML = gridSize + "x" + gridSize;
    ChangeGridSize();
}
function ChangeGridSize() {
    document.getElementById("nsWinMessage").style.display = "none";
    document.getElementById("nsMoves").innerHTML = "Moves: 0";
    document.getElementById("nsTime").innerHTML = "Time: 0:00";
    time = 0;
    moves = 0;
    playing = false;
    gridDiv.innerHTML = "";
    gridDiv.style.gridTemplateColumns = "repeat(" + gridSize + ", 1fr)";
    gridDiv.style.gridTemplateRows = "repeat(" + gridSize + ", 1fr)";

    //initialize 2D array of increasing numbers
    let shuffledNumbers = Array.from({length: gridSize * gridSize}, (v, i) => (i + 1) - 1).sort(() => Math.random() - 0.5);
    grid = Array.from({length: gridSize}, () => Array.from({length: gridSize}, () => shuffledNumbers.pop()));

    for (var i = 0; i < gridSize * gridSize; i++) {
        if(grid[Math.floor(i / gridSize)][i % gridSize] == 0){
            var emptyCell = document.createElement("div");
            emptyCell.className = "nsEmptyCell";
            emptyCell.setAttribute("id", 0);
            emptyCell.style.fontSize = Lerp(3, .1, gridSize / 10) + "vw";
            gridDiv.appendChild(emptyCell);
            continue;
        }

        var cell = document.createElement("div");
        cell.className = "nsCell";
        cell.innerHTML = grid[Math.floor(i / gridSize)][i % gridSize];
        cell.style.fontSize = Lerp(3, .1, gridSize / 10) + "vw";
        cell.setAttribute("id", cell.innerHTML);
        cell.setAttribute("onclick", "ShiftNumber(" + cell.innerHTML + ");");
        gridDiv.appendChild(cell);
    }   

    if(!IsBoardSolvable()){
        ChangeGridSize();
    }
}

function Lerp(a, b, t) {
    return Math.max(a, Math.min(b, a + t * (b - a)));
}


function ShiftNumber(index){
    if(!playing){
        if(document.getElementById("nsWinMessage").style.display == "none"){
            playing = true; 
        } else {
            return;
        }
    }
    moves++;
    document.getElementById("nsMoves").innerHTML = "Moves: " + moves;
    var myCellX, myCellY;
    for(let y = 0; y < gridSize; y++){
        for(let x = 0; x < gridSize; x++){
            if(grid[y][x] == index){
                myCellX = x;
                myCellY = y;
                break;
            }
        }
        if(myCellX != null){
            break;
        }
    }

    var emptyCellX, emptyCellY;
    for(let y = 0; y < gridSize; y++){
        for(let x = 0; x < gridSize; x++){
            if(grid[y][x] == 0){
                emptyCellX = x;
                emptyCellY = y;
                break;
            }
        }
        if(emptyCellX != null){
            break;
        }
    }

    if((myCellY+1 < gridSize && grid[myCellY+1][myCellX] == 0) || 
       (myCellY-1 >= 0 && grid[myCellY-1][myCellX] == 0) ||
       (myCellX+1 < gridSize && grid[myCellY][myCellX+1] == 0) ||
       (myCellX-1 >= 0 && grid[myCellY][myCellX-1] == 0)){

        grid[emptyCellY][emptyCellX] = grid[myCellY][myCellX];
        grid[myCellY][myCellX] = 0;

        let emptyCell = document.getElementById("0");
        let myCell = document.getElementById(index);

        emptyCell.innerHTML = index;
        emptyCell.setAttribute("id", index);
        emptyCell.className = "nsCell";
        emptyCell.setAttribute("onclick", "ShiftNumber(" + index + ");");

        myCell.innerHTML = "";
        myCell.setAttribute("id", 0);
        myCell.className = "nsEmptyCell";
        myCell.setAttribute("onclick", "");
    }

    if(CheckWin()){
        playing = false;
        document.getElementById("nsWinMessage").style.display = "flex";
        document.getElementById("nsWinMoves").innerHTML = "Moves: " + moves;
        document.getElementById("nsWinTime").innerHTML = "Time: " + Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
    }
}

function CheckWin(){
    let x = 1;
    let solvedBoard = Array.from({length: gridSize}, () => Array.from({length: gridSize}, () => x++));
    solvedBoard[gridSize - 1][gridSize - 1] = 0;
    if(JSON.stringify(grid) != JSON.stringify(solvedBoard)){
        return false;
    }

    return true;
}

function IsBoardSolvable(){
    let ordered = [];
    for(let y = 0; y < gridSize; y++){
        for(let x = 0; x < gridSize; x++){
            ordered.push(grid[y][x]);
        }
    }

    let inversions = 0;
    for(let i = 0; i < ordered.length; i++){
        for(let j = i + 1; j <= ordered.length; j++){
            if(ordered[i] != 0 && ordered[j] != 0 && ordered[i] > ordered[j]){
                inversions++;
            }
        }
    }

    return inversions % 2 == 0;
}

