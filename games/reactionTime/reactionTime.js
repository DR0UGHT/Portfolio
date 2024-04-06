//variables for clicking and timing
var started = false;
var bestTime = 0;
var totalTime = 0;
var testnum = 0;

//variables to handle mouse clicks
var needToWait = false;
var mouseDown = false;

window.onload = function() {
    document.getElementsByClassName("reactionTimeBody")[0].addEventListener("click", OnClick);
    document.getElementsByClassName("reactionTimeBody")[0].addEventListener("mousedown", function(){mouseDown = true;});
    document.getElementsByClassName("reactionTimeBody")[0].addEventListener("mouseup", function(){mouseDown = false;});
}

/**
 * ResetPage resets the page to the starting state, updating the text and background color
 * returns: void
 */
async function ResetPage(){
    testnum = 0;
    bestTime = 0;
    totalTime = 0;
    mouseDown = false;
    clickedOutOfTurn = false;
    document.getElementsByClassName("reactionTimeImage")[0].style.background = "#878787";
    document.getElementsByClassName("reactionTimeText")[0].innerHTML = "Click to begin";
    document.getElementsByClassName("reactionTimeText1")[0].innerHTML = "Test 1/5";

    document.getElementsByClassName("reactionTimeText1")[0].style.display = "block";
    document.getElementsByClassName("reactionTimeAverage")[0].style.display = "none";
    document.getElementsByClassName("reactionTimeBest")[0].style.display = "none";

    await new Promise(resolve => setTimeout(resolve, 300));
    //await for mousedown = false and mousedown = true
    while(!mouseDown){
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    while(mouseDown){
        await new Promise(resolve => setTimeout(resolve, 1));
    }

    started = false;
}

/**
 * ClickedTooEarly is called when the user clicks too early, updating the text and background color
 * returns: void
*/
async function ClickedTooEarly(){

    document.getElementsByClassName("reactionTimeText")[0].innerHTML = "Too early!";
    document.getElementsByClassName("reactionTimeText1")[0].style.display = "block";
    document.getElementsByClassName("reactionTimeText1")[0].innerHTML = "Click to restart";

    await new Promise(resolve => setTimeout(resolve, 1000));

    //wait for mouseDown then ResetPage
    var inter = setInterval(function(){
        if(mouseDown){
            started = false;
            mouseDown = false;
            clearInterval(inter);
        }
    }, 1);
}

/**
 * OnClick is called when the user clicks the screen, updating the text and background color and starting the test
 * Main function for the reaction time test
 * returns: void
*/
async function OnClick(){
    if(!started && testnum < 5){
        testnum++;
        started = true;
        needToWait = true;
        //set background to red, and alert user to wait for green
        document.getElementsByClassName("reactionTimeImage")[0].style.background = "#bb5f5f";
        document.getElementsByClassName("reactionTimeText1")[0].style.display = "none";
        document.getElementsByClassName("reactionTimeText")[0].innerHTML = "Wait for green...";

        //wait for random time between 1 and 7 seconds
        var clickedOutOfTurn = false;
        var waitTime = RandomRange(1000, 7000);
        await new Promise(resolve => {
            var CheckEarlyClick = setInterval(function(){
                waitTime -= 25;
                if(waitTime <= 0){
                    clearInterval(CheckEarlyClick);
                    resolve();
                }

                if(mouseDown){
                    clearInterval(CheckEarlyClick);
                    clickedOutOfTurn = true;
                    resolve();
                }
            }, 25);
        });

        if(clickedOutOfTurn){
            testnum--;
            document.getElementsByClassName("reactionTimeImage")[0].style.background = "#e48a24";
            ClickedTooEarly();
            return;
        }

        //set background to green, and alert user to click
        document.getElementsByClassName("reactionTimeImage")[0].style.background = "#5fbb74";
        document.getElementsByClassName("reactionTimeText")[0].innerHTML = "Click!";
        var startTime = new Date().getTime();
        await new Promise(resolve => {
            var inter = setInterval(function(){
                if(mouseDown){
                    var time = new Date().getTime() - startTime;
                    totalTime += time;
                    
                    document.getElementsByClassName("reactionTimeImage")[0].style.background = "#878787";
                    document.getElementsByClassName("reactionTimeText")[0].innerHTML = time + "ms";

                    if(time < bestTime || bestTime == 0){ bestTime = time; }

                    document.getElementsByClassName("reactionTimeText1")[0].style.display = "none";
                    needToWait = false;
                    clearInterval(inter);
                    resolve();
                }
            }, 1);
        });


        await new Promise(resolve => setTimeout(resolve, 400));

        //wait for user to click
        var mouseClicks = 0;
        var waitForMouseRelease = false;

        var inter = setInterval(function(){
            if(mouseDown){
                if(waitForMouseRelease) return; 

                waitForMouseRelease = true;
                if(mouseClicks == 0){
                    if(testnum == 5){
                        mouseDown = false;
                        clearInterval(inter);

                        Finished();
                    }else{
                        mouseClicks++;
                        document.getElementsByClassName("reactionTimeText")[0].innerHTML = "Click to begin";
                        document.getElementsByClassName("reactionTimeText1")[0].style.display = "block";
                        document.getElementsByClassName("reactionTimeText1")[0].innerHTML = "Test " + (testnum+1) + "/5";
                    }
                }else{
                    started = false;
                    mouseDown = false;


                    clearInterval(inter);
                }
            }else{
                waitForMouseRelease = false;
            }
        }, 1);
    }
}

/**
 * RandomRange returns a random number between min and max
 * min: the minimum number
 * max: the maximum number
 * returns: a random number between min and max
*/
function RandomRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Finished is called when the user has completed all 5 tests, updating the text and displaying the average and best times
 * returns: void
*/
async function Finished(){
    averageTime = Math.round(totalTime / 5);

    document.getElementsByClassName("reactionTimeText")[0].innerHTML = "Finished!";
    document.getElementsByClassName("reactionTimeText1")[0].style.display = "block";
    document.getElementsByClassName("reactionTimeText1")[0].innerHTML = "Click to restart";
    document.getElementsByClassName("reactionTimeAverage")[0].innerHTML = "Average: " + averageTime + "ms";
    document.getElementsByClassName("reactionTimeBest")[0].innerHTML = "Best: " + bestTime + "ms";

    document.getElementsByClassName("reactionTimeAverage")[0].style.display = "block";
    document.getElementsByClassName("reactionTimeBest")[0].style.display = "block";

    mouseDown = false;

    await new Promise(resolve => setTimeout(resolve, 1000));

    //wait for mouseDown then ResetPage
    var inter = setInterval(function(){
        if(mouseDown){
            ResetPage();
            clearInterval(inter);
        }
    }, 1);
}