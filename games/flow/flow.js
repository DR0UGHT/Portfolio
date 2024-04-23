var squares = [];
var circleStarts = [];
var width = 5;
var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];
var occupied = [];
var lastMousePos = {x: -1, y: -1};
var currentDrawPath = [];
var startCircle = {x: -1, y: -1};
var cancelDraw = false;
var finishedCircles = [];
var colorIndex = [];
var currentLevel = 1;
var maxLevel = 1;

window.onload = function() {
    let grid = document.querySelector('.grid');

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
        if(currentDrawPath.length > 1){
            var isLinePossible = IsLinePossible(x, y, currentDrawPath[currentDrawPath.length - 2].x, currentDrawPath[currentDrawPath.length - 2].y);
        }else if(currentDrawPath.length === 1){
            var isLinePossible = IsLinePossible(x, y, currentDrawPath[0].x, currentDrawPath[0].y);
        }else{
            var isLinePossible = false;
        }

        if(!circleStarts.includes(index) || (startCircle.x == x && startCircle.y == y) || !isLinePossible || neededColor !== foundColor || finishedCircles.includes(index)){
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

        finishedCircles.push(index);
        finishedCircles.push(startCircle.x + startCircle.y * width);
        startCircle.x = -1;
        startCircle.y = -1;
        cancelDraw = false;
        currentDrawPath = [];

        CheckForWin();
    });


    CookieLoad();

    //bind q to clear cookies
    window.addEventListener('keydown', function(e) {
        if(e.key === 'q'){
            document.cookie = 'maxLevel=1';
            location.reload();
        }
    });
}

function CookieLoad(){
    let cookie = document.cookie.split(';');
    cookie.forEach((element) => {
        let split = element.split('=');
        if(split[0] === 'maxLevel'){
            maxLevel = parseInt(split[1]);
        }
    });

    for(let i = 1; i <= maxLevel; i++){
        if(document.getElementById('lock' + i)) document.getElementById('lock' + i).style.display = 'none';
    }

    loadLevel(maxLevel);
}
function SetupBoard(size) {
    width = size;
    let grid = document.querySelector('.grid');
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${width}, 1fr)`;
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

}

function loadLevel(level) {
    if(level > maxLevel) return;

    document.querySelector('.level').innerText = 'Level ' + level;
    currentLevel = level;
    ResetBoard();
}
function ResetBoard() {
    occupied = [];
    finishedCircles = [];
    squares = [];
    startCircle = {x: -1, y: -1};
    currentDrawPath = [];
    cancelDraw = false;
    circleStarts = [];
    colorIndex = [];

    let grid = document.querySelector('.grid');
    grid.innerHTML = '';
    SetupBoard(currentLevel < 7 || currentLevel == 19 ? 5 : currentLevel < 13 ? 7 : currentLevel < 19 ? 10 : 12);
    switch(currentLevel){
        case 1:
            SetupLevel1();
            break;
        case 2:
            SetupLevel2();
            break;
        case 3:
            SetupLevel3();
            break;
        case 4:
            SetupLevel4();
            break;
        case 5:
            SetupLevel5();
            break;
        case 6:
            SetupLevel6();
            break;
        case 7:
            SetupLevel7();
            break;
        case 8:
            SetupLevel8();
            break;
        case 9:
            SetupLevel9();
            break;
        case 10:
            SetupLevel10();
            break;
        case 11:
            SetupLevel11();
            break;
        case 12:
            SetupLevel12();
            break;
        case 13:
            SetupLevel13();
            break;
        case 14:
            SetupLevel14();
            break;
        case 15:
            SetupLevel15();
            break;
        case 16:
            SetupLevel16();
            break;
        case 17:
            SetupLevel17();
            break;
        case 18:
            SetupLevel18();
            break;
        case 19:
            SetupLevel1();
            break;
    }
}
function lerpbase(a, b, t) {
    return a + (b - a) * t;
}

function lerp(a, b, t) {
    return Math.max(a, Math.min(b, lerpbase(a, b, t)));
}

function SetupLevel1() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 4, y: 4, color: 'blue'}, {x: 0, y: 1, color: 'red'}, {x: 3, y: 4, color: 'red'}, {x: 1, y: 1, color: 'yellow'}, {x: 3, y: 3, color: 'yellow'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel2() {
    for(const pos of [{x: 3, y: 0, color: 'blue'}, {x: 1, y: 3, color: 'blue'}, {x: 1, y: 0, color: 'red'}, {x: 2, y: 2, color: 'red'}, {x: 0, y: 0, color: 'yellow'}, {x: 4, y: 0, color: 'yellow'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel3() {
    for(const pos of [{x: 2, y: 1, color: 'blue'}, {x: 2, y: 3, color: 'blue'}, {x: 1, y: 1, color: 'red'}, {x: 3, y: 1, color: 'red'}, {x: 1, y: 3, color: 'yellow'}, {x: 3, y: 3, color: 'yellow'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel4() {
    for(const pos of [{x: 2, y: 1, color: 'blue'}, {x: 2, y: 3, color: 'blue'}, {x: 0, y: 2, color: 'red'}, {x: 4, y: 2, color: 'red'}, {x: 1, y: 3, color: 'yellow'}, {x: 4, y: 4, color: 'yellow'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel5() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 0, y: 4, color: 'blue'}, {x: 0, y: 1, color: 'red'}, {x: 0, y: 3, color: 'red'}, {x: 0, y: 2, color: 'yellow'}, {x: 2, y: 2, color: 'yellow'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel6() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 1, y: 4, color: 'blue'}, {x: 2, y: 0, color: 'red'}, {x: 1, y: 3, color: 'red'}, {x: 2, y: 1, color: 'yellow'}, {x: 2, y: 4, color: 'yellow'}, {x: 4, y: 0, color: 'purple'}, {x: 3, y: 3, color: 'purple'}, {x: 4, y: 1, color: 'orange'}, {x: 3, y: 4, color: 'orange'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel7() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 1, y: 5, color: 'blue'}, {x: 6, y: 0, color: 'teal'}, {x: 6, y: 5, color: 'teal'}, {x: 3, y: 3, color: 'red'}, {x: 4, y: 4, color: 'red'}, {x: 3, y: 4, color: 'yellow'}, {x: 4, y: 5, color: 'yellow'}, {x: 5, y: 1, color: 'orange'}, {x: 1, y: 4, color: 'orange'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel8() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 2, y: 4, color: 'blue'}, {x: 6, y: 0, color: 'teal'}, {x: 6, y: 6, color: 'teal'}, {x: 3, y: 3, color: 'red'}, {x: 4, y: 4, color: 'red'}, {x: 3, y: 4, color: 'yellow'}, {x: 4, y: 5, color: 'yellow'}, {x: 2, y: 5, color: 'orange'}, {x: 1, y: 4, color: 'orange'}, {x: 2, y: 2, color: 'purple'}, {x: 5, y: 5, color: 'purple'}, {x: 0, y: 3, color: 'pink'}, {x: 5, y: 6, color: 'pink'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel9() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 2, y: 4, color: 'blue'}, {x: 1, y: 1, color: 'red'}, {x: 3, y: 5, color: 'red'}, {x: 0, y: 1, color: 'lightgreen'}, {x: 3, y: 0, color: 'lightgreen'}, {x: 5, y: 1, color: 'pink'}, {x: 5, y: 5, color: 'pink'}, {x: 5, y: 2, color: 'purple'}, {x: 5, y: 6, color: 'purple'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

//same amount of pos as level 9, but randomize positions X and Y to a number between 0 and 6
function SetupLevel10() {
    for(const pos of [{x: 1, y: 3, color: 'blue'}, {x: 6, y: 3, color: 'blue'}, {x: 1, y: 1, color: 'red'}, {x: 1, y: 5, color: 'red'}, {x: 2, y: 1, color: 'lightgreen'}, {x: 2, y: 5, color: 'lightgreen'}, {x: 4, y: 1, color: 'pink'}, {x: 4, y: 6, color: 'pink'}, {x: 5, y: 1, color: 'purple'}, {x: 5, y: 5, color: 'purple'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 7].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 7);
        colorIndex.push({index: pos.x + pos.y * 7, color: pos.color});
    }            
}

//same amount of pos as level 9, but randomize positions X and Y to a number between 0 and 6
function SetupLevel11() {
    for(const pos of [{x: 1, y: 0, color: 'blue'}, {x: 1, y: 4, color: 'blue'}, {x: 0, y: 5, color: 'red'}, {x: 5, y: 5, color: 'red'}, {x: 2, y: 2, color: 'lightgreen'}, {x: 3, y: 5, color: 'lightgreen'}, {x: 5, y: 1, color: 'pink'}, {x: 5, y: 4, color: 'pink'}, {x: 2, y: 0, color: 'purple'}, {x: 0, y: 6, color: 'purple'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 7].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 7);
        colorIndex.push({index: pos.x + pos.y * 7, color: pos.color});
    }            
}

function SetupLevel12() {
    for(const pos of [{x: 1, y: 0, color: 'blue'}, {x: 4, y: 0, color: 'blue'}, {x: 5, y: 0, color: 'red'}, {x: 6, y: 2, color: 'red'}, {x: 3, y: 4, color: 'lightgreen'}, {x: 6, y: 6, color: 'lightgreen'}, {x: 4, y: 2, color: 'pink'}, {x: 5, y: 5, color: 'pink'}, {x: 1, y: 5, color: 'purple'}, {x: 5, y: 6, color: 'purple'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 7].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 7);
        colorIndex.push({index: pos.x + pos.y * 7, color: pos.color});
    }            
}   
function SetupLevel13() {
    for(const pos of [{x: 1, y: 1, color: 'blue'}, {x: 7, y: 1, color: 'blue'}, {x: 2, y: 4, color: 'red'}, {x: 5, y: 6, color: 'red'}, {x: 4, y: 3, color: 'yellow'}, {x: 5, y: 4, color: 'yellow'}, {x: 2, y: 3, color: 'pink'}, {x: 5, y: 5, color: 'pink'}, {x: 9, y: 4, color: 'green'}, {x: 9, y: 9, color: 'green'}, {x: 0, y: 3, color: 'purple'}, {x: 7, y: 4, color: 'purple'}, {x: 0, y: 4, color: 'teal'}, {x: 8, y: 7, color: 'teal'}, {x: 2, y: 6, color: 'orange'}, {x: 7, y: 5, color: 'orange'}, {x: 8, y: 1, color: 'brown'}, {x: 5, y: 3, color: 'brown'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}

function SetupLevel14() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 8, y: 9, color: 'blue'}, {x: 1, y: 4, color: 'red'}, {x: 6, y: 6, color: 'red'}, {x: 7, y: 2, color: 'yellow'}, {x: 5, y: 4, color: 'yellow'}, {x: 4, y: 3, color: 'pink'}, {x: 6, y: 5, color: 'pink'}, {x: 8, y: 6, color: 'green'}, {x: 9, y: 9, color: 'green'}, {x: 0, y: 2, color: 'purple'}, {x: 2, y: 1, color: 'purple'}, {x: 3, y: 5, color: 'teal'}, {x: 9, y: 7, color: 'teal'}, {x: 1, y: 6, color: 'orange'}, {x: 2, y: 8, color: 'orange'}, {x: 5, y: 2, color: 'brown'}, {x: 7, y: 3, color: 'brown'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * width].appendChild(circle);
        circleStarts.push(pos.x + pos.y * width);
        colorIndex.push({index: pos.x + pos.y * width, color: pos.color});
    }    
}
//all colors: red, blue, green, yellow, purple, orange, pink, brown, black, white, teal, lightorange, lightgreen, lightblue, lightred, lightpurple, lightpink, lightbrown, lightteal
function SetupLevel15() {
    for(const pos of [{x: 0, y: 1, color: 'blue'}, {x: 2, y: 1, color: 'blue'}, {x: 1, y: 1, color: 'red'}, {x: 5, y: 2, color: 'red'}, {x: 3, y: 2, color: 'teal'}, {x: 8, y: 2, color: 'teal'}, {x: 9, y: 0, color: 'yellow'}, {x: 9, y: 2, color: 'yellow'}, {x: 4, y: 2, color: 'green'}, {x: 7, y: 2, color: 'green'}, {x: 0, y: 2, color: 'white'}, {x: 1, y: 9, color: 'white'}, {x: 1, y: 5, color: 'pink'}, {x: 6, y: 2, color: 'pink'}, {x: 6, y: 7, color: 'brown'}, {x: 9, y: 9, color: 'brown'}, {x: 2, y: 6, color: 'orange'}, {x: 4, y: 8, color: 'orange'}, {x: 7, y: 5, color: 'teal'}, {x: 4, y: 7, color: 'teal'}, {x: 1, y: 3, color: 'darkblue'}, {x: 3, y: 6, color: 'darkblue'}, {x: 3, y: 4, color: 'darkred'}, {x: 8, y: 7, color: 'darkred'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 10].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 10);
        colorIndex.push({index: pos.x + pos.y * 10, color: pos.color});
    }    
}

function SetupLevel16() {
    for(const pos of [{x: 0, y: 5, color: 'blue'}, {x: 6, y: 4, color: 'blue'}, {x: 1, y: 1, color: 'red'}, {x: 1, y: 3, color: 'red'}, {x: 4, y: 1, color: 'teal'}, {x: 5, y: 9, color: 'teal'}, {x: 2, y: 4, color: 'yellow'}, {x: 6, y: 9, color: 'yellow'}, {x: 8, y: 9, color: 'green'}, {x: 9, y: 8, color: 'green'}, {x: 1, y: 7, color: 'white'}, {x: 2, y: 6, color: 'white'}, {x: 1, y: 4, color: 'pink'}, {x: 4, y: 5, color: 'pink'}, {x: 1, y: 8, color: 'brown'}, {x: 2, y: 5, color: 'brown'}, {x: 6, y: 8, color: 'tan'}, {x: 7, y: 7, color: 'tan'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 10].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 10);
        colorIndex.push({index: pos.x + pos.y * 10, color: pos.color});
    }
}

function SetupLevel17() {
    for(const pos of [{x: 9, y: 0, color: 'blue'}, {x: 2, y: 9, color: 'blue'}, {x: 9, y: 1, color: 'red'}, {x: 2, y: 8, color: 'red'}, {x: 9, y: 2, color: 'teal'}, {x: 6, y: 5, color: 'teal'}, {x: 5, y: 2, color: 'yellow'}, {x: 8, y: 2, color: 'yellow'}, {x: 3, y: 3, color: 'green'}, {x: 4, y: 5, color: 'green'}, {x: 7, y: 3, color: 'white'}, {x: 8, y: 4, color: 'white'}, {x: 6, y: 3, color: 'pink'}, {x: 8, y: 5, color: 'pink'}, {x: 3, y: 5, color: 'brown'}, {x: 6, y: 8, color: 'brown'}, {x: 5, y: 6, color: 'tan'}, {x: 8, y: 8, color: 'tan'}]) {
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 10].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 10);
        colorIndex.push({index: pos.x + pos.y * 10, color: pos.color});
    }
}


function SetupLevel18() {
    for(const pos of [{x: 0, y: 0, color: 'blue'}, {x: 0, y: 9, color: 'blue'}, {x: 2, y: 0, color: 'red'}, {x: 6, y: 3, color: 'red'}, {x: 9, y: 5, color: 'teal'}, {x: 5, y: 6, color: 'teal'}, {x: 1, y: 4, color: 'yellow'}, {x: 1, y: 9, color: 'yellow'}, {x: 2, y: 6, color: 'green'}, {x: 3, y: 9, color: 'green'}, {x: 2, y: 5, color: 'white'}, {x: 4, y: 9, color: 'white'}, {x: 3, y: 0, color: 'pink'}, {x: 4, y: 2, color: 'pink'}, {x: 4, y: 0, color: 'brown'}, {x: 9, y: 4, color: 'brown'}, {x: 6, y: 8, color: 'tan'}, {x: 9, y: 8, color: 'tan'}, {x: 2, y: 1, color: 'darkblue'}, {x: 9, y: 9, color: 'darkblue'}, {x: 5, y: 1, color: 'orange'}, {x: 7, y: 6, color: 'orange'}]) { 
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = pos.color;

        squares[pos.x + pos.y * 10].appendChild(circle);
        circleStarts.push(pos.x + pos.y * 10);
        colorIndex.push({index: pos.x + pos.y * 10, color: pos.color});
    }
}


function CheckForWin() {
    if(occupied.length + circleStarts.length === width * width){
        if(currentLevel === maxLevel){
            maxLevel = Math.min(maxLevel+1, 18);
            document.cookie = "maxLevel=" + maxLevel;


            if(document.getElementById('lock' + maxLevel))
            document.getElementById('lock' + maxLevel).style.display = 'none';
        }

        document.querySelector('.win').style.display = 'flex';
    }
}

function nextLevel(){
    if(currentLevel === maxLevel) return;
    document.querySelector('.win').style.display = 'none';

    if(currentLevel === 18) loadLevel(1);
    else loadLevel(currentLevel + 1);
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

        if(startCircle.x !== x || startCircle.y !== y){
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
    squares[x + y*width].appendChild(line);
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
    squares[x + y*width].appendChild(line);
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
    squares[x + y*width].appendChild(holder);
}