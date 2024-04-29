var maxDots = 100;
var maxLinesPerDot = 5;
var maxLineLength = 200;
var dotSize = 5;
var lineWidth = 1;

var dots = [];

var canvas, ctx;

var mouse = {
    x: 0,
    y: 0,
    strength: 1000,
    maxAffectDistance: 400,
    lastBorder: -1
}
window.onload = function() {
    //create an empty 5x5 grid
    dotPools = Array(5).fill().map(() => Array(5).fill([]));
    canvas = document.getElementById("lineCanvas");
    ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for(var i = 0; i < maxDots; i++){
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 - 1,
            connections: []
        });
    }

    setInterval(DistanceCalc, 100);
    setInterval(Draw, 1000 / 60);
    setInterval(MoveDots, 1000 / 60);
    setInterval(MouseAction, 1000 / 60);
}

window.onmousemove = function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function Draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    for(var i = 0; i < dots.length; i++){
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dotSize, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth;
    for(var i = 0; i < dots.length; i++){
        for(var j = 0; j < dots[i].connections.length; j++){
            ctx.globalAlpha = 1 - (dots[i].connections[j][1] / maxLineLength);
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[dots[i].connections[j][0]].x, dots[dots[i].connections[j][0]].y);
            ctx.stroke();
        }
    }
}

function DistanceCalc(){
    for(var i = 0; i < dots.length; i++){
        dots[i].connections = [];
        for(var j = 0; j < dots.length; j++){
            if(i == j) continue;
            if(dots[i].connections.length >= maxLinesPerDot) break;
            
            var distance = QuickDistance(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
            if(distance < maxLineLength){
                dots[i].connections.push([j, distance]);
            }
        }
    }
}

function MoveDots(){
    for(var i = 0; i < dots.length; i++){
        dots[i].x += dots[i].dx;
        dots[i].y += dots[i].dy;
        
        if(dots[i].x < 0 && dots[i].lastBorder != 0){
            dots[i].lastBorder = 0;
            dots[i].dx *= -1;
        }else if(dots[i].x > canvas.width && dots[i].lastBorder != 1){
            dots[i].lastBorder = 1;
            dots[i].dx *= -1;
        }else if(dots[i].y < 0 && dots[i].lastBorder != 2){
            dots[i].lastBorder = 2;
            dots[i].dy *= -1;
        }else if(dots[i].y > canvas.height && dots[i].lastBorder != 3){
            dots[i].lastBorder = 3;
            dots[i].dy *= -1;
        }

        if(dots[i].x <= -20 || dots[i].x >= canvas.width + 20 || dots[i].y <= -20 || dots[i].y >= canvas.height + 20){
            dots[i].x = Math.random() * canvas.width;
            dots[i].y = Math.random() * canvas.height;
            DistanceCalc();
        }


    }
}

function MouseAction(){
    for(var i = 0; i < dots.length; i++){
        var distance = QuickDistance(dots[i].x, dots[i].y, mouse.x, mouse.y);
        if(distance < mouse.maxAffectDistance){
            //move dot away from mouse, the closer the dot the harder it is pushed
            var angle = Math.atan2(dots[i].y - mouse.y, dots[i].x - mouse.x);
            var force = mouse.strength / distance;
            dots[i].x += Math.cos(angle) * force;
            dots[i].y += Math.sin(angle) * force;
        }
    }
}

function QuickDistance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function updateMaxDots(value){
    if(value < maxDots){
        dots.splice(value, dots.length - value);
    }else{
        for(var i = maxDots; i < value; i++){
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: Math.random() * 2 - 1,
                dy: Math.random() * 2 - 1,
                connections: []
            });
        }
    }
    maxDots = value;
    document.getElementById("maxDotsLabel").innerHTML = value;
}

function updateDotSize(value){
    dotSize = value;
    document.getElementById("dotSizeLabel").innerHTML = value;
}

function updateLineWidth(value){
    lineWidth = value;
    document.getElementById("lineWidthLabel").innerHTML = value;
}

function updateMaxLineLength(value){
    maxLineLength = value;
    document.getElementById("maxLineLengthLabel").innerHTML = value;
}

function updateMaxLines(value){
    maxLinesPerDot = value;
    document.getElementById("maxLinesLabel").innerHTML = value;
}