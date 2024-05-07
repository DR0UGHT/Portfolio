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

}


window.onmousemove = function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

function ResetGame() {
    grid = Array.from({length: 10}, () => Array.from({length: 10}, () => 0));
    let allPieces = document.getElementsByClassName("piece");
    for(let i = 0; i < allPieces.length; i++) {
        if(allPieces[i].id != "template") allPieces[i].remove();
    }
    score = 0;
    document.getElementById("scoreValue").innerText = "0";
    document.getElementById("gameOver").style.display = "none";
    lost = false;
    SpawnPieces();
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var elementFin = element;
    element.onmousedown = dragMouseDown;

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
        elementFin.setAttribute("id", "");

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
        console.log(elemLeft, elemTop);
        //if mouse is over gameBoard, then place the piece
        if (elemLeft > -25 && elemLeft < gameBoard.clientWidth + 25 && elemTop > -25 && elemTop < gameBoard.clientHeight + 25) {
            elemLeft = Clamp(elemLeft, 0, gameBoard.clientWidth);
            elemTop = Clamp(elemTop, 0, gameBoard.clientHeight);

            let pieceMinX = Math.round(Lerp(0, 10, elemLeft / parseFloat(gameBoard.clientWidth)));
            let pieceMaxX = pieceMinX + parseInt(elementFin.classList.toString().split("piece")[1].split("x")[1]);

            let pieceMinY = Math.round(Lerp(0, 10, elemTop / parseFloat(gameBoard.clientHeight)));
            let pieceMaxY = pieceMinY + parseInt(elementFin.classList.toString().split("piece")[1].split("x")[0]);

            console.log(pieceMinX, pieceMaxX, pieceMinY, pieceMaxY);

            if(pieceMaxX > 10 || pieceMinX < 0 || pieceMaxY > 10 || pieceMinY < 0) {
                ResetElement(elementFin);
                return;
            }

            
            for(let x = pieceMinX; x < pieceMaxX; x++) {
                for(let y = pieceMinY; y < pieceMaxY; y++) {
                    if(grid[y][x] > 0) {
                        ResetElement(elementFin);
                        return;
                    }
                }
            }

            let childCount = 0;
            for(let x = pieceMinX; x < pieceMaxX; x++) {
                for(let y = pieceMinY; y < pieceMaxY; y++) {
                    console.log(x, y);
                    grid[y][x] = 1;
                    elementFin.children[childCount++].setAttribute("id", "gridDelete" + x + "x" + y);
                    score++;
                }
            }

            document.getElementById("scoreValue").innerText = score;

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
                console.log(element.id);
                element.remove();
            }
        }
    }

    for(let i = 0; i < columns.length; i++) {
        for(let y = 0; y < 10; y++) {
            grid[y][columns[i]] = 0;
            let element = document.getElementById("gridDelete" + columns[i] + "x" + y);
            if(element != null) {
                console.log(element.id);
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
    let piece1 = document.getElementById("off1") || null;
    let piece2 = document.getElementById("off2") || null;
    let piece3 = document.getElementById("off3") || null;

    let piece1Size = {x: 0, y: 0};
    let piece2Size = {x: 0, y: 0};
    let piece3Size = {x: 0, y: 0};

    if(piece1 != null) piece1Size = {x: parseInt(piece1.classList.toString().split("piece")[1].split("x")[1]), y: parseInt(piece1.classList.toString().split("piece")[1].split("x")[0])};
    if(piece2 != null) piece2Size = {x: parseInt(piece2.classList.toString().split("piece")[1].split("x")[1]), y: parseInt(piece2.classList.toString().split("piece")[1].split("x")[0])};
    if(piece3 != null) piece3Size = {x: parseInt(piece3.classList.toString().split("piece")[1].split("x")[1]), y: parseInt(piece3.classList.toString().split("piece")[1].split("x")[0])};

    if(!GridHasRoomFor(piece1Size) && !GridHasRoomFor(piece2Size) && !GridHasRoomFor(piece3Size)) {
        Lost();
    }
}

async function Lost() {
    await new Promise(r => setTimeout(r, 1000));

    document.getElementById("gameOver").style.display = "flex";
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
    let piece1 = pieces[Math.floor(Math.random() * pieces.length)];
    let pieceClone1 = piece1.cloneNode(true);
    pieceClone1.setAttribute("id", "off1");
    gameBoard.appendChild(pieceClone1);

    let piece2 = pieces[Math.floor(Math.random() * pieces.length)];
    let pieceClone2 = piece2.cloneNode(true);
    pieceClone2.setAttribute("id", "off2");
    gameBoard.appendChild(pieceClone2);

    let piece3 = pieces[Math.floor(Math.random() * pieces.length)];
    let pieceClone3 = piece3.cloneNode(true);
    pieceClone3.setAttribute("id", "off3");
    gameBoard.appendChild(pieceClone3);
}