var mouse = {
    x: 0, 
    y: 0,
    needUpdate: false
};
var canvas, ctx, width, height, maxDist;
var showDebug = false;

var obstacles = [

]

window.onload = function() {
    //raycast from middle to mouse
    canvas = document.getElementById("shadowCanvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    width = canvas.width;
    height = canvas.height;

    obstacles = [
        [{x: 0, y: height - 200}, {x: width, y: height - 200}, {x: width, y: height}, {x: 0, y: height}],
        [{x: width * 0.2, y: height * 0.2}, {x: width * 0.3, y: height * 0.2}, {x: width * 0.3, y: height * 0.3}, {x: width * 0.2, y: height * 0.3}],
        [{x: width * 0.7, y: height * 0.7}, {x: width * 0.8, y: height * 0.7}, {x: width * 0.8, y: height * 0.8}, {x: width * 0.7, y: height * 0.8}]
    ];

    maxDist = Math.sqrt(width * width + height * height) / 2;
    DrawObstacles();

    setInterval(UpdateVisibility, 1000 / 60);
}
    
window.addEventListener('keydown', function(e) {
    if(e.key == " ") {
        showDebug = !showDebug;
        ctx.clearRect(0, 0, width, height);
        DrawLight();
        DrawShadows();
        DrawObstacles();
    }
});

window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.needUpdate = true;
});


window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    width = canvas.width;
    height = canvas.height;

    maxDist = Math.sqrt(width * width + height * height) /2;

    obstacles = [
        [{x: 0, y: height - 200}, {x: width, y: height - 200}, {x: width, y: height}, {x: 0, y: height}],
        [{x: width * 0.2, y: height * 0.2}, {x: width * 0.3, y: height * 0.2}, {x: width * 0.3, y: height * 0.3}, {x: width * 0.2, y: height * 0.3}],
        [{x: width * 0.7, y: height * 0.7}, {x: width * 0.8, y: height * 0.7}, {x: width * 0.8, y: height * 0.8}, {x: width * 0.7, y: height * 0.8}]
    ];
}

function UpdateVisibility() {
    if(!mouse.needUpdate) return;
    ctx.clearRect(0, 0, width, height);

    DrawLight();
    DrawShadows();
    DrawObstacles();

    mouse.needUpdate = false;
}

function DrawShadows() {
    //draw a line from mouse to GetFirstEar(obstacle)
    for(let i = 0; i < obstacles.length; i++) {
        let ears = ComputeSupportPointsFrom(obstacles[i], mouse.x, mouse.y);
            
        if(ears.length < 2) continue;
        
        //get the two ears that are the furthest away in angle from the mouse
        let firstEar = ears[0];
        let lastEar = ears[ears.length - 1];
        for(let i = 0; i < ears.length; i++) {
            let ear = ears[i];
            if(Math.atan2(ear.y - mouse.y, ear.x - mouse.x) < Math.atan2(firstEar.y - mouse.y, firstEar.x - mouse.x)) {
                firstEar = ear;
                continue;
            }

            if(Math.atan2(ear.y - mouse.y, ear.x - mouse.x) > Math.atan2(lastEar.y - mouse.y, lastEar.x - mouse.x)) {
                lastEar = ear;
            }
        }

        ctx.fillStyle = "rgb(62, 62, 62)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(firstEar.x, firstEar.y);
        //move 1000 away from mouse position
        ctx.lineTo(mouse.x + (firstEar.x - mouse.x) * 1000, mouse.y + (firstEar.y - mouse.y) * 1000);
        ctx.lineTo(mouse.x + (lastEar.x - mouse.x) * 1000, mouse.y + (lastEar.y - mouse.y) * 1000);
        ctx.lineTo(lastEar.x, lastEar.y);
        ctx.closePath();
        ctx.fill();

        if(showDebug) {
            ctx.strokeStyle = "red";
            //draw line from mouse to first ear and last ear
            for(let i = 0; i < ears.length; i++) {
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(ears[i].x, ears[i].y);
                ctx.stroke();
            }
        }
    }
}

//returns the support points of the obstacle
function ComputeSupportPointsFrom(obstacle, x, y) {
    var supports = [];
    
    for(let j = 0; j < obstacle.length; j++) {
        if(!supportLineIntersectsSelf(x, y, obstacle[j].x, obstacle[j].y, obstacle)) {
            supports.push(obstacle[j]);
        }
    }
    return supports;
}

//see if the line intersects with any of the obstacles
function supportLineIntersectsObstacle(x, y, supportX, supportY, fromObstacle) {
    for(const ob of obstacles) {
        for(let i = 0; i < ob.length; i++) {
            var v1 = ob[i];
            var v2 = ob[(i + 1) % ob.length];

            //if fromObstacle is not the same as the obstacle we are checking
            if(fromObstacle != ob) {
                if(x == v1.x && y == v1.y && supportX == v2.x && supportY == v2.y) return true;
                if(x == v2.x && y == v2.y && supportX == v1.x && supportY == v1.y) return true;
            }

            if(!((x == v1.x) && (y == v1.y)) && !((x == v2.x) && (y == v2.y)) && 
               !((supportX == v1.x) && (supportY == v1.y)) && !((supportX == v2.x) && (supportY == v2.y))){
                if(linesIntersect(x, y, supportX, supportY, v1.x, v1.y, v2.x, v2.y)) {
                    return true;
                }
               }
            }
        }
    return false;
}

function supportLineIntersectsSelf(x, y, supportX, supportY, fromObstacle) {
    for(let i = 0; i < fromObstacle.length; i++) {
        var v1 = fromObstacle[i];
        var v2 = fromObstacle[(i + 1) % fromObstacle.length];

        if(x == v1.x && y == v1.y && supportX == v2.x && supportY == v2.y) return true;
        if(x == v2.x && y == v2.y && supportX == v1.x && supportY == v1.y) return true;

        if(!((x == v1.x) && (y == v1.y)) && !((x == v2.x) && (y == v2.y)) && !((supportX == v1.x) && (supportY == v1.y)) && !((supportX == v2.x) && (supportY == v2.y))) {
            if(linesIntersect(x, y, supportX, supportY, v1.x, v1.y, v2.x, v2.y)) {
                return true;
            }
        }
    }

    return false;
}


function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}


function DrawLight() {
    if(MouseInsideObstacle()) return;
    const gradient =    ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, maxDist);

    gradient.addColorStop(0, "rgba(255, 250, 215, 1)");
    gradient.addColorStop(1, "rgba(255, 250, 215, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function MouseInsideObstacle() {
    for(let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        if(PointInsideObstacle(mouse.x, mouse.y, o)) {
            return true;
        }
    }
    return false;
}

function PointInsideObstacle(x, y, obstacle) {
    var inside = false;
    for(let i = 0, j = obstacle.length - 1; i < obstacle.length; j = i++) {
        var xi = obstacle[i].x, yi = obstacle[i].y;
        var xj = obstacle[j].x, yj = obstacle[j].y;

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if(intersect) inside = !inside;
    }

    return inside;
}
function DrawObstacles() {
    //draw obstacles
    ctx.fillStyle = "green";
    for(let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        ctx.beginPath();
        ctx.moveTo(o[0].x, o[0].y);
        for(let j = 1; j < o.length; j++) {
            ctx.lineTo(o[j].x, o[j].y);
        }
        ctx.closePath();
        ctx.fill();
    }
}
function Raycast(x, y, rad) {
    let x1 = x;
    let y1 = y;
    let x2 = Math.cos(rad) * maxDist + x;
    let y2 = Math.sin(rad) * maxDist + y;

    for(let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        if(IntersectsLine(x1, y1, x2, y2, o.x, o.y, o.x + o.width, o.y) ||
            IntersectsLine(x1, y1, x2, y2, o.x + o.width, o.y, o.x + o.width, o.y + o.height) ||
            IntersectsLine(x1, y1, x2, y2, o.x + o.width, o.y + o.height, o.x, o.y + o.height) ||
            IntersectsLine(x1, y1, x2, y2, o.x, o.y + o.height, o.x, o.y)) {
            return true;
        }
    }

    return false;
}


function IntersectsLine(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}