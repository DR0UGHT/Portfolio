var mousePos = { x: 0, y: 0 };
var lastMousePos = { x: 0, y: 0 };
var mouseDown = false;
var startRadius = 0;
var allDistances = [];
var totalPoints = 0;
var currentAccuracy = 0;
var bestAccuracy = 0;
var lastAngle = -1;
var originalAngle = 0;

window.onload = function() {
    window.onmousemove = function(e) { mousePos = { x: (e.clientX / window.innerWidth).toFixed(3) * 100, y: (e.clientY / window.innerHeight).toFixed(3) * 100 }; }
    window.onmousedown = function() { 
        mouseDown = true; 

        xPosToScreenPercent = (mousePos.x / window.innerWidth) * 100;
        yPosToScreenPercent = (mousePos.y / window.innerHeight) * 100;

        startRadius = Math.sqrt(Math.pow(xPosToScreenPercent - 50, 2) + Math.pow(yPosToScreenPercent - 50, 2));

        if(currentAccuracy > bestAccuracy) {
            bestAccuracy = currentAccuracy;
        }

        allDistances = [];
        totalPoints = 0;
        currentAccuracy = 0;
        lastAngle = -1;
        originalAngle = 0;

        ClearScreen();
        ClearScore();

        DrawCircle();

    }
    window.onmouseup = function() { 
        mouseDown = false; 
    }
}

function DrawCircle() {
    //interval 10ms
    var interval = setInterval(function() {
        //if we finished the circle, stop drawing points
        if(!mouseDown){
            DidntFinishCircle();
            ClearScreen();
            clearInterval(interval);
            return;
        }
        
        //if the user didn't move, don't draw a point
        if(!UserMoved()) return;
        if(TooClose(mousePos.x, mousePos.y)){
            ClearScreen();
            clearInterval(interval);
            return;
        }


        var angle = Math.atan2(mousePos.y - 50, mousePos.x - 50) * 180 / Math.PI;
        if(originalAngle == 0){
            startRadius = Math.sqrt(Math.pow(mousePos.x - 50, 2) + Math.pow(mousePos.y - 50, 2));
            originalAngle = angle;
        }
        angle -= originalAngle;
        if(angle < 0) angle += 360;

        if(MaxPointsReached(angle)){
            clearInterval(interval); 
            if(currentAccuracy > bestAccuracy){
                bestAccuracy = currentAccuracy;
            }
            FinishedCircle();
            return;
        }


        //if the new angle is too close to the last angle, don't draw a point
        if(NewAngleTooClose(angle)) return;
        if(NegativeAngle(angle)){
            NotGoodEnough();
            ClearScreen();
            clearInterval(interval);
            return;
        }
        //set last angle to the new angle
        lastAngle = angle;

        //set mouse position x and y to the last mouse position x and y
        lastMousePos.x = mousePos.x;
        lastMousePos.y = mousePos.y;

        //draw a new point
        DrawNewPoint(mousePos.x, mousePos.y);
        //update the accuracy
        UpdateAccuracy(mousePos.x, mousePos.y);       
    }, 10);
}

function NewAngleTooClose(newAngle) {
    return Math.abs(newAngle - lastAngle) < 1;
}

function NegativeAngle(newAngle) {
    return newAngle < lastAngle
}

function MaxPointsReached(newAngle) {
    return lastAngle > 270 && newAngle < 45;
}
function UserMoved() {
    return (lastMousePos.x != mousePos.x || lastMousePos.y != mousePos.y) && mouseDown;
}
function UpdateAccuracy(x, y) {
    let distanceFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
    allDistances.push(distanceFromCenter);
    totalPoints++;
    currentAccuracy = allDistances.reduce((a, b) => a + (b / startRadius) * 100, 0) / totalPoints;
}

function DrawNewPoint(x, y){
    var circle = document.createElement("div");
    circle.style.position = "absolute";
    circle.id = "circle";
    circle.style.width = "1%";
    circle.style.height = "1%";
    circle.style.borderRadius = "50%";

    circle.style.left = x + "%";
    circle.style.top = y + "%";
    circle.style.transform = "translate(-50%, -50%)";

    var distFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
    var color = Math.floor(lerp(0, 255, Math.abs(distFromCenter - startRadius) / 5.0));

    circle.style.backgroundColor = "rgb(" + color + ", " + (255-color) + ", 0)";
    document.body.appendChild(circle);

    delete circle;
    delete distFromCenter;
}

function ClearScreen() {
    var circles = document.querySelectorAll("#circle");
    circles.forEach(circle => {
        document.body.removeChild(circle);
    });
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}


function NotGoodEnough() {
    document.getElementsByClassName("score2")[0].innerHTML = "Not circular enough! Try again!";
}

function ClearScore() {
    document.getElementsByClassName("score2")[0].innerHTML = "";
}

function FinishedCircle() {
    document.getElementsByClassName("score2")[0].innerHTML = "Accuracy: " + currentAccuracy.toFixed(2) + "%";
    document.getElementsByClassName("score1")[0].innerHTML = "Best Accuracy: " + bestAccuracy.toFixed(2) + "%";
}

function TooClose(x, y){
    var distanceFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
    if(distanceFromCenter < 7.5){
        document.getElementsByClassName("score2")[0].innerHTML = "Too close to the center! Try again!";
        return true;
    }
    return false;
}

function DidntFinishCircle() {
    document.getElementsByClassName("score2")[0].innerHTML = "Didn't finish the circle!";
}