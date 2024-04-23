var squares = [];
var circleStarts = [];
var width = 10;
var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];
var occupied = [];
var lastMousePos = {x: -1, y: -1};
var currentDrawPath = [];
var startCircle = {x: -1, y: -1};
var cancelDraw = false;
var finishedCircles = [];
var colorIndex = [];
window.onload = function() {

    let grid = document.querySelector('.grid');

    for (let i = 0; i < width * width; i++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.id = i;
        square.style.backgroundColor = 'black';
        square.style.width = '100%';
        square.style.height = '100%';
        square.style.border = '1px solid white';
        square.style.display = 'flex';
        square.style.justifyContent = 'center';
        square.style.alignItems = 'center';
        grid.appendChild(square);
        squares.push(square);
    }

    SetupLevel1();

    //on mouse move within grid, set mouse pos to grid square
    grid.addEventListener('mousemove', function(e) {
        //if not lmb down, return
        if(e.buttons !== 1 || cancelDraw) return;
        let x = Math.floor((e.clientX - grid.offsetLeft) / (grid.offsetWidth / width));
        let y = Math.floor((e.clientY - grid.offsetTop) / (grid.offsetHeight / width));

        x = Math.max(0, Math.min(width - 1, x));
        y = Math.max(0, Math.min(width - 1, y));

        let index = x + y * width;
        if(occupied.includes(index)) return;
        if(lastMousePos.x === x && lastMousePos.y === y) return;

        Draw(x, y);
    });

    window.addEventListener('mousedown', function(e) {
        let x = Math.floor((e.clientX - grid.offsetLeft) / (grid.offsetWidth / width));
        let y = Math.floor((e.clientY - grid.offsetTop) / (grid.offsetHeight / width));
        let index = x + y * width;
        if(!circleStarts.includes(index) || finishedCircles.includes(index)){
            cancelDraw = true;
            return;
        }

        startCircle.x = x;
        startCircle.y = y;

        Draw(x, y);
    });

    window.addEventListener('mouseup', function(e) {
        let x = Math.floor((e.clientX - grid.offsetLeft) / (grid.offsetWidth / width));
        let y = Math.floor((e.clientY - grid.offsetTop) / (grid.offsetHeight / width));
        let index = x + y * width;
        
        if(circleStarts.includes(startCircle.x + startCircle.y * width)) var neededColor = colorIndex.find((element) => element.index === startCircle.x + startCircle.y * width).color || 'none';
        else var neededColor = 'none';
        if(circleStarts.includes(x + y * width)) var foundColor = colorIndex.find((element) => element.index === x + y * width).color || 'none';
        else var foundColor = 'none';
        if(!circleStarts.includes(index) || (startCircle.x == x && startCircle.y == y) || (currentDrawPath.length > 2 && !IsLinePossible(x, y, currentDrawPath[currentDrawPath.length - 2].x, currentDrawPath[currentDrawPath.length - 2].y)) || neededColor !== foundColor || finishedCircles.includes(index)){
            currentDrawPath.forEach((point) => {
                RemoveLine(point.x, point.y);
                occupied.forEach((index) => {
                    if(circleStarts.includes(index)) return;
                    if(index === point.x + point.y * width){
                        occupied.splice(occupied.indexOf(index), 1);
                    }
                });
            });
            currentDrawPath = [];
            startCircle.x = -1;
            startCircle.y = -1;
            cancelDraw = false;

            return;
        }

        console.log('drawn');
        //check to see if we need to replace the last path with a corner
        finishedCircles.push(index);
        finishedCircles.push(startCircle.x + startCircle.y * width);
        startCircle.x = -1;
        startCircle.y = -1;
        cancelDraw = false;
        currentDrawPath = [];
    });
}

function lerpbase(a, b, t) {
    return a + (b - a) * t;
}

function lerp(a, b, t) {
    return Math.max(a, Math.min(b, lerpbase(a, b, t)));
}
function SetupLevel1() {
    for(const pos of [{x: 1, y: 1, color: 'blue'}, {x: 7, y: 1, color: 'blue'}, {x: 2, y: 4, color: 'red'}, {x: 5, y: 6, color: 'red'}, {x: 4, y: 3, color: 'yellow'}, {x: 5, y: 4, color: 'yellow'}, {x: 2, y: 3, color: 'pink'}, {x: 5, y: 5, color: 'pink'}, {x: 9, y: 4, color: 'green'}, {x: 9, y: 9, color: 'green'}, {x: 0, y: 3, color: 'purple'}, {x: 7, y: 4, color: 'purple'}, {x: 0, y: 4, color: 'teal'}, {x: 8, y: 7, color: 'teal'}, {x: 2, y: 6, color: 'orange'}, {x: 7, y: 5, color: 'orange'}, {x: 8, y: 1, color: 'brown'}, {x: 5, y: 3, color: 'brown'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        // squares[pos.x + pos.y * width].style.backgroundColor = 'white';

        // occupied.push(pos.x + pos.y * width);
        circleStarts.push(pos.x + pos.y * width);

        //push index position and its color
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function IsLinePossible(x1, y1, x2, y2) {
    if(x2 == x1){
        if(Math.abs(y1 - y2) == 1) return true;
    }else if(y2 == y1){
        if(Math.abs(x1 - x2) == 1) return true;
    }

    return false;
}

function Draw(x, y) {
    currentDrawPath.push({x: x, y: y});

    lastMousePos.x = x;
    lastMousePos.y = y;

    if(currentDrawPath.length > 1){
        if(!IsLinePossible(currentDrawPath[currentDrawPath.length - 2].x, currentDrawPath[currentDrawPath.length - 2].y, x, y)){
            let lastPos = currentDrawPath.pop();
            lastMousePos.x = lastPos.x;
            lastMousePos.y = lastPos.y;
            return;
        }
    }else{
        //check is line possible from start
    }
    if(occupied.includes(x + y * width)){
        currentDrawPath.pop();
        return;
    }

    let last = currentDrawPath[currentDrawPath.length - 1] || {x: -1, y: -1};
    let secondLast = currentDrawPath[currentDrawPath.length - 2] || {x: -1, y: -1};
    let thirdLast = currentDrawPath[currentDrawPath.length - 3] || {x: -1, y: -1};
    let color = colorIndex.find((element) => element.index === startCircle.x + startCircle.y * width).color;

    if(circleStarts.includes(x + y * width)){
        if(startCircle.x !== x || startCircle.y !== y){
            cancelDraw = true;
            if(color !== colorIndex.find((element) => element.index === x + y * width).color){
                return;
            }
        }

        if(startCircle.x !== x && startCircle.y !== y){
            let last = currentDrawPath[currentDrawPath.length - 1] || {x: -1, y: -1};
            if(last.x != secondLast.x){
                if(thirdLast.y < last.y && secondLast.x > last.x){
                    rotNeeded = 1;
                }else if(thirdLast.y > last.y && secondLast.x > last.x){
                    rotNeeded = 2;
                }else if (thirdLast.y < last.y && secondLast.x < last.x){
                    rotNeeded = 0;
                }else if (thirdLast.y > last.y && secondLast.x < last.x){
                    rotNeeded = 3;
                }else{
                    return;
                }
            }else if(last.y != secondLast.y){
                if(thirdLast.x < last.x && secondLast.y > last.y){
                    rotNeeded = 1;
                }else if(thirdLast.x > last.x && secondLast.y > last.y){
                    rotNeeded = 0;
                }else if (thirdLast.x < last.x && secondLast.y < last.y){
                    rotNeeded = 2;
                }else if (thirdLast.x > last.x && secondLast.y < last.y){
                    rotNeeded = 3;
                }else{
                    return;
                }
            }else{
                return;                    
            }
            RemoveLine(secondLast.x, secondLast.y, false);
            DrawLineCorner(secondLast.x, secondLast.y, color, rotNeeded);

        }
        return;

    }
    occupied.push(x + y * width);

    //using currentDrawPath, draw the current latest line, and see if it is horizontal or vertical, or corner

    if(thirdLast.x === -1 && thirdLast.y === -1){
        //we have 2 points
        if(secondLast.x === last.x) {
            DrawLineVertical(last.x, last.y, color);
        }else{
            DrawLineHorizontal(last.x, last.y, color);
        }
    }else{
        //we have 3 points
        if(last.x === secondLast.x) {
            if(secondLast.x === thirdLast.x) {
                DrawLineVertical(last.x, last.y, color);
            }else{
                //delete the second last line
                RemoveLine(secondLast.x, secondLast.y);
                //make a corner

                let rotNeeded = -1;
                if(last.y < secondLast.y){
                    if(thirdLast.x < secondLast.x){
                        rotNeeded = 1;//good
                    }else{
                        rotNeeded = 0;//good
                    }
                }else{
                    if(thirdLast.x < secondLast.x){
                        rotNeeded = 2;//good
                    }else{
                        rotNeeded = 3;//good
                    }
                }

                DrawLineCorner(secondLast.x, secondLast.y, color, rotNeeded);
                occupied.push(secondLast.x + secondLast.y * width);
                //make a new line
                DrawLineVertical(last.x, last.y, color);
            }
        }else{
            if(secondLast.y === thirdLast.y) {
                DrawLineHorizontal(last.x, last.y, color);
            }else{
                //delete the second last line
                RemoveLine(secondLast.x, secondLast.y);
                //make a corner


                let rotNeeded = -1
                if(last.x < secondLast.x){
                    if(thirdLast.y < secondLast.y){
                        rotNeeded = 1;//good
                    }else{
                        rotNeeded = 2;//good
                    }
                }else{
                    if(thirdLast.y < secondLast.y){
                        rotNeeded = 0;//good
                    }else{
                        rotNeeded = 3;//good
                    }
                }

                DrawLineCorner(secondLast.x, secondLast.y, color, rotNeeded);
                occupied.push(secondLast.x + secondLast.y * width);
                //make a new line
                DrawLineHorizontal(last.x, last.y, color);
            }
        }
    }
}
function RemoveLine(x, y, removeFromArray = true) {
    let index = x + y * width;
    if(!occupied.includes(index)) return;
    if(circleStarts.includes(index)) return;
    if(removeFromArray) occupied.splice(occupied.indexOf(index), 1);
    squares[index].innerHTML = '';
}

function DrawLineHorizontal(x, y, color) {
    let grid = document.querySelector('.grid');
    let line = document.createElement('div');
    line.classList.add('line');
    line.style.backgroundColor = color;
    line.style.width = '100%';
    line.style.height = '50%';
    line.style.position = 'relative';
    line.style.margin = '0';
    line.style.marginRight = '1%';
    squares[x + y*10].appendChild(line);
}

function DrawLineVertical(x, y, color) {
    let grid = document.querySelector('.grid');
    let line = document.createElement('div');
    line.classList.add('line');
    line.style.backgroundColor = color;
    line.style.width = '50%';
    line.style.height = '100%';
    line.style.position = 'relative';
    line.style.margin = '0';
    line.style.marginRight = '1%';
    squares[x + y*10].appendChild(line);
}

function DrawLineCorner(x, y, color, rot) {
    let grid = document.querySelector('.grid');
    let line = document.createElement('div');
    line.classList.add('line');
    line.style.backgroundColor = color;
    line.style.width = '50%';
    line.style.height = '50%';
    line.style.position = 'relative';
    line.style.margin = '0';
    line.style.marginRight = '-25%';
    line.style.borderRadius = '50%';

    let line2 = line.cloneNode(true);
    line2.style.borderRadius = '0%';
    line2.style.width = '50%';

    let line3 = line.cloneNode(true);
    line3.style.borderRadius = '0%';
    line3.style.height = '50%';
    line3.style.width = '50%';
    line3.style.marginTop = '-50%';
    line3.style.marginLeft = '-50%';

    let holder = document.createElement('div');
    holder.style.width = '100%';
    holder.style.height = '100%';
    holder.style.position = 'relative';
    holder.style.display = 'flex';
    holder.style.justifyContent = 'center';
    holder.style.alignItems = 'center';
    holder.appendChild(line);
    holder.appendChild(line2);
    holder.appendChild(line3);
    if(rot === 0){
        holder.style.marginLeft = '-25%';
        holder.style.transform = 'rotate(0deg)';
    }else if(rot === 1){
        holder.style.marginLeft = '0%';
        holder.style.marginTop = '25%';
        holder.style.transform = 'rotate(-90deg)';
    }else if(rot === 2){
        holder.style.marginRight = '-25%';
        holder.style.marginTop = '0%';
        holder.style.transform = 'rotate(-180deg)';
    }else if(rot === 3){
        holder.style.marginLeft = '0%';
        holder.style.marginTop = '-25%';
        holder.style.transform = 'rotate(-270deg)';
    }
    squares[x + y*10].appendChild(holder);
}