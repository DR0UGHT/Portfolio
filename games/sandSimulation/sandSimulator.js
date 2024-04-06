//arrays
const sandColors = ["rgba(0, 0, 0, 0)", "#c2b280", "#b3a67d", "#a69b7a", "#978f77", "#888472", "#797868", "#6a6d65", "#5b6162", "#4c555f", "#3d4a5c", "#2e3e59", "#1f3356", "#102754", "#002c51"];

var sandArray = [];
var sandArrayOptimizerX = [];
var sandArrayOptimizerY = [];
var sandArrayOptimizerWasTrue = [];
var sandLineObject = [];

//array size
const sandArrayWidth = 600;
const sandArrayHeight = 600;

//need to update the sand visual
var needRedraw = false;

//keep track of mouse position and click
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

//current color of sand
var sandColorIndex = 0;
//tallest sand in the array
var tallestSand = sandArrayHeight - 1;
//how many sand particles are in the array
var sandCount = 0;
//kill the simualtion
var killSim = false;

window.onload = function(){
    //create the sand array X
    for(var i = 0; i < sandArrayWidth; i++){
        sandArray[i] = [];
        sandArrayOptimizerX[i] = 0;
        sandArrayOptimizerY[i] = 0;
        sandArrayOptimizerWasTrue[i] = 0;
        sandLineObject[i] = document.createElement("div");
        
        //what percent of the screen is the sand array, per column
        const percentNext = 100 / sandArrayWidth;

        //create the sand array Y
        for(var j = 0; j < sandArrayHeight; j++){
            sandArray[i][j] = 0;

            var percent = percentNext * j;
        }

        //give the info to html
        sandLineObject[i].id = "sandLineObject" + i;
        document.getElementsByClassName("sandContent")[0].appendChild(sandLineObject[i]);
    }

    //bind the mouse to droppeing sand
    document.body.onmousedown = function() { mouseDown = true;}
    document.body.onmouseup = function() { mouseDown = false; sandColorIndex = (sandColorIndex + 1) % sandColors.length; if(sandColorIndex == 0) sandColorIndex = 1;}
    document.body.onmousemove = function(e){
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    //start the sand update loop
    //wait 2 seconds before starting the sand drop
    setTimeout(function(){
        DropSand();
        GetSandCount();
    }, 2000);
    
}



/**
 * Retrieves the count of sand particles and updates the HTML element with the count.
 */
function GetSandCount(){
    setInterval(function(){
        sandCount = sandArray.reduce((acc, val) => acc + val.reduce((acc2, val2) => acc2 + (val2 > 0 ? 1 : 0), 0), 0);
        document.getElementsByClassName("sandCount")[0].innerHTML = "Sand Count: " + sandCount;
    }
    , 1000);

}

/**
 * Drops sand at the current mouse position.
 * If the mouse is still down after 10ms, another sand is dropped.
 */
function DropSand(){

    //wait 10ms, if mouse is still down, drop another sand
    var interval = setInterval(function(){
        //if mouse is still down
        if(mouseDown){   
            var x = Math.floor(mouseX / (window.innerWidth / sandArrayWidth));
            var y = Math.floor(mouseY / (window.innerHeight / sandArrayHeight));
            
            //create a 20x20 square of sand to drop
            var count = 0;
            for(var xM = -10; xM < 10; xM++){
                for(var yM = -10; yM < 10; yM++){
                    if(x + xM >= 0 && x + xM < sandArrayWidth && y + yM >= 0 && y + yM < sandArrayHeight && sandArray[x + xM][y] == 0){
                        sandArray[x + xM][y + yM] = sandColorIndex;
                        sandArrayOptimizerX[x + xM]++;
                        sandArrayOptimizerX[y + yM]++;

                        count++;
                    }
                }
            }

            //set the tallest sand to optimize the sand update
            if(y < tallestSand){
                tallestSand = y;
            }

            //update the sand visual
            UpdateSandUpgraded();
        }else{
            if(killSim){
                clearInterval(interval);
                return;
            }

            //update the sand visual
            UpdateSandUpgraded();
        }
    }, 1);
}


/**
 * Updates the sand simulation with an upgraded algorithm.
 * The sand will now trickle down optimally.
 * The sand will now move left or right if the left or right is empty.
 * The sand will now move to the bottom if the left and right are not empty.
 */
function UpdateSandUpgraded(){
    needRedraw = false;

    peaks = GetPeaksAndTroughs();

    //loop through the peaks and make the sand trickle down optimally
    for(var xx = 0; xx < peaks.length-2; xx++){
        for(var i = peaks[xx+1]; i >= peaks[xx]; i--){
            if(sandArrayOptimizerX[i] == 0 && sandArrayOptimizerWasTrue[i] == 0 && !mouseDown){
                continue;
            }
            for(var j = sandArrayHeight - 1; j >= 0; --j){
                if(sandArray[i][j] > 0 && sandArray[i][j] < sandColors.length){
                    if(j + 1 < sandArrayHeight){
                        if(sandArray[i][j + 1] == 0){
                            sandArray[i][j + 1] = sandArray[i][j];
                            sandArray[i][j] = 0;

                            sandArrayOptimizerY[j]--;
                            sandArrayOptimizerY[j + 1]++;

                            needRedraw = true;
                        }else{
                            var rand = Math.floor(Math.random() * 2);
                            if(rand == 0){
                                if(TryDropSandLeft(i, j)){
                                    
                                }else if(TryDropSandRight(i, j)){

                                }else{//if the left and right are not empty, set sand to the bottom
                                    KillSand(i, j);
                                }

                            }else{
                                if(TryDropSandRight(i, j)){

                                }else if(TryDropSandLeft(i, j)){

                                }else{//if the left and right are not empty, set sand to the bottom
                                    KillSand(i, j);
                                }
                            }
                        }
                    }else{
                        KillSand(i, j);
                    }
                }
            }
        }   

        for(var i = peaks[xx+1]+1; i < peaks[xx+2]; i++){
            if(sandArrayOptimizerX[i] == 0 && sandArrayOptimizerWasTrue[i] == 0 && !mouseDown){
                continue;
            }
            for(var j = sandArrayHeight - 1; j >= 0; --j){
                if(sandArray[i][j] > 0 && sandArray[i][j] < sandColors.length){
                    if(j + 1 < sandArrayHeight){
                        if(sandArray[i][j + 1] == 0){
                            sandArray[i][j + 1] = sandArray[i][j];
                            sandArray[i][j] = 0;

                            sandArrayOptimizerY[j]--;
                            sandArrayOptimizerY[j + 1]++;

                            needRedraw = true;
                        }else{
                            var rand = Math.floor(Math.random() * 2);
                            if(rand == 0){
                                if(TryDropSandLeft(i, j)){

                                }else if(TryDropSandRight(i, j)){

                                }else{//if the left and right are not empty, set sand to the bottom
                                    KillSand(i, j);
                                }

                            }else{
                                if(TryDropSandRight(i, j)){

                                }else if(TryDropSandLeft(i, j)){

                                }else{//if the left and right are not empty, set sand to the bottom
                                    KillSand(i, j);
                                }
                            }
                        }
                    }else{
                        KillSand(i, j);
                    }
                }
            }
        }  


    }

    //if the tallest sand is not at the bottom, move it down
    if(!DoesRowHaveSand(tallestSand) && tallestSand < sandArrayHeight - 1){
        tallestSand = Math.min(tallestSand+1, sandArrayHeight - 1);
    }

    //if the sand needs to be redrawn, redraw it
    if(needRedraw){
        ReDraw();
    }
}

/**
 * Checks if a row has sand.
 * @param {number} row The row to check.
 * @returns {boolean} True if the row has sand, false otherwise.
*/
function DoesRowHaveSand(row){
    for(var i = 0; i < sandArrayWidth; i++){
        if(sandArray[i][row] != 0){
            return true;
        }
    }
    return false;
}

/**
 * Gets the peaks and troughs of the sand.
 * @returns {number[]} The peaks and troughs of the sand.
 * The peaks and troughs are the points where the sand is at its highest and lowest.
*/
function GetPeaksAndTroughs(){
    
    var peaks = [];
    var troughs = [];
    var peaksAndTroughs = [];
    var start = 0;
    var end = sandArray.length - 1;

    var startIndex = FindFirstNonEmptyColumn();
    if(startIndex == -1) return [0, sandArrayWidth /2, sandArrayWidth - 1];

    let prev =  sandArrayHeight - GetHighestSandInColumn(Math.max(startIndex - 1, 0)) - 1;
    let curr =  sandArrayHeight - GetHighestSandInColumn(startIndex) - 1;
    let next =  sandArrayHeight - GetHighestSandInColumn(Math.min(startIndex + 1, sandArray.length - 1)) - 1;

    var currentlyIncreasing = curr > prev ? 1 : (curr < prev ? -1 : 0);

    peaksAndTroughs.push(0);
    
    for(var i = startIndex; i < sandArray.length - 2; i++){
        curr =  sandArrayHeight - GetHighestSandInColumn(i) - 1;
        next =  sandArrayHeight - GetHighestSandInColumn(Math.min(i + 1, sandArray.length - 1)) - 1;

        if(currentlyIncreasing == 1){
            if(curr > next){
                currentlyIncreasing = -1;      
                peaks.push(i);
                peaksAndTroughs.push(i);
            }
        }else if(currentlyIncreasing == -1){
            if(curr < next){
                currentlyIncreasing = 1;
                troughs.push(i);
                peaksAndTroughs.push(i);
            }else if(curr == next && curr == 0){
                currentlyIncreasing = 0;
                troughs.push(i);
                peaksAndTroughs.push(i);
            }
        }else if(currentlyIncreasing == 0){
            if(curr < next){
                currentlyIncreasing = 1;
                troughs.push(i);
                peaksAndTroughs.push(i);

            }
        }
    }
    peaksAndTroughs.push(sandArray.length - 1);

    return peaksAndTroughs;
}

/**
 * Finds the first non-empty column in the sand array.
 * @returns {number} The first non-empty column in the sand array.
 * If no column is found, -1 is returned.
*/
function FindFirstNonEmptyColumn(){
    for(var i = 0; i < sandArrayWidth; i++){
        if(sandArray[i][sandArrayHeight-1] != 0){
            return i;
        }
    }
    return -1;
}

/**
 * Gets the highest sand in a column.
 * @param {number} i The column to check.
 * @returns {number} The highest sand in the column.
 * If no sand is found, -1 is returned.
*/
function GetHighestSandInColumn(i){
    for(var j = sandArrayHeight - 1; j > 0; j--){
        if(sandArray[i][j] == 0){
            return j;
        }
    }
    return -1;
}

/**
 * Tries to drop sand to the left.
 * @param {number} i The column to check.
 * @param {number} j The row to check.
 * @returns {boolean} True if the sand was dropped to the left, false otherwise.
*/
function TryDropSandLeft(i, j){
    if(i + 1 < sandArrayWidth && sandArray[i + 1][j + 1] == 0){ //if the right is empty, move the sand to the right
        sandArray[i + 1][j + 1] = sandArray[i][j];
        sandArray[i][j] = 0;

        sandArrayOptimizerX[i]--;
        sandArrayOptimizerWasTrue[i] = 100;
        sandArrayOptimizerX[i + 1]++;

        sandArrayOptimizerY[j]--;
        sandArrayOptimizerY[j + 1]++;
        
        needRedraw = true;
        return true;
    }
    
    return false;
}

/**
 * Tries to drop sand to the right.
 * @param {number} i The column to check.
 * @param {number} j The row to check.
 * @returns {boolean} True if the sand was dropped to the right, false otherwise.
*/
function TryDropSandRight(i, j){
    if(i - 1 >= 0 && sandArray[i - 1][j + 1] == 0){ //if the left is empty, move the sand to the left
        sandArray[i - 1][j + 1] = sandArray[i][j];
        sandArray[i][j] = 0;

        sandArrayOptimizerX[i]--;
        sandArrayOptimizerWasTrue[i] = 100;
        sandArrayOptimizerX[i - 1]++;

        sandArrayOptimizerY[j]--;
        sandArrayOptimizerY[j + 1]++;


        needRedraw = true;
        return true;
    }
      
    return false;
}

/**
 * Kills the sand at the current position.
 * @param {number} i The column to check.
 * @param {number} j The row to check.
 * If the sand is at the bottom, the sand is killed.
*/
function KillSand(i, j){
    if(sandArray[i][j] > sandColors.length || sandArrayOptimizerWasTrue[i] > 0) return;

    sandArray[i][j] += sandColors.length;
    sandArrayOptimizerX[i]--;
    sandArrayOptimizerWasTrue[i] = 100;
    needRedraw = true; 
    
}

/**
 * Redraws the sand.
 * The sand is redrawn with the new positions.
 * The sand is redrawn with the new colors.
 * The sand is redrawn with the new heights.
*/
function ReDraw(){
    const percentNext = 100 / sandArrayWidth;
    for(var i = sandArrayWidth - 1; i >= 0; i--){
        if(sandArrayOptimizerX[i] == 0 && sandArrayOptimizerWasTrue[i] == 0) continue;
        if(sandArrayOptimizerWasTrue[i] > 0) sandArrayOptimizerWasTrue[i]--;
        var cssText = "top: 0; left: " + i * percentNext + "%; width:" + percentNext + "vw; height: 100%; position: absolute; background: linear-gradient(to bottom, ";
        var lastColor = 0;
        var setEnd = false;
        cssText += sandColors[0] + " 0%, ";

        for(var k = tallestSand; k < sandArrayHeight; k++){
            var percent = percentNext * k;

            if(sandArray[i][k] != lastColor || k == sandArrayHeight - 1){
                cssText += sandColors[lastColor % sandColors.length] + " " + percent + "%, ";
                cssText += sandColors[sandArray[i][k] % sandColors.length] + " " + percent + "%, ";
                lastColor = sandArray[i][k];
            }
        }

        document.getElementById("sandLineObject" + i).style.cssText = cssText.substring(0, cssText.length - 2) + ");";
    }
}

