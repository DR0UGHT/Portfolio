var mouse = {
    x: 0, 
    y: 0,
    needUpdate: false
};
var canvas, ctx, width, height, maxDist;
var showDebug = true;
var currTime = 0;
var shouldMove = true;
var obstacles = [

]

var lights = [
    {color: "rgba(255, 255, 111, 1)", x: .5, y: .5, radius: .4, path: [{x: 0, y: .40}, {x: 1, y: .40}]},
    {color: "rgba(255, 255, 111, 1)", x: .5, y: .5, radius: .4, path: [{x: 1, y: .40}, {x: 0, y: .40}]},

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
        [{x: width * 0.7, y: height * 0.7}, {x: width * 0.8, y: height * 0.7}, {x: width * 0.8, y: height * 0.8}, {x: width * 0.7, y: height * 0.8}],
        [{x: width * 0.2, y: height * 0.2}, {x: width * 0.3, y: height * 0.2}, {x: width * 0.3, y: height * 0.3}, {x: width * 0.2, y: height * 0.3}],
        [{x: width * 0.4, y: height * 0.6}, {x: width * 0.5, y: height * 0.6}, {x: width * 0.5, y: height * 0.7}, {x: width * 0.4, y: height * 0.7}]
    ];

    maxDist = Math.sqrt(width * width + height * height) / 2;
    DrawObstacles();

    setInterval(UpdateVisibility, 1000 / 60);
}
    
window.addEventListener('keydown', function(e) {
    if(e.key == " ") {
        showDebug = !showDebug;
    }else if (e.key == "q") {
        shouldMove = !shouldMove;
    }else if(e.key == "ArrowRight") {
        UpdateVisibility();
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
        [{x: width * 0.7, y: height * 0.7}, {x: width * 0.8, y: height * 0.7}, {x: width * 0.8, y: height * 0.8}, {x: width * 0.7, y: height * 0.8}],
        [{x: width * 0.2, y: height * 0.2}, {x: width * 0.3, y: height * 0.2}, {x: width * 0.3, y: height * 0.3}, {x: width * 0.2, y: height * 0.3}],
        [{x: width * 0.4, y: height * 0.6}, {x: width * 0.5, y: height * 0.6}, {x: width * 0.5, y: height * 0.7}, {x: width * 0.4, y: height * 0.7}]
    ];
}

function UpdateVisibility() {
    // if(!mouse.needUpdate) return;
    ctx.clearRect(0, 0, width, height);
    for(let i = 0; i < lights.length; i++) {
        DrawLight(i);
        MoveLight(i);
        // DrawShadow(i);
    }
    DrawObstacles();

}

function DrawShadows() {
    //draw a line from mouse to GetFirstEar(obstacle)
    for(let x = 0; x < lights.length; x++) {
        let lightXPixel = lights[x].x * width;
        let lightYPixel = lights[x].y * height;
        for(let i = 0; i < obstacles.length; i++) {
            let ears = ComputeSupportPointsFrom(obstacles[i], lightXPixel, lightYPixel);
                
            if(ears.length < 2) continue;
            
            //get the two ears that are the furthest away in angle from the mouse
            let firstEar = ears[0];
            let lastEar = ears[ears.length - 1];
            for(let i = 0; i < ears.length; i++) {
                let ear = ears[i];
                if(Math.atan2(ear.y - lightYPixel, ear.x - lightXPixel) < Math.atan2(firstEar.y - lightYPixel, firstEar.x - lightXPixel)) {
                    firstEar = ear;
                    continue;
                }

                if(Math.atan2(ear.y - lightYPixel, ear.x - lightXPixel) > Math.atan2(lastEar.y - lightYPixel, lastEar.x - lightXPixel)) {
                    lastEar = ear;
                }
            }

            ctx.fillStyle = "rgb(62, 62, 62)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(firstEar.x, firstEar.y);
            //move 1000 away from mouse position
            ctx.lineTo(lightXPixel + (firstEar.x - lightXPixel) * 1000, lightYPixel + (firstEar.y - lightYPixel) * 1000);
            ctx.lineTo(lightXPixel + (lastEar.x - lightXPixel) * 1000, lightYPixel + (lastEar.y - lightYPixel) * 1000);
            ctx.lineTo(lastEar.x, lastEar.y);
            ctx.closePath();
            ctx.fill();

            if(showDebug) {
                ctx.strokeStyle = "red";
                //draw line from mouse to first ear and last ear
                for(let i = 0; i < ears.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(lightXPixel, lightYPixel);
                    ctx.lineTo(ears[i].x, ears[i].y);
                    ctx.stroke();
                }
            }
        }
    }
}


function DrawShadow(index) {
    //draw a line from mouse to GetFirstEar(obstacle)
    for(let i = 0; i < obstacles.length; i++) {
        let lightXPixel = lights[index].x * width;
        let lightYPixel = lights[index].y * height;
        let ears = ComputeSupportPointsFrom(obstacles[i], lightXPixel, lightYPixel);
            
        if(ears.length < 2) continue;
        
        //get the two ears that are the furthest away in angle from the mouse
        let firstEar = ears[0].point;
        let lastEar = ears[ears.length - 1].point;
        for(let i = 0; i < ears.length; i++) {
            let ear = ears[i].point;
            if(Math.atan2(ear.y - lightYPixel, ear.x - lightXPixel) < Math.atan2(firstEar.y - lightYPixel, firstEar.x - lightXPixel)) {
                firstEar = ear;
                continue;
            }

            if(Math.atan2(ear.y - lightYPixel, ear.x - lightXPixel) > Math.atan2(lastEar.y - lightYPixel, lastEar.x - lightXPixel)) {
                lastEar = ear;
            }
        }

        ctx.fillStyle = "rgb(62, 62, 62)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(firstEar.x, firstEar.y);
        let distanceFromSource = Math.sqrt((lightXPixel - firstEar.x) * (lightXPixel - firstEar.x) + (lightYPixel - firstEar.y) * (lightYPixel - firstEar.y));
        let neededDistanceToMax = maxDist - distanceFromSource;

        if(neededDistanceToMax < 0) continue;
        //move 1000 away from mouse position
        ctx.lineTo(lightXPixel + (firstEar.x - lightXPixel) * neededDistanceToMax, lightYPixel + (firstEar.y - lightYPixel) * neededDistanceToMax);
        ctx.lineTo(lightXPixel + (lastEar.x - lightXPixel) * neededDistanceToMax, lightYPixel + (lastEar.y - lightYPixel) * neededDistanceToMax);
        ctx.lineTo(lastEar.x, lastEar.y);
        ctx.closePath();
        ctx.fill();

        if(showDebug) {
            ctx.strokeStyle = "red";
            //draw line from mouse to first ear and last ear
            for(let i = 0; i < ears.length; i++) {
                ctx.beginPath();
                ctx.moveTo(lightXPixel, lightYPixel);
                ctx.lineTo(ears[i].point.x, ears[i].point.y);
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
            supports.push({obstacle: obstacle, point: obstacle[j]});
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

function supportLineIntersectsObstacleWhich(x, y, supportX, supportY, fromObstacle) {
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
                    return ob;
                }
               }
            }
        }
    return null;
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

function MoveLight(index) {
    if(!shouldMove) return;
    currTime += 0.0025;
    let light = lights[index];
    if(currTime < 1){
        light.x = Lerp(light.path[0].x, light.path[1].x, currTime);
        light.y = Lerp(light.path[0].y, light.path[1].y, currTime);
    }else if(currTime < 2){
        light.x = Lerp(light.path[1].x, light.path[0].x, currTime - 1);
        light.y = Lerp(light.path[1].y, light.path[0].y, currTime - 1);
    }else{
        currTime = 0;
    }
}

function Lerp(a, b, t) {
    return Math.max(0, Math.min(1, t)) * (b - a) + a;
}


function DrawLight(index) {
    let allEars = [];
    let light = lights[index];
    
    let lightXPixel = light.x * width;
    let lightYPixel = light.y * height;

    const gradient =    ctx.createRadialGradient(light.x * width, light.y * height, 0, light.x * width, light.y * height, light.radius * width);

    gradient.addColorStop(0, light.color);
    gradient.addColorStop(1, light.color.slice(0, -2) + "0)");

    for(i = 0; i < obstacles.length; i++) {
        let ears = GetSupportPointsFrom(obstacles[i], lightXPixel, lightYPixel);
        allEars.push(ears.first);
        allEars.push(ears.last);
    }



    allEars.sort((a, b) => {
        return Math.atan2(a.point.y - lightYPixel, a.point.x - lightXPixel) - Math.atan2(b.point.y - lightYPixel, b.point.x - lightXPixel);
    });

    //shift first element to the end
    allEars.push(allEars.shift());
    finishers = [];
    for(let i = 0; i < allEars.length; i++) {
        let firstEar = allEars[i];
        let lastEar = allEars[(i + 1) % allEars.length];

        let firstEarClips = LineIntersectsWithAnyObstacle(lightXPixel, lightYPixel, firstEar.point.x, firstEar.point.y);
        let lastEarClips = LineIntersectsWithAnyObstacle(lightXPixel, lightYPixel, lastEar.point.x, lastEar.point.y);

        if(firstEarClips && lastEarClips) {
            continue;
        }else if(firstEarClips) {  
            let clippedObstacle = supportLineIntersectsObstacleWhich(lightXPixel, lightYPixel, firstEar.point.x, firstEar.point.y, firstEar.obstacle);
            let clippedRays = GetAllRaysHittingObstacle(allEars, clippedObstacle);

            let closestAngle = 0;
            for(let j = 1; j < clippedRays.length; j++) {
                let currAngle = (Math.atan2(clippedRays[j].y - lightYPixel, clippedRays[j].x - lightXPixel) + Math.PI * 2) % (Math.PI * 2);
                let closestAngle = (Math.atan2(clippedRays[closestAngle].y - lightYPixel, clippedRays[closestAngle].x - lightXPixel) + Math.PI * 2) % (Math.PI * 2);
                if(currAngle < closestAngle) {
                    closestAngle = j;
                }
            }

            let theClosestAngle = Math.atan2(clippedRays[closestAngle].y - lightYPixel, clippedRays[closestAngle].x - lightXPixel);
            let currentDistance = Math.sqrt((firstEar.point.x - lightXPixel) * (firstEar.point.x - lightXPixel) + (firstEar.point.y - lightYPixel) * (firstEar.point.y - lightYPixel));
            allEars[i].point = {x: lightXPixel + Math.cos(theClosestAngle) * currentDistance, y: lightYPixel + Math.sin(theClosestAngle) * currentDistance};
            finishers.push({first: clippedRays[0], last: clippedRays[1]});
        }else if(lastEarClips) {
            let clippedObstacle = supportLineIntersectsObstacleWhich(lightXPixel, lightYPixel, lastEar.point.x, lastEar.point.y, lastEar.obstacle);
            let clippedRays = GetAllRaysHittingObstacle(allEars, clippedObstacle);
        
            let closestAngle = 0;
            for(let j = 1; j < clippedRays.length; j++) {
                if(Math.atan2(clippedRays[j].y - lightYPixel, clippedRays[j].x - lightXPixel) < Math.atan2(clippedRays[closestAngle].y - lightYPixel, clippedRays[closestAngle].x - lightXPixel)) {
                    closestAngle = j;
                }
            }

            let theClosestAngle = Math.atan2(clippedRays[closestAngle].y - lightYPixel, clippedRays[closestAngle].x - lightXPixel);
            let currentDistance = Math.sqrt((lastEar.point.x - lightXPixel) * (lastEar.point.x - lightXPixel) + (lastEar.point.y - lightYPixel) * (lastEar.point.y - lightYPixel));
            

            allEars[(i + 1) % allEars.length].point = {x: lightXPixel + Math.cos(theClosestAngle) * currentDistance, y: lightYPixel + Math.sin(theClosestAngle) * currentDistance};
            finishers.push({first: clippedRays[0], last: clippedRays[1]});
        }else if(firstEar.obstacle == lastEar.obstacle){
            finishers.push({first: firstEar, last: lastEar});
        }else{
            let angleToFirstEar = Math.atan2(firstEar.point.y - lightYPixel, firstEar.point.x - lightXPixel);
            let angleToLastEar = Math.atan2(lastEar.point.y - lightYPixel, lastEar.point.x - lightXPixel);
            ctx.beginPath();
            ctx.moveTo(lightXPixel, lightYPixel);
            ctx.arc(lightXPixel, lightYPixel, light.radius * width, angleToFirstEar, angleToLastEar, false);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    for(let i = 0; i < finishers.length; i++) {
        let firstEar = finishers[i].first;
        let lastEar = finishers[i].last;

        ctx.beginPath();
        ctx.moveTo(firstEar.point.x, firstEar.point.y);
        ctx.lineTo(lightXPixel, lightYPixel);
        ctx.lineTo(lastEar.point.x, lastEar.point.y);
        ctx.closePath();
        ctx.fill();
    }

    //loop through all obstacles, if both support points arnt blocked, draw a triangle between the light and the support points

    if(showDebug) {
        ctx.strokeStyle = "red";
        //draw line from mouse to first ear and last ear
        for(let i = 0; i < allEars.length; i++) {
            ctx.beginPath();
            ctx.moveTo(lightXPixel, lightYPixel);
            ctx.lineTo(allEars[i].point.x, allEars[i].point.y);
            ctx.stroke();
        }
    }
}

function GetAllRaysHittingObstacle(ears, obstacle) {
    let rays = [];
    for(let i = 0; i < ears.length; i++) {
        let ear = ears[i];

        if(ear.obstacle == obstacle) {
            rays.push(ear);
        }
    }

    return rays;
}
        

function GetClosestAngle(ears, closestToNotIncluding){
    let closest = ears[0];
    for(let i = 0; i < ears.length; i++) {
        if(i == closestToNotIncluding) continue;
        if(Math.atan2(ears[i].y - mouse.y, ears[i].x - mouse.x) < Math.atan2(closest.y - mouse.y, closest.x - mouse.x)) {
            closest = ears[i];
        }
    }

    return closest;
}

function LineIntersectsWithAnyObstacle(x1, y1, x2, y2) {
    for(let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        for(let j = 0; j < o.length; j++) {
            let v1 = o[j];
            let v2 = o[(j + 1) % o.length];
            if(IntersectsLine(x1, y1, x2, y2, v1.x, v1.y, v2.x, v2.y)) {
                return true;
            }
        }
    }

    return false;
}


function GetSupportPointsFrom(obstacle, x, y) {
    let ears = ComputeSupportPointsFrom(obstacle, x, y);
        
    //get the two ears that are the furthest away in angle from the mouse
    let firstEar = ears[0];
    let lastEar = ears[ears.length - 1];
    for(let i = 0; i < ears.length; i++) {
        let ear = ears[i];
        if(Math.atan2(ear.point.y - y, ear.point.x - x) < Math.atan2(firstEar.point.y - y, firstEar.point.x - x)) {
            firstEar = ear;
            continue;
        }

        if(Math.atan2(ear.point.y - y, ear.point.x - x) > Math.atan2(lastEar.point.y - y, lastEar.point.x - x)) {
            lastEar = ear;
        }
    }

    return {first: firstEar, last: lastEar};
}

function CenterOfObstacleInTriangle(x1, y1, x2, y2, x3, y3) {
    for(let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        let center = GetCenterOfObstacle(o);
        if(PointInTriangle(center.x, center.y, x1, y1, x2, y2, x3, i)) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
            console.log("center of obstacle in triangle");
            return true;
        }
    }

    return false;
}

function GetCenterOfObstacle(obstacle) {
    let x = 0;
    let y = 0;
    for(let i = 0; i < obstacle.length; i++) {
        x += obstacle[i].x;
        y += obstacle[i].y;
    }

    return {x: x / obstacle.length, y: y / obstacle.length};
}
function AnyObstacleInTriangle(x1, y1, x2, y2, x3, y3) {
    for(let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        for(let j = 0; j < o.length; j++) {
            let v = o[j];
            if(PointInTriangle(v.x, v.y, x1, y1, x2, y2, x3, y3)) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(v.x, v.y, 10, 0, Math.PI * 2);
                ctx.fill();
                console.log("center of obstacle in triangle");
                return o;
            }
        }
    }
    return null;
}

//px, py is the point to check if it is inside the triangle
function PointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
    var b1, b2, b3;

    b1 = Math.sign((px - x1) * (y2 - y1) - (x2 - x1) * (py - y1)) < 0;
    b2 = Math.sign((px - x2) * (y3 - y2) - (x3 - x2) * (py - y2)) < 0;
    b3 = Math.sign((px - x3) * (y1 - y3) - (x1 - x3) * (py - y3)) < 0;

    return ((b1 == b2) && (b2 == b3));
}

function DrawCursorLight(){
    if(MouseInsideObstacle()) return;
    const gradient =    ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, maxDist/4);

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

//this function is called and
function Raycast(x, y, rad, dist) {
    let x1 = x;
    let y1 = y;
    let x2 = Math.cos(rad) * dist + x;
    let y2 = Math.sin(rad) * dist + y;

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