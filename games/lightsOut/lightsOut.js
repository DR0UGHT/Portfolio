let grid = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

let gridSize = 5
let gameGrid;
window.onload = function() {
    gameGrid = document.getElementById("board")

    randomizeGrid()
    // drawGrid()

    console.log(checkIfSolvable());
}

function toggleCell(x, y){
    grid[y][x] = !grid[y][x]
    if(x+1 < gridSize) grid[y][x+1] = !grid[y][x+1];
    if(x-1 >= 0) grid[y][x-1] = !grid[y][x-1];
    if(y+1 < gridSize) grid[y+1][x] = !grid[y+1][x];
    if(y-1 >= 0) grid[y-1][x] = !grid[y-1][x];

    drawGrid()
}

function drawGrid(){
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            //cells are id'd "cell" 1-gridSize^2, flip x and y
            let cell = document.getElementById(`cell${j*gridSize + i}`)
            if(grid[j][i]){
                cell.firstChild.style.backgroundColor = "rgb(212, 224, 102)"
            } else {
                cell.firstChild.style.backgroundColor = "rgb(50, 50, 50)"
            }
        }
    }
}

function randomizeGrid(){
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            grid[i][j] = Math.floor(Math.random() * 2)
        }
    }
    if(!checkIfSolvable()){
        randomizeGrid()
    }else{
        drawGrid()
    }
}



function checkIfSolvable(){
    //check the first 2 and last 2 lights in the first row, middle row, and last row. if the number of lights is odd, return false
    let countRows = 0
    for(let i = 0; i < gridSize; i+=2){
        if(grid[i][0] == 1) countRows++
        if(grid[i][1] == 1) countRows++
        if(grid[i][gridSize-2] == 1) countRows++
        if(grid[i][gridSize-1] == 1) countRows++
    }

    if(countRows % 2 != 0) return false

    let countCols = 0
    for(let i = 0; i < gridSize; i+=2){
        if(grid[0][i] == 1) countCols++
        if(grid[1][i] == 1) countCols++
        if(grid[gridSize-2][i] == 1) countCols++
        if(grid[gridSize-1][i] == 1) countCols++
    }

    if(countCols % 2 != 0) return false


    return true
}
