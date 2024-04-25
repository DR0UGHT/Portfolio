const INTERACTION_RADIUS = 50;
const MOUSE_FORCE = 0.1;
const DECAY = 0.999;
const GRAVITY = 0.1;
const MAX_DIST = 70;
const NORMAL_DIST = 50;

var clothCanvas;
let clothSizeX = 10;
let clothSizeY = 10;
//double array of cloth points
var clothPoints = [];

var mouse = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    down: false
};

window.onload = function() {
    clothCanvas = document.getElementById("clothCanvas");
    clothCanvas.width = clothSizeX * 50;
    clothCanvas.height = clothSizeY * 50;
    clothCanvas.style.width = "50vw";
    clothCanvas.style.height = "50vw";
    clothCanvas.style.position = "relative";
    clothCanvas.style.top = "0px";
    clothCanvas.style.left = "0px";
    clothCanvas.style.zIndex = "-1";
    

    AddClothPoints();

    DrawCloth();
    DtawClothLines();

    let physics = setInterval(function() {
        ClothPhysicsWithGravity();
        DrawCloth();
        DtawClothLines();
    }, 1000);
}

window.onmousemove = function(e) {
    if(e.clientX == mouse.lastX && e.clientY == mouse.lastY) return;

    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;

    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.onmousedown = function(e) {
    mouse.down = true;
}

window.onmouseup = function(e) {
    mouse.down = false;
}

function AddClothPoints() {
    for (var i = 0; i < clothSizeX; i++) {
        let row = []
        for (var j = 0; j < clothSizeY; j++) {
            var point = {
                x: i,
                y: j,
                lastX: i,
                lastY: j,
                originalX: i,
                originalY: j,
                dx: 0,
                dy: 0,
                locked: j == 0
            };

            row.push(point);
        }
        clothPoints.push(row);
    }

    console.log(clothPoints);
}

function DrawCloth() {
    var ctx = clothCanvas.getContext("2d");
    ctx.clearRect(0, 0, clothCanvas.width, clothCanvas.height);
    for (var i = 0; i < clothPoints.length; i++) {
        var row = clothPoints[i];

        for (var j = 0; j < row.length; j++) {
            var point = row[j];

            ctx.beginPath();
            ctx.arc(point.x * 50, point.y * 50, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function DtawClothLines() {
    var ctx = clothCanvas.getContext("2d");

    for (var i = 0; i < clothPoints.length; i++) {
        var row = clothPoints[i];

        for (var j = 0; j < row.length; j++) {
            var point = row[j];

            if (i > 0) {
                var pointAbove = clothPoints[i - 1][j];
                ctx.beginPath();
                ctx.moveTo(point.x * 50, point.y * 50);
                ctx.lineTo(pointAbove.x * 50, pointAbove.y * 50);
                ctx.stroke();
            }

            if (j > 0) {
                var pointLeft = clothPoints[i][j - 1];
                ctx.beginPath();
                ctx.moveTo(point.x * 50, point.y * 50);
                ctx.lineTo(pointLeft.x * 50, pointLeft.y * 50);
                ctx.stroke();
            }
        }
    }
}




function ClothPhysicsWithGravity() {
    for (var i = 0; i < clothPoints.length; i++) {
        var row = clothPoints[i];

        for (var j = 0; j < row.length; j++) {
            var point = row[j];

            if (point.locked) {
                point.x = point.originalX;
                point.y = point.originalY;
                continue;
            }

            //Gravity and mouse force
            var forceX = 0.0;
            var forceY = 0.0;

            if(mouse.down && dist(mouse.x, mouse.y, point.x, point.y) < INTERACTION_RADIUS) {
                forceX = mouse.x - mouse.lastX;
                forceY = mouse.y - mouse.lastY;
            }

            point.dy +=  (point.y - point.lastY) * DECAY + (MOUSE_FORCE/100) * forceY;
            point.dx +=  (point.x - point.lastX) * DECAY + (MOUSE_FORCE/100) * forceX;

            point.lastX = point.x;
            point.lastY = point.y;

            point.x += point.dx;
            point.y += point.dy + GRAVITY;
            //link points
            var pointAbove = (clothPoints[i + 1] ? clothPoints[i + 1][j] : null);
            var pointLeft = clothPoints[i][j - 1] ? clothPoints[i][j - 1] : null;
            var pointRight = clothPoints[i][j + 1] ? clothPoints[i][j + 1] : null;

            if(i == 0) console.log("pointAbove: " + pointAbove.y);
            if(pointAbove != null) {
                var dx = pointAbove.x - point.x;
                var dy = pointAbove.y - point.y;

                var distAbove = Math.sqrt(dx * dx + dy * dy);
                if(distAbove * 50 >= MAX_DIST) {
                    console.log("distAbove: " + distAbove);
                    var difference = (NORMAL_DIST - distAbove) / distAbove;
                    var offsetX = dx * difference * 0.5;
                    var offsetY = dy * difference * 0.5;

                    if(!pointAbove.locked) {
                        pointAbove.x += offsetX;
                        pointAbove.y += offsetY;
                    }
                    
                    point.x -= offsetX;
                    point.y -= offsetY;
                }
            }


        }
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

