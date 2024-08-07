//current mouse position and last mouse position, to check if the user moved
var mousePos = { x: 0, y: 0 };
var lastMousePos = { x: 0, y: 0 };
var mouseDown = false;

//start radius of the circle to calculate the accuracy
var startRadius = 0;
var totalPoints = 0;
var currentAccuracy = 0;
var bestAccuracy = 0;
var lastAngle = -1;
var originalAngle = 0;

//all distances from the center of the circle
var allDistances = [];

window.onload = function() {
    //set mousePos to the percentage of "circle" div in the window
    window.onmousemove = function(e) { 
        const rect = document.getElementsByClassName("circle")[0].getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const x = Math.max(0, Math.min(1, mouseX / rect.width));
        const y = Math.max(0, Math.min(1, mouseY / rect.height));
        mousePos = { x: x * 100, y: y * 100 };
    }

    window.onmousedown = function() { 
        mouseDown = true; 


        startRadius = DistanceFromCenter(mousePos.x, mousePos.y);

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

/**
 * DrawCircle draws a circle on the screen
 * @returns nothing
*/
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


        var angle = Math.atan2(mousePos.y-50, mousePos.x-50) * 180 / Math.PI;

        if(originalAngle == 0){
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

/**
 * NewAngleTooClose checks if the new angle is too close to the last angle
 * @param {number} newAngle - the new angle
 * @returns {boolean} whether the new angle is too close to the last angle
*/
function NewAngleTooClose(newAngle) {
    return Math.abs(newAngle - lastAngle) < 1;
}

/**
 * NegativeAngle checks if the new angle is negative
 * @param {number} newAngle - the new angle
 * @returns {boolean} whether the new angle is negative
*/
function NegativeAngle(newAngle) {
    return newAngle < lastAngle
}

/**
 * MaxPointsReached checks if the user reached the maximum amount of points
 * @param {number} newAngle - the new angle
 * @returns {boolean} whether the user reached the maximum amount of points
*/
function MaxPointsReached(newAngle) {
    return lastAngle > 270 && newAngle < 45;
}

/**
 * UserMoved checks if the user moved
 * @returns {boolean} whether the user moved
*/
function UserMoved() {
    return (lastMousePos.x != mousePos.x || lastMousePos.y != mousePos.y) && mouseDown;
}

/**
 * UpdateAccuracy updates the accuracy of the user
 * @param {number} x - the x position of the mouse
 * @param {number} y - the y position of the mouse
 * @returns nothing
*/
function UpdateAccuracy(x, y) {
    allDistances.push(DistanceFromCenter(x, y));
    totalPoints++;
    let sum = 0;
    allDistances.forEach(distance => {
        //add to sum the percent difference between the distance from the center and the start radius
        sum += 100 - Math.abs(distance - startRadius) / startRadius * 100;
    });
    //average the sum
    currentAccuracy = lerp(0, 100, sum / totalPoints) / 100;
}

/**
 * DistanceFromCenter calculates the distance from the center of the circle
 * @param {number} x - the x position of the mouse
 * @param {number} y - the y position of the mouse
 * @returns {number} the distance from the center
*/
function DistanceFromCenter(x, y) {
    return Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
}

/**
 * DrawNewPoint draws a new point on the screen
 * @param {number} x - the x position of the mouse
 * @param {number} y - the y position of the mouse
 * @returns nothing
*/
function DrawNewPoint(x, y){
    var circle = document.createElement("div");
    circle.style.position = "absolute";
    circle.setAttribute("name", "circleDot");
    circle.style.width = "1vw";
    circle.style.height = "1vw";
    circle.style.borderRadius = "50%";

    circle.style.left = x + "%";
    circle.style.top = y + "%";

    var color = Math.floor(lerp(0, 255, Math.abs(DistanceFromCenter(x, y) - startRadius) / 5.0))

    circle.style.backgroundColor = "rgb(" + color + ", " + (255-color) + ", 0)";
    const circleContainer = document.getElementsByClassName("circle")[0];
    circleContainer.appendChild(circle);
}


/**
 * ClearScreen clears the screen of all points
 * @returns nothing
*/
function ClearScreen() {
    var elements = document.getElementsByName("circleDot");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

/**
 * lerp linearly interpolates between two values
 * @param {number} a - the first value
 * @param {number} b - the second value
 * @param {number} t - the percentage to interpolate
 * @returns {number} the interpolated value
*/
function lerp(a, b, t) {
    return a + (b - a) * t;
}


/**
 * degToRad converts degrees to radians
 * @param {number} deg - the degrees to convert
 * @returns {number} the radians
*/
function degToRad(deg) {
    return deg * (Math.PI / 180);
}


/**
 * NotGoodEnough displays a message to the user that they didn't draw a good enough circle
 * @returns nothing
*/
function NotGoodEnough() {
    document.getElementsByClassName("score2")[0].innerHTML = "Not circular enough! Try again!";
}

/**
 * ClearScore clears the score from the screen
 * @returns nothing
*/
function ClearScore() {
    document.getElementsByClassName("score2")[0].innerHTML = "";
}

/**
 * FinishedCircle displays the final score to the user
 * @returns nothing
*/
function FinishedCircle() {
    document.getElementsByClassName("score2")[0].innerHTML = "Accuracy: " + currentAccuracy.toFixed(2) + "%";
    document.getElementsByClassName("score1")[0].innerHTML = "Best Accuracy: " + bestAccuracy.toFixed(2) + "%";
}

/**
 * TooClose displays a message to the user that they are too close to the center
 * @param {number} x - the x position of the mouse
 * @param {number} y - the y position of the mouse
 * @returns {boolean} whether the user is too close to the center
*/
function TooClose(x, y){
    var distanceFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
    if(distanceFromCenter < 7.5){
        document.getElementsByClassName("score2")[0].innerHTML = "Too close to the center! Try again!";
        return true;
    }
    return false;
}


/**
 * DidntFinishCircle displays a message to the user that they didn't finish the circle
 * @returns nothing
*/
function DidntFinishCircle() {
    document.getElementsByClassName("score2")[0].innerHTML = "Didn't finish the circle!";
}