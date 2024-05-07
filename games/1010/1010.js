let grid;
let mouse = {x: 0, y: 0};
let gameBoard;

let pieces = [];

let piecesPlaces = 0;

let score = 0;
let lost = false;

window.onload = function() {
    grid = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));
    gameBoard = document.getElementById("gameBoard");

    window.onmousedown = function(event) {
        if (event.target.classList.toString().includes("piece") &&  event.target.classList.toString().includes("x") && !lost){
            dragElement(event.target);
        }
    }

    
    //add any div with "piece" in its class to the pieces array
    let allDivs = document.getElementsByTagName("div");
    for(let i = 0; i < allDivs.length; i++) {
        if(allDivs[i].classList.toString().includes("piece") && allDivs[i].classList.toString().includes("x")) {
            pieces.push(allDivs[i]);
        }
    }
    ResetGame();

    document.getElementById("highScoreValue1").innerText = GetCookie("highScore") || "0";
}


window.onmousemove = function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

function ResetGame() {
    grid = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));
    //get all divs
    while(document.getElementById("n") != null) {
        document.getElementById("n").remove();
    }
    score = 0;
    document.getElementById("scoreValue1").innerText = "0";
    document.getElementById("gameOver").style.display = "none";
    lost = false;

    if(document.getElementById("off1") != null) {
        document.getElementById("off1").remove();    
    }
    if(document.getElementById("off2") != null) {
        document.getElementById("off2").remove();
    }
    if(document.getElementById("off3") != null) {
        document.getElementById("off3").remove();
    }

    SpawnPieces();
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function dragElement(element) {
    console.log("Start Dragging");
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var elementFin = element;
    element.onmousedown = dragMouseDown;
    dragMouseDown();
    //drag element from the top left corner
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        if(elementFin.getAttribute("id") == "off1") {
            elementFin.style.left = "-45%";
            elementFin.style.top = "5%";
        }else if(elementFin.getAttribute("id") == "off2") {
            elementFin.style.left = "-45%";
            elementFin.style.top = "30%";
        }else if(elementFin.getAttribute("id") == "off3") {
            elementFin.style.left = "-45%";
            elementFin.style.top = "75%";
        }
        
        elementFin.style.zIndex = 1000;
        elementFin.setAttribute("id", "n");

        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";

    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        let elemLeft = parseFloat(elementFin.style.left);
        let elemTop = parseFloat(elementFin.style.top);

        //if mouse is over gameBoard, then place the piece
        if (elemLeft > -25 && elemLeft < gameBoard.clientWidth + 25 && elemTop > -25 && elemTop < gameBoard.clientHeight + 25) {
            elemLeft = Clamp(elemLeft, 0, gameBoard.clientWidth);
            elemTop = Clamp(elemTop, 0, gameBoard.clientHeight);

            let pieceMinX = Math.round(Lerp(0, 9, elemLeft / parseFloat(gameBoard.clientWidth * 0.9)));
            let pieceMaxX = pieceMinX + parseInt(elementFin.classList.toString().split("piece")[1].split("x")[1])-1;

            let pieceMinY = Math.round(Lerp(0, 9, elemTop / parseFloat(gameBoard.clientHeight * 0.9)));
            let pieceMaxY = pieceMinY + parseInt(elementFin.classList.toString().split("piece")[1].split("x")[0])-1;

            if(pieceMinX < 0 || pieceMaxX >= 10 || pieceMinY < 0 || pieceMaxY >= 10) {
                ResetElement(elementFin);
                return;
            }
            if(element.classList.toString().includes("piece3x3-1")) {
                if(elementFin.getAttribute("name") == 1) {
                    if(grid[pieceMinY][pieceMinX] > 0 || grid[pieceMinY][pieceMinX + 1] > 0 || grid[pieceMinY][pieceMinX + 2] > 0 || grid[pieceMinY + 1][pieceMinX] > 0 || grid[pieceMinY + 2][pieceMinX] > 0) {
                        ResetElement(elementFin);
                        return;
                    }
                }else if(elementFin.getAttribute("name") == 2) {
                    if(grid[pieceMinY][pieceMinX] > 0 || grid[pieceMinY + 1][pieceMinX] > 0 || grid[pieceMinY + 2][pieceMinX] > 0 || grid[pieceMinY + 2][pieceMinX + 1] > 0 || grid[pieceMinY + 2][pieceMinX + 2] > 0) {
                        ResetElement(elementFin);
                        return;
                    }
                }else if(elementFin.getAttribute("name") == 3) {
                    if(grid[pieceMinY+2][pieceMinX] > 0 || grid[pieceMinY+2][pieceMinX + 1] > 0 || grid[pieceMinY+2][pieceMinX+2] > 0 || grid[pieceMinY][pieceMinX + 2] > 0 || grid[pieceMinY + 1][pieceMinX + 2] > 0) {
                        ResetElement(elementFin);
                        return;
                    }
                }else{
                    if(grid[pieceMinY][pieceMinX] > 0 || grid[pieceMinY][pieceMinX + 1] > 0 || grid[pieceMinY][pieceMinX + 2] > 0 || grid[pieceMinY + 1][pieceMinX+2] > 0 || grid[pieceMinY + 2][pieceMinX+2] > 0) {
                        ResetElement(elementFin);
                        return;
                    }
                }
            }else{
                for(let x = pieceMinX; x <= pieceMaxX; x++) {
                    for(let y = pieceMinY; y <= pieceMaxY; y++) {
                        if(grid[y][x] > 0) {
                            ResetElement(elementFin);
                            return;
                        }
                    }
                }
            }

            let childCount = 0;
            if(element.classList.toString().includes("piece3x3-1")) {
                score += 5;
                if(elementFin.getAttribute("name") == 1) {
                    grid[pieceMinY][pieceMinX] = 1;
                    grid[pieceMinY][pieceMinX + 1] = 1;
                    grid[pieceMinY][pieceMinX + 2] = 1;
                    grid[pieceMinY + 1][pieceMinX] = 1;
                    grid[pieceMinY + 2][pieceMinX] = 1;
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + (pieceMinY + 1));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + (pieceMinY + 2));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 1) + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + pieceMinY);
                }else if(elementFin.getAttribute("name") == 2) {
                    grid[pieceMinY][pieceMinX] = 1;
                    grid[pieceMinY + 1][pieceMinX] = 1;
                    grid[pieceMinY + 2][pieceMinX] = 1;
                    grid[pieceMinY+2][pieceMinX + 1] = 1;
                    grid[pieceMinY+2][pieceMinX + 2] = 1;
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + (pieceMinY + 1));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + (pieceMinY + 2));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 1) + "x" + (pieceMinY + 2));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + (pieceMinY + 2));
                }else if(elementFin.getAttribute("name") == 3) {
                    grid[pieceMinY+2][pieceMinX] = 1;
                    grid[pieceMinY+2][pieceMinX + 1] = 1;
                    grid[pieceMinY+2][pieceMinX+2] = 1;
                    grid[pieceMinY][pieceMinX + 2] = 1;
                    grid[pieceMinY + 1][pieceMinX + 2] = 1;
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + (pieceMinY + 1));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + (pieceMinY + 2));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 1) + "x" + (pieceMinY + 2));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + (pieceMinY + 2));
                }else{
                    grid[pieceMinY][pieceMinX] = 1;
                    grid[pieceMinY][pieceMinX + 1] = 1;
                    grid[pieceMinY][pieceMinX + 2] = 1;
                    grid[pieceMinY + 1][pieceMinX+2] = 1;
                    grid[pieceMinY + 2][pieceMinX+2] = 1;
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + (pieceMinY + 1));
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + pieceMinX + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 1) + "x" + pieceMinY);
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + (pieceMinX + 2) + "x" + (pieceMinY + 2));
                }
            }else{
                for(let x = pieceMinX; x <= pieceMaxX; x++) {
                    for(let y = pieceMinY; y <= pieceMaxY; y++) {
                        grid[y][x] = 1;
                        console.log(y, x);
                        elementFin.children[childCount++].setAttribute("id", "gridDelete" + x + "x" + y);
                        score++;
                    }
                }
            }

            document.getElementById("scoreValue1").innerText = score;

            //snap the piece to the grid
            elementFin.style.left = pieceMinX * 10 + "%";
            elementFin.style.top = pieceMinY * 10 + "%";
            element.style.zIndex = 100;
            //for all children of elementFin, set their id to "off"
            checkGridForCompleteRowsAndColumns();

            piecesPlaces++;
            if(piecesPlaces >= 3) {
                SpawnPieces();
                piecesPlaces = 0;
            }

            CheckForGameOver();
        }else{
            ResetElement(elementFin);
        }
    }
}

function Lerp(a, b, t) {
    return Math.min(Math.max(a + (b - a) * t, a), b);
}

function checkGridForCompleteRowsAndColumns() {
    let rows = [];
    let columns = [];
    for(let y = 0; y < 10; y++) {
        let row = true;
        for(let x = 0; x < 10; x++) {
            if(grid[y][x] == 0) {
                row = false;
                break;
            }
        }
        if(row) {
            rows.push(y);
        }        
    }
    for(let x = 0; x < 10; x++) {
        let column = true;
        for(let y = 0; y < 10; y++) {
            if(grid[y][x] == 0) {
                column = false;
                break;
            }
        }
        if(column) {
            columns.push(x);
        }
    }

    for(let i = 0; i < rows.length; i++) {
        for(let x = 0; x < 10; x++) {
            grid[rows[i]][x] = 0;
            let element = document.getElementById("gridDelete" + x + "x" + rows[i]);
            if(element != null) {
                element.remove();
            }
        }
    }

    for(let i = 0; i < columns.length; i++) {
        for(let y = 0; y < 10; y++) {
            grid[y][columns[i]] = 0;
            let element = document.getElementById("gridDelete" + columns[i] + "x" + y);
            if(element != null) {
                element.remove();
            }
        }
    }

    console.log(grid);
}

function ResetElement(element) {
    //delete atridute left
    element.style.left = "";
    element.style.top = "";
    element.style.zIndex = 100;
    if(document.getElementById("off1") == null) {
        element.setAttribute("id", "off1");
    }else if(document.getElementById("off2") == null) {
        element.setAttribute("id", "off2");
    }else{
        element.setAttribute("id", "off3");
    }
}


function CheckForGameOver() {
    let cantPlace = 0;
    for(let i = 1; i <= 3; i++) {
        let piece = document.getElementById("off" + i) || null;
        if(piece == null){
            cantPlace++;
            continue;
        }
        let pieceSize = {x: parseInt(piece.classList.toString().split("piece")[1].split("x")[1]), y: parseInt(piece.classList.toString().split("piece")[1].split("x")[0])};
        let canPlace = piece.classList.toString().includes("piece3x3-1") ? GridHasRoomForL(parseInt(piece.getAttribute("name"))) : GridHasRoomFor(pieceSize);
        if(!canPlace){
            cantPlace++;
        }
    }

    if(cantPlace == 3) {
        lost = true;
        Lost();
    }
}

async function Lost() {
    await new Promise(r => setTimeout(r, 1000));

    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("scoreValue2").innerText = score;
    let highScore = GetCookie("highScore");
    if(highScore == null || parseInt(highScore) < score) {
        document.cookie = "highScore=" + score;
        document.getElementById("highScoreValue1").innerText = score;
        document.getElementById("highScoreValue2").innerText = score;
    }else if(document.getElementById("highScoreValue2").innerText == "0"){
        document.getElementById("highScoreValue2").innerText = highScore;
    } 
}

function GridHasRoomForL(orientation) {
    //if orientation is 1, then the L find room for x,y x+1,y x+2,y x,y+1 x,y+2
    //if orientation is 2, then the L find room for x,y x,y+1 x,y+2 x+1,y+2 x+2,y+2
    //if orientation is 3, then the L find room for x+2,y x+2,y+1 x+2,y+2 x,y+2 x+1,y+2
    //if orientation is 4, then the L find room for x,y x+1,y x+2,y x+2,y+1 x+2,y+2
    console.log(orientation);
    if(orientation == 1) {
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                if(x + 2 < 10 && y + 2 < 10) {
                    if(grid[y][x] == 0 && grid[y][x + 1] == 0 && grid[y][x + 2] == 0 && grid[y + 1][x] == 0 && grid[y + 2][x] == 0) {
                        return true;
                    }
                }
            }
        }
    }else if(orientation == 2) {
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                if(x + 2 < 10 && y + 2 < 10) {
                    if(grid[y][x] == 0 && grid[y + 1][x] == 0 && grid[y + 2][x] == 0 && grid[y + 2][x + 1] == 0 && grid[y + 2][x + 2] == 0) {
                        return true;
                    }
                }
            }
        }
    }else if(orientation == 3) {
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                if(x + 2 < 10 && y + 2 < 10) {
                    if(grid[y + 2][x] == 0 && grid[y + 2][x + 1] == 0 && grid[y + 2][x + 2] == 0 && grid[y][x + 2] == 0 && grid[y + 1][x + 2] == 0) {
                        return true;
                    }
                }
            }
        }
    }else if(orientation == 4) {
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                if(x + 2 < 10 && y + 2 < 10) {
                    if(grid[y][x] == 0 && grid[y][x + 1] == 0 && grid[y][x + 2] == 0 && grid[y + 1][x + 2] == 0 && grid[y + 2][x + 2] == 0) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}


function GridHasRoomFor(pieceSize) {
    if(pieceSize.x == 0 || pieceSize.y == 0) return false;
    for(let y = 0; y < 10; y++) {
        for(let x = 0; x < 10; x++) {
            let canPlace = true;
            for(let i = 0; i < pieceSize.x; i++) {
                for(let j = 0; j < pieceSize.y; j++) {
                    if(x + i >= 10 || y + j >= 10) {
                        canPlace = false;
                        break;
                    }
                    if(grid[y + j][x + i] > 0) {
                        canPlace = false;
                        break;
                    }
                }
                if(!canPlace) break;
            }
            if(canPlace) return true;
        }
    }
    return false;
}
function SpawnPieces(){
    for(let i = 1; i <= 3; i++) {
        let piece = pieces[Math.floor(Math.random() * pieces.length)].cloneNode(true);
        // let piece = pieces[(pieces.length - 3)].cloneNode(true);

        piece.setAttribute("id", "off" + i);
        if(piece.classList.toString().includes("piece3x3-1")) {
            let r = Math.floor(Math.random() * 4) + 1;
            if(r == 1) {//r
                piece.children[3].style.marginTop = "0%";
                piece.children[4].style.marginTop = "0%";
            }else if(r == 2) {//l
            
            }else if(r == 3) {//backwards l
                piece.children[0].style.marginLeft = "66.6666%";
                piece.children[1].style.marginLeft = "66.6666%";
            }else if(r == 4) {//backwards r
                piece.children[0].style.marginLeft = "66.6666%";
                piece.children[1].style.marginLeft = "66.6666%";
                piece.children[2].style.marginTop = "0%";
                piece.children[3].style.marginTop = "0%";
            }
            piece.setAttribute("name", r);
        }
        gameBoard.appendChild(piece);
    }
    CheckForGameOver();
}

function GetCookie(name) {
    let cookies = document.cookie.split(";");
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if(cookie.startsWith(name)) {
            return cookie.split("=")[1];
        }
    }
    return null;
}