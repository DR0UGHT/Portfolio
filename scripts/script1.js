let content;
let wasScrollingDown = true;
let currScroll = 0, prevButton = 0;

let topButtons = [];
let smothScrollInterval, ocSim;

let hoveringProjects = false;
let hoveringDropDown = false;
window.onload = function() {
    let heights = [0.0, -10, -30, -50, -100];

    content = document.getElementById('scroller');
    background = document.getElementById('background');

    SetGlizzyPhoto("b1");
    SetSBUPhoto("b1");

    topButtons.push(document.getElementById("home"));
    topButtons.push(document.getElementById("games"));
    topButtons.push(document.getElementById("projects1"));
    topButtons.push(document.getElementById("skills"));
    topButtons.push(document.getElementById("about"));

    document.getElementById("projects2").onclick = function(){
        window.open("https://liamcarroll.ca/games/games.html", "_blank");
    }
    // topButtons.push(document.getElementById("100 Day Project"));

    for(let i = 0; i < topButtons.length; i++){
        topButtons[i].onclick = function(){
            clearInterval(smothScrollInterval);
            let neededHeight = heights[i] * content.clientHeight / 100;
            let slowdown = 30.0;
            if(prevButton != -1){
                topButtons[prevButton].classList.remove("navButtonCurrent");
                topButtons[prevButton].classList.add("navButton");
            }

            if(i != 2){
                topButtons[i].classList.add("navButtonCurrent");
                topButtons[i].classList.remove("navButton");
            }
            prevButton = i==2 ? -1 : i;
            smothScrollInterval = setInterval(function(){
                slowdown = Math.max(1, slowdown - .2);
                if(Math.abs(content.offsetTop - neededHeight) > 1){
                    content.style.top = `${content.offsetTop - (content.offsetTop - neededHeight)/slowdown}px`;
                }else{
                    content.style.top = `${neededHeight}px`;
                    clearInterval(smothScrollInterval);
                }

            }, 15);
        }
    }

    document.getElementById("projects").addEventListener("mouseover", function(){
        hoveringProjects = true;
        if((parseFloat(document.getElementById("drop").style.height) <= 50 &&  parseFloat(document.getElementById("drop").style.height) >= 0) || !document.getElementById("drop").style.height){
            clearInterval(ocSim);
            ocSim = null;
            OpenDropDown();
        }
    });

    document.getElementById("projects").addEventListener("mouseleave", async function(){
        hoveringProjects = false;
        await new Promise(r => setTimeout(r, 40));
        if(!hoveringDropDown && !hoveringProjects){
            clearInterval(ocSim);
            ocSim = null;
            CloseDropDown();
        }
    });

    document.getElementById("drop").addEventListener("mouseleave", async function(){
        hoveringDropDown = false;
        await new Promise(r => setTimeout(r, 40));
        if(!hoveringDropDown && !hoveringProjects){
            clearInterval(ocSim);
            ocSim = null;
            CloseDropDown();
        }
    });

    //started hover
    document.getElementById("drop").addEventListener("mouseover", function(){
        hoveringDropDown = true;
    });
}



//bind scroll event
window.addEventListener('mousewheel', function(e) {
    if (e.wheelDelta > 0 && wasScrollingDown) {
        wasScrollingDown = false;
        return;
    } else if (e.wheelDelta < 0 && !wasScrollingDown) {
        wasScrollingDown = true;
        return;
    }

    if(currScroll + e.wheelDelta/7 > 0){
        content.style.top = '0px';
        currScroll = 0;
        return;
    }
    currScroll += e.wheelDelta/7;
    content.style.top = `${content.offsetTop + e.wheelDelta/7}px`;
});

window.onmousemove = function(e) {

}

function SetGlizzyPhoto(button){
    //grab the id of the button and convert it to an int
    var buttonInt = parseInt(button[1]);

    //set all buttons to white
    for(var i = 1; i <= 9; i++){
        if(i != buttonInt) document.getElementById("b" + i).style.backgroundColor = "#ffffff";
    }

    //set the clicked button to red
    document.getElementById(button).style.backgroundColor = "#c93131";

    //if we selected a photo, else we chose a video
    if(buttonInt < 9){
        document.getElementById("ggPicture").style.backgroundImage = "url('images/gg" + buttonInt + ".jpg')";
        document.getElementById("ggVideo").style.visibility = "hidden";
        document.getElementById("ggVideo").pause();
        return;
    }
    
    //not a photo, so it must be a video
    document.getElementById("ggPicture").style.backgroundImage = "none";
    document.getElementById("ggVideo").style.visibility = "visible";
    // mute video
    document.getElementById("ggVideo").muted = true;
    
    document.getElementById("ggVideo").play();

    delete buttonInt;    
}

function SetSBUPhoto(button){
    //grab the id of the button and convert it to an int
    var buttonInt = parseInt(button[1]);

    //set all buttons to white
    for(var i = 1; i <= 7; i++){
        if(i != buttonInt) document.getElementById("sbub" + i).style.backgroundColor = "#ffffff";
    }

    //set the clicked button to red
    document.getElementById("sbu" + button).style.backgroundColor = "#c93131";

    //if we selected a photo, else we chose a video
    if(buttonInt < 7){
        document.getElementById("sbuPicture").style.backgroundImage = "url('images/sbu" + buttonInt + ".jpg')";
        document.getElementById("sbuVideo").style.visibility = "hidden";
        document.getElementById("sbuVideo").pause();
        return;
    }

    //not a photo, so it must be a video
    document.getElementById("sbuPicture").style.backgroundImage = "none";
    document.getElementById("sbuVideo").style.visibility = "visible";
    document.getElementById("sbuVideo").muted = true;
    document.getElementById("sbuVideo").play();

    delete buttonInt;
}
function SwapGames(){
    let gamesDiv = document.getElementById("gamesDiv");
    let rotaterButton = document.getElementById("gameButton");
    if(gamesDiv.style.left == "20%" || !gamesDiv.style.left){
        let currLeft = 20;
        let sim = setInterval(function(){
            gamesDiv.style.left = currLeft + "%";
            rotaterButton.style.transform = "rotate(" + (Math.abs(currLeft - 20) * 2.5) + "deg)";
            currLeft-=.6;
            if(currLeft <= -50){
                gamesDiv.style.left = "-50%";
                rotaterButton.style.transform = "rotate(180deg)";
                clearTimeout(sim);
            }
        }, 10);
    }else{
        let currLeft = -50;
        let sim = setInterval(function(){
            gamesDiv.style.left = currLeft + "%";
            rotaterButton.style.transform = "rotate(" + (Math.abs(currLeft -20) * 2.5) + "deg)";
            currLeft+=.6;
            if(currLeft >= 20){
                gamesDiv.style.left = "20%";
                rotaterButton.style.transform = "rotate(0deg)";
                clearTimeout(sim);
            }
        }, 10);
    }
}

function OpenDropDown(){
    let dropDown = document.getElementById("drop");
    document.getElementById("projects").classList.add("navButtonDDH");
    document.getElementById("projects").classList.remove("navButtonDD");
    let startSize = parseFloat(dropDown.style.height) || 0;
    //while height is less than 66.6% of the screen height, or greater than 0

    dropDown.style.visibility = "visible";
    systemTime = new Date().getTime();
    ocSim = setInterval(function(systemTime){
        startSize += 1;
        dropDown.style.height = `${startSize}%`;
        dropDown.style.opacity = `${startSize/66}`;
        if(startSize >= 66){
            dropDown.style.height = "66%";
            clearInterval(ocSim);
            ocSim = null;
        }
    }, 10);
    
}

function CloseDropDown(){
    let dropDown = document.getElementById("drop");
    document.getElementById("projects").classList.add("navButtonDD");
    document.getElementById("projects").classList.remove("navButtonDDH");
    let startSize = parseFloat(dropDown.style.height) || 66;
    //while height is less than 66.6% of the screen height, or greater than 0
    let systemTime = new Date().getTime();
    ocSim = setInterval(function(systemTime){
        startSize -= 1;
        dropDown.style.height = `${startSize}%`;
        dropDown.style.opacity = `${startSize/66}`;
        if(startSize <= 0){
            dropDown.style.height = "0%";
            dropDown.style.visibility = "hidden";
            clearInterval(ocSim);
            ocSim = null;
        }
    }, 10);
}