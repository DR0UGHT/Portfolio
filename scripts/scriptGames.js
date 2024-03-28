var pellets = document.getElementsByClassName("pellet");
const SCROLL_SPEED = 1.5;
const MAX_PAC_HEIGHT = 89.9;
const MIN_PAC_HEIGHT = 2.91;
const PAC_BITE_SPEED = 20;

var movingDown = false;

function checkScrollWheel(){
    //bind the scroll wheel to the movePacman function
    window.addEventListener('wheel', function(e){ movePacman(e.deltaY > 0); });

    //set the volume of the video to 0 just in case
    document.getElementById("ggVideo").volume = 0.0;
}

function movePacman(up){

    //prevent jittering
    if(up && movingDown){
        movingDown = false;
        return;
    }else if(!up && !movingDown){
        movingDown = true;
        return;
    }

    //Grabs the pacman element
    var pacman = document.getElementById('pacman');

    //set the top to 2.91 if it is not set
    var limit = MIN_PAC_HEIGHT;

    //if the limit is set, set it to the limit variable
    if(pacman.style.top != "" && pacman.style.top != null && pacman.style.top != undefined){
        limit = parseFloat(pacman.style.top);
    }

    //set the new top to the current top plus the scroll speed
    var limit = limit + (up ? SCROLL_SPEED : -SCROLL_SPEED);
    limit = Math.max(Math.min(MAX_PAC_HEIGHT, limit), MIN_PAC_HEIGHT);

    //open and close the mouth of pacman
    var v1 = (limit % PAC_BITE_SPEED) * (60/PAC_BITE_SPEED);

    if(v1 < 30){
        var topMouth = -90 + v1;
        var bottomMouth = 90 - v1;
    }else{
        var topMouth = -90 + (60 - v1);
        var bottomMouth = 90 - (60 - v1);
    }

    if(limit == MIN_PAC_HEIGHT || limit == MAX_PAC_HEIGHT){
        topMouth = -90;
        bottomMouth = 90;
    }

    //set the new css for pacman
    pacman.style.cssText = 
    "top: " + limit +
    "vh; background: linear-gradient(" + topMouth +"deg, #f2ff00 50%, transparent 50%), linear-gradient(0deg, #f2ff00 50%, transparent 50%), linear-gradient(" + bottomMouth + "deg, #f2ff00 50%, transparent 50%);"
    "position: relative; right: 0; width: 5vw; height: 5vw; rotate: 180deg; scale: .6;border-radius: 50%;";

    //disable the food that pacman has eaten
    disableFood();

    //move the games up or down
    moveGames(limit);

    delete limit;
    delete topMouth;
    delete bottomMouth;
    delete v1;
    delete pacman;
}

function moveGames(perc){
    //Grabs the games and moves them up or down
    var element = document.getElementsByClassName("Games")[0];

    //Games are transformed from 0 to -45% (currently)
    var mov = (perc - MIN_PAC_HEIGHT) / 1.934;
    
    //set the new position
    element.style.cssText = "transform: translateY(-" + mov + "%);";


    delete element;
    delete mov;
}


function disableFood(){
    //get the pacman height
    var pacmanStyleHeight = parseFloat(document.getElementById('pacman').style.top);

    //dont love this magic number, but it is the height of the pacman
    pacmanHeight = (pacmanStyleHeight - MIN_PAC_HEIGHT*2) / 4.8;
    
    //disable the food that pacman has eaten, and enable the food that is still there
    for(var i = 0; i < pellets.length; i++){
        if(i < pacmanHeight)pellets[i].style.visibility = "hidden";
        else pellets[i].style.visibility = "visible";
    }

    //if the pacman is at the bottom, disable the last food
    if(pacmanStyleHeight == MAX_PAC_HEIGHT){
        pellets[pellets.length-1].style.visibility = "hidden"; 
        pellets[pellets.length-2].style.visibility = "hidden"; 
    }

    delete pacmanStyleHeight;
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
    document.getElementById("sbuVideo").play();

    delete buttonInt;
}