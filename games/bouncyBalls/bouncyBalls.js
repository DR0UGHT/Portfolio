var balls = [];
var ballCount = 5;
var gravity = .5;
var ballCollisions = 0;
var boundries = {
    top: 0,
    bottom: 100,
    left: 0,
    right: 100
}

var mouse = {
    x: 0,
    y: 0,
    last10: []
}


window.onload = function() {
    elem = document.getElementsByClassName("bouncyBalls")[0];

    for (var i = 0; i < ballCount; i++) {
        var ballElem = document.createElement("div");
        var ball = {
            x: Math.random() * 100,
            y: Math.random() * 50,
            dx: Math.random() * 2 - 1,
            upForce: 0.0,
            downForce: 0.4,
            color: "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")",
            radius: 5,
            maxHeight: 100,
            beingHeld: false,
            wasHeld: false,
            lastColidedWith: null,
            timeSinceColision: 0,
            mass: 1,
            htmlElement: ballElem
        }

        ballElem.style.position = "absolute";
        ballElem.style.width = ball.radius * 2 + "vmin"
        ballElem.style.height = ball.radius * 2 + "vmin"
        ballElem.style.borderRadius = "50%";
        ballElem.style.backgroundColor = ball.color;
        ballElem.style.left = ball.x + "%";
        ballElem.style.top = ball.y + "%";
        ballElem.style.transform = "translate(-50%, -50%)";
        balls.push(ball);
        elem.appendChild(ballElem);
    }

    //on mouse down on the ball, set beingHeld to true
    window.addEventListener("mousedown", function(e) {
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            var rect = ball.htmlElement.getBoundingClientRect();
            if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                ball.beingHeld = true;
                ball.wasHeld = true;
                return;
            }
        }
    });

    //on mouse up, set beingHeld to false
    window.addEventListener("mouseup", function(e) {
        for (var i = 0; i < balls.length; i++) {
            balls[i].beingHeld = false;
        }
    });

    //on mouse move, update the mouse position
    elem.addEventListener("mousemove", function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.last10.push({x: e.clientX, y: e.clientY});
        if(mouse.last10.length > 10){
            mouse.last10.shift();
        }
    });

    setInterval(update, 1000 / 60); 
    setInterval(checkBallCollisions, 1);
}

function update() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];

        if (ball.beingHeld) {
            HoldBall(ball);
            continue;
        }
        if(ball.wasHeld){
            ball.wasHeld = false;
            ThrowBall(ball);
        }
        //move the ball
        MoveBall(ball);
        //strict boundries
        StrictBoundries(ball);

        ball.htmlElement.style.left = ball.x + "%";
        ball.htmlElement.style.top = ball.y + "%";
    }
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}

function StrictBoundries(ball) {
    if(ball.y > boundries.bottom - ball.radius){
        ball.y = boundries.bottom - ball.radius;
    }
}
function ThrowBall(ball) {
    ball.dx = mouse.last10.reduce((acc, val, i, arr) => {
        if(i == 0){
            return acc;
        }
        return acc + (val.x - arr[i-1].x);
    }, 0) / mouse.last10.length / 10;
    let newUp = mouse.last10.reduce((acc, val, i, arr) => {
        if(i == 0){
            return acc;
        }
        return acc + (val.y - arr[i-1].y);
    }, 0) / -50;
    ball.downForce = 0.4;
    if(newUp > 0){
        ball.upForce = newUp;
    }else{
        ball.downForce = -newUp;
    }
}
function HoldBall(ball) {
    ball.x = (mouse.x / window.innerWidth) * 100;
    ball.y = (mouse.y / window.innerHeight) * 100;
    ball.dx = 0;
    ball.upForce = 0;
    ball.downForce = 0;
    ball.htmlElement.style.left = ball.x + "%";
    ball.htmlElement.style.top = ball.y + "%";
}
function MoveBall(ball) {
    ball.x += ball.dx;
    ball.y -= ball.upForce;
    ball.y += ball.downForce;

    ball.downForce += gravity / 10;
    if(ball.y >= boundries.bottom - ball.radius){
        ball.dx *= .98;
    }else{
        ball.dx *= .998;
    }
    ball.upForce = Math.max(0, ball.upForce * .98);

    if ((ball.x < boundries.left + ball.radius/2 && ball.dx < 0) || (ball.x > boundries.right - ball.radius/2 && ball.dx > 0)) {
        ball.dx *= -1;
    }

    if(ball.maxHeight > ball.y){
        ball.maxHeight = Math.max(Math.min(boundries.bottom, ball.y), 0);
    }
    if (ball.y >= boundries.bottom - ball.radius && ball.downForce > ball.upForce) {
        ball.upForce = lerp(5.0, 0.0, ball.maxHeight/100.0);
        console.log(ball.upForce);
        ball.maxHeight = boundries.bottom - ball.radius;
        ball.downForce = 0.2;

        if(ball.upForce < 0.5){
            ball.upForce = ball.downForce;
        }
    }
}
function checkBallCollisions() {
    let screenAspectRatio = window.innerWidth / window.innerHeight;
    for (let i = 0; i < balls.length; i++) {
        var ball1 = balls[i];
        for (let j = i + 1; j < balls.length; j++) {
            var ball2 = balls[j];
            
            // Calculate distance between centers of two balls
            let dx = ball2.x - ball1.x;
            let dy = (ball2.y - ball1.y) / screenAspectRatio;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 5.9) {
                handleCollision(ball1, ball2, dx, dy, distance);
            }
        }
    }
}


function handleCollision(ball1, ball2, dx, dy, distance) {
    ballCollisions++;

    let angle = Math.atan2(dy, dx);
    let overlap = 5.9 - distance;
    ball1.x -= overlap * Math.cos(angle);
    ball1.y -= overlap * Math.sin(angle);
    ball2.x += overlap * Math.cos(angle);
    ball2.y += overlap * Math.sin(angle);


    let v1 = Math.sqrt(ball1.dx * ball1.dx);
    let v2 = Math.sqrt(ball2.dx * ball2.dx);
    let g1 = Math.sqrt(ball1.downForce * ball1.downForce);
    let g2 = Math.sqrt(ball2.downForce * ball2.downForce);
    

    let totalVelocity = v1 + v2;
    let totalGravity = g1 + g2;

    let newV1 = ((totalVelocity / 2) + (totalGravity / 10))
    let newV2 = ((totalVelocity / 2) + (totalGravity / 10))

    let prevdx1 = ball1.dx;
    let prevdx2 = ball2.dx;

    //lose a bit of velocity
    newV1 *= .95;
    newV2 *= .95;

    ball1.dx = Math.cos(angle) * newV1;
    ball2.dx = Math.cos(angle) * newV2;

    if(prevdx1 < prevdx2){
        ball1.dx = Math.abs(ball1.dx);
        ball2.dx = -Math.abs(ball2.dx);
    }else{
        ball1.dx = -Math.abs(ball1.dx);
        ball2.dx = Math.abs(ball2.dx);
    }    
}
