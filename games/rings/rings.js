let grid = [];
let gameRings;
let maxColors = 4;
let ringsSpawned = 0;
let score = 0;
let lost = false;
window.onload = function() {
    grid = Array.from({length: 3}, () => Array.from({length: 3}, () => ['none', 'none', 'none']));
    gameRings = document.getElementById("gameRings");
    window.onmousedown = function(event) {
        if (event.target.classList.toString().includes("ringPlace") && !lost){
            dragElement(event.target);
        }
    }

    document.getElementById("highScoreValue1").innerText = GetCookie("highScore") == null ? "0" : GetCookie("highScore");

    ResetGame();
}

function ResetGame(){
    grid = Array.from({length: 3}, () => Array.from({length: 3}, () => ['none', 'none', 'none']));
    ringsSpawned = 0;
    score = 0;
    maxColors = 4;
    lost = false;
    document.getElementById("gameOver").style.display = "none";
    for(let i = 1; i <= 9; i++){
        let ring = document.getElementById("ring" + i);
        while(ring.children.length > 1){
            ring.children[1].remove();
        }
    }

    if(document.getElementById("ringHolder").children.length > 0){
        while(document.getElementById("ringHolder").children.length > 0){
            document.getElementById("ringHolder").children[0].remove();
        }
    }
    SpawnPiece();
}
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var elementFin = elmnt;
    elmnt.onmousedown = dragMouseDown;
    dragMouseDown();

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

        let elemLeft = parseInt(elementFin.style.left);
        //in html I transformed it down 35%, so I need to add that back in
        let elemTop = parseInt(elementFin.style.top) + (.4 * window.innerHeight);

        //if within the bounds of gameRings
        if (elemLeft > gameRings.offsetLeft-50 && elemLeft < gameRings.offsetLeft + gameRings.offsetWidth+50 && elemTop > gameRings.offsetTop-50 && elemTop < gameRings.offsetTop + gameRings.offsetHeight+50){
            //convert to grid coordinates, grid is 3x3
            let x = Clamp(Math.round((elemLeft - gameRings.offsetLeft) / (gameRings.offsetWidth / 3)), 0, 2);
            let y = Clamp(Math.round((elemTop - gameRings.offsetTop) / (gameRings.offsetHeight / 3)), 0, 2);
                   

            console.log(x, y);

            let rings = GetRings(elementFin);
            let hasInner = rings.map(x => x.pos).includes("inner");
            let hasMiddle = rings.map(x => x.pos).includes("middle");
            let hasOuter = rings.map(x => x.pos).includes("outer");

            elementFin.style.top = "";
            elementFin.style.left = "";

            if(grid[y][x][0] != "none" && hasInner){
                return;
            }else if(grid[y][x][1] != "none" && hasMiddle){
                return;
            }else if(grid[y][x][2] != "none" && hasOuter){
                return;
            }

            gameRings.children[y * 3 + x].appendChild(elementFin);

            if(hasInner){
                grid[y][x][0] = BorderColorToText(rings.find(x => x.pos == "inner").childIndex == -1 ? elementFin.style.border : elementFin.children[rings.find(x => x.pos == "inner").childIndex].style.border);
            }
            if(hasMiddle){
                grid[y][x][1] = BorderColorToText(rings.find(x => x.pos == "middle").childIndex == -1 ? elementFin.style.border : elementFin.children[rings.find(x => x.pos == "middle").childIndex].style.border);
            }
            if(hasOuter){
                grid[y][x][2] = BorderColorToText(rings.find(x => x.pos == "outer").childIndex == -1 ? elementFin.style.border : elementFin.children[rings.find(x => x.pos == "outer").childIndex].style.border);
            }


            elementFin.style.userSelect = "none";

            CheckForClears();
            SpawnPiece();
            console.log(grid);
        }else{
            elementFin.style.top = "";
            elementFin.style.left = "";
        }
    }
}

function Clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
}
function GetRings(element){
    let rings = [];
    if(element.children.length > 0){
        for(let i = 0; i < element.children.length; i++){
            if(element.children[i].getAttribute("id") == "innerRingPlace"){
                rings.push({pos: "inner", childIndex: i});
            }else if(element.children[i].getAttribute("id") == "middleRingPlace"){
                rings.push({pos: "middle", childIndex: i});
            }else if(element.children[i].getAttribute("id") == "outerRingPlace"){
                rings.push({pos: "outer", childIndex: i});
            }
        }
    }

    if(element.getAttribute("id") == "innerRingPlace"){
        rings.push({pos: "inner", childIndex: -1});
    }else if(element.getAttribute("id") == "middleRingPlace"){
        rings.push({pos: "middle", childIndex: -1});
    }else if(element.getAttribute("id") == "outerRingPlace"){
        rings.push({pos: "outer", childIndex: -1});
    }

    return rings;
}


function SpawnPiece(){
    let chanceOf1Ring = .75;
    let chanceOf2Rings = .2;

    let insideRing = false;
    let middleRing = false;
    let outsideRing = false;

    let piece = document.createElement("div");
    piece.classList.add("ringPlace");


    if(Math.random() < chanceOf1Ring){
        let ringChoice = Math.floor(Math.random() * 3);
        let ring = document.createElement("div");
        ring.style.border = "1.5vmin solid " + GetRandomColor();

        if(ringChoice == 0){
            ring.setAttribute("id", "innerRingPlace");
            insideRing = true;
        }else if(ringChoice == 1){
            ring.setAttribute("id", "middleRingPlace");
            middleRing = true;
        }else if(ringChoice == 2){
            ring.setAttribute("id", "outerRingPlace");
            outsideRing = true;
        }

        piece.appendChild(ring);
    }else if (Math.random() < chanceOf1Ring + chanceOf2Rings){
        let ringChoice = Math.floor(Math.random() * 3);
        let ring = document.createElement("div");
        ring.style.border = "1.5vmin solid " + GetRandomColor();

        if(ringChoice == 0){
            ring.setAttribute("id", "innerRingPlace");
            insideRing = true;
        }else if(ringChoice == 1){
            ring.setAttribute("id", "middleRingPlace");
            middleRing = true;
        }else if(ringChoice == 2){
            ring.setAttribute("id", "outerRingPlace");
            outsideRing = true;
        }

        piece.appendChild(ring);

        let ringChoice2 = Math.floor(Math.random() * 3);
        while(ringChoice2 == ringChoice){
            ringChoice2 = Math.floor(Math.random() * 3);
        }

        let ring2 = document.createElement("div");
        ring2.style.border = "1.5vmin solid " + GetRandomColor();

        if(ringChoice2 == 0){
            ring2.setAttribute("id", "innerRingPlace");
            insideRing = true;
        }else if(ringChoice2 == 1){
            ring2.setAttribute("id", "middleRingPlace");
            middleRing = true;
        }else if(ringChoice2 == 2){
            ring2.setAttribute("id", "outerRingPlace");
            outsideRing = true;
        }

        piece.appendChild(ring2);
    }else{
        let ring1 = document.createElement("div");
        let ring2 = document.createElement("div");
        let ring3 = document.createElement("div");

        ring1.style.border = "1.5vmin solid " + GetRandomColor();
        ring2.style.border = "1.5vmin solid " + GetRandomColor();
        ring3.style.border = "1.5vmin solid " + GetRandomColor();

        ring1.setAttribute("id", "innerRingPlace");
        ring2.setAttribute("id", "middleRingPlace");
        ring3.setAttribute("id", "outerRingPlace");

        piece.appendChild(ring1);
        piece.appendChild(ring2);
        piece.appendChild(ring3);

        insideRing = true;
        middleRing = true;
        outsideRing = true;
    }

    document.getElementById("ringHolder").appendChild(piece);

    ringsSpawned++;
    if(ringsSpawned % 20 == 0){
        maxColors++;
    }

    if(CheckForLoss(insideRing, middleRing, outsideRing)){
        lost = true;
        
        Lost();
    }
}

async function Lost(){
    await new Promise(r => setTimeout(r, 1000));
    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("scoreValue2").innerText = "Score: " + score;

    let highScore = GetCookie("highScore");
    if(highScore == null || score > highScore){
        document.getElementById("highScoreValue2").innerText = score;
        document.getElementById("highScoreValue1").innerText = score;
        document.cookie = "highScore=" + score + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }else if(document.getElementById("highScoreValue2").innerText == "0"){
        document.getElementById("highScoreValue2").innerText = highScore;
    }
}

function GetCookie(name){
    let cookie = document.cookie;
    let cookies = cookie.split(";");
    for(const c of cookies){
        if(c.includes(name)){
            return c.split("=")[1];
        }
    }

    return null;
}


function BorderColorToText(border){
    if(border.toString().includes("red")){
        return "red";
    }else if(border.toString().includes("blue")){
        return "blue";
    }else if(border.toString().includes("green")){
        return "green";
    }else if(border.toString().includes("yellow")){
        return "yellow";
    }else if(border.toString().includes("purple")){
        return "purple";
    }else if(border.toString().includes("orange")){
        return "orange";
    }else if(border.toString().includes("cyan")){
        return "cyan";
    }else if(border.toString().includes("pink")){
        return "pink";
    }   
}

function GetRandomColor(){
    let colors = ["red", "blue", "green", "yellow", "purple", "orange", "cyan", "pink"];
    return colors[Math.floor(Math.random() * maxColors)];
}


function CheckForClears(){
    let coloumsToClear = [];
    let rowsToClear = [];
    let diagonalsToClear = [];
    let stacksToClear = [];


    //check rows, columns, and diagonals for 3 in a row of inner, middle, or outer in any order
    for(let i = 0; i < 3; i++){
        let GetRow = GetThreeInRow(i);
        if(GetRow.length > 0){
            rowsToClear.push(GetRow);
        }

        let GetColumn = GetThreeInColumn(i);
        if(GetColumn.length > 0){
            coloumsToClear.push(GetColumn);
        }

        for(let j = 0; j < 3; j++){
            if(GetThreeInStack(grid[i][j])){
                stacksToClear.push({row: i, column: j});
            }
        }
    }

    let GetDiagonal = GetThreeInDiagonal();
    if(GetThreeInDiagonal().length > 0){
        diagonalsToClear.push(GetDiagonal);
    }

    for(const row of rowsToClear){
        for(const rowToClear of row){
            for(let i = 0; i < 3; i++){
                RemoveColorFromStack(rowToClear.row, i, rowToClear.color);
            }
        }
    }

    for(const column of coloumsToClear){
        for(const columnToClear of column){
            for(let i = 0; i < 3; i++){
                RemoveColorFromStack(i, columnToClear.column, columnToClear.color);
            }
        }
    }

    for(const diagonal of diagonalsToClear){
        for(const diagonalToClear of diagonal){
            if(diagonalToClear.diagonal == "topLeftToBottomRight"){
                for(let i = 0; i < 3; i++){
                    RemoveColorFromStack(i, i, diagonalToClear.color);
                }
            }else if(diagonalToClear.diagonal == "topRightToBottomLeft"){
                for(let i = 0; i < 3; i++){
                    RemoveColorFromStack(i, 2 - i, diagonalToClear.color);
                }
            }
        }
    }

    for(const stack of stacksToClear){
        grid[stack.row][stack.column] = ["none", "none", "none"];
        let ring = document.getElementById("ring" + (stack.row * 3 + stack.column + 1));
        while(ring.children.length > 1){
            ring.children[1].remove();
        }
        score += 50;
    }
    document.getElementById("scoreValue1").innerText = score;
}

function RemoveColorFromStack(x, y, color){
    let stack = grid[x][y];
    let colorsRemoved = 0;
    for(let i = 0; i < stack.length; i++){
        if(stack[i] == color){
            stack[i] = "none";
            colorsRemoved++;
        }
    }

    if(colorsRemoved == 0) return;
    if(colorsRemoved == 1) score+= 5;
    if(colorsRemoved == 2) score+= 25;
    if(colorsRemoved == 3) score+= 50;

    let ring = document.getElementById("ring" + ((x * 3 + y) + 1));
    if(ring.children.length == 1) return;
    let childrenToRemove = [];
    for(let i = 1; i < ring.children.length; i++){
        for(const child of ring.children[i].children){
            if(BorderColorToText(child.style.border) == color){
                childrenToRemove.push(child);
            }
        }

        if(ring.children[i].children.length == 0){
            childrenToRemove.push(ring.children[i]);
        }
    }

    for(const child of childrenToRemove){
        if(child != null && child != undefined) child.remove();
    }
}
function GetThreeInRow(row){
    let colorsToClear = [];
    for(let i = 0; i < 3; i++){
        let colorOfRing = grid[row][0][i];
        if(colorOfRing == "none") continue;

        if(StackContainsColor(grid[row][1], colorOfRing) && StackContainsColor(grid[row][2], colorOfRing)){
            colorsToClear.push({row: row, color: colorOfRing});
        }
    }

    return colorsToClear;
}

function GetThreeInColumn(column){
    let colorsToClear = [];
    for(let i = 0; i < 3; i++){
        let colorOfRing = grid[0][column][i];
        if(colorOfRing == "none") continue;

        if(StackContainsColor(grid[1][column], colorOfRing) && StackContainsColor(grid[2][column], colorOfRing)){
            colorsToClear.push({column: column, color: colorOfRing});
        }
    }

    return colorsToClear;
}

function GetThreeInDiagonal(){
    let colorsToClear = [];
    for(let i = 0; i < 3; i++){
        let colorOfRing = grid[0][0][i];
        if(colorOfRing == "none") continue;

        if(StackContainsColor(grid[1][1], colorOfRing) && StackContainsColor(grid[2][2], colorOfRing)){
            colorsToClear.push({diagonal: "topLeftToBottomRight", color: colorOfRing});
        }
    }

    for(let i = 0; i < 3; i++){
        let colorOfRing = grid[0][2][i];
        if(colorOfRing == "none") continue;

        if(StackContainsColor(grid[1][1], colorOfRing) && StackContainsColor(grid[2][0], colorOfRing)){
            colorsToClear.push({diagonal: "topRightToBottomLeft", color: colorOfRing});
        }
    }

    return colorsToClear;
}


function GetThreeInStack(stack){
    if(stack[0] == "none" || stack[1] == "none" || stack[2] == "none") return false

    return stack[0] == stack[1] && stack[1] == stack[2];
   
}


function StackContainsColor(stack, color){
    for(let i = 0; i < stack.length; i++){
        if(stack[i] == color){
            return true;
        }
    }

    return false;
}


function CheckForLoss(insideRing, middleRing, outsideRing){ 
    for(let x = 0; x < 3; x++){
        for(let y = 0; y < 3; y++){
            if((grid[y][x][0] == "none" || !insideRing) && (grid[y][x][1] == "none" || !middleRing) && (grid[y][x][2] == "none" || !outsideRing)){
                return false;
            }   
        }
    }

    return true;
}