let content;
let wasScrollingDown = true;
let currScroll = 0, prevButton = 0;

let topButtons = [];
let smothScrollInterval, ocSim;

let hoveringProjects = false;
let hoveringDropDown = false;
let heights = [0.0, -11.35, -23.15, -59, -77.68, -116];

const SCROLL_SPEED = 5;
const minVal = 0;
const maxVal = 65;
let zoomedYet = false;
let bottomIconsShown = true;

var sliders = {
    1 : {name: "s1", value: 80}, //C++ 80
    2 : {name: "s2", value: 75}, //C# 75
    3 : {name: "s3", value: 75}, //Java 75
    4 : {name: "s4", value: 70}, //Python 70
    5 : {name: "s5", value: 65}, //JavaScript 65
    6 : {name: "s6", value: 60}, //C 60
    7 : {name: "s7", value: 55}, //HTML 55
    8 : {name: "s8", value: 55}, //CSS 55  
    9 : {name: "s9", value: 50}, //Haskell 50

    10 : {name: "st1", value: 80}, //Visual Studio
    11 : {name: "st2", value: 75}, //Git
    12 : {name: "st3", value: 70}, //CMake
    13 : {name: "st4", value: 70}, //IntelliJ
    14 : {name: "st5.5", value: 65}, //Gimp 2.0
    15 : {name: "st5", value: 65}, //Mixamo
    16 : {name: "st6", value: 60}, //Eclipse
    17 : {name: "st7", value: 60}, //Blender    
    18 : {name: "st8", value: 55}, //GameBench
    19 : {name: "st9", value: 50}, //SpeedTree

    20 : {name: "se1", value: 85}, //Unity
    21 : {name: "se2", value: 80}, //Unreal Engine 4
    22 : {name: "se3", value: 75}, //Unreal Engine 5
    23 : {name: "se4", value: 70}, //GameMaker Studio
    24 : {name: "se6", value: 65}, //Godot

    25 : {name: "gd1", value: 80}, //Visual Scripting
    26 : {name: "gd2", value: 80}, //OpenGL
    27 : {name: "gd3", value: 75}, //Optimization
    28 : {name: "gd4", value: 70}, //Level Design
    29 : {name: "gd5", value: 65}, //AI
    30 : {name: "gd6", value: 50} //3D Modeling
};

window.onload = function() {
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
            if(prevButton != 2){
                topButtons[prevButton].classList.remove("navButtonCurrent");
                topButtons[prevButton].classList.add("navButton");
            }else{
                document.getElementById("projects").classList.remove("navButtonDDCurr");
                document.getElementById("projects").classList.add("navButtonDD");
            }

            if(i != 2){
                topButtons[i].classList.add("navButtonCurrent");
                topButtons[i].classList.remove("navButton");
            }else{
                document.getElementById("projects").classList.add("navButtonDDCurr");
                document.getElementById("projects").classList.remove("navButtonDDH");
                document.getElementById("projects").classList.remove("navButtonDD");
            }
            prevButton = i;
            smothScrollInterval = setInterval(function(){
                slowdown = Math.max(1, slowdown - .2);
                currScroll = content.offsetTop;
                if(Math.abs(content.offsetTop - neededHeight) > 1){
                    content.style.top = `${content.offsetTop - (content.offsetTop - neededHeight)/slowdown}px`;
                }else{
                    content.style.top = `${neededHeight}px`;
                    clearInterval(smothScrollInterval);

                    if(i == 3 && !zoomedYet){
                        zoomedYet = true;
                        Test();
                    }
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


    document.getElementById("projects").onclick = function(){
        clearInterval(smothScrollInterval);
        let neededHeight = heights[2] * content.clientHeight / 100;
        let slowdown = 30.0;
        if(prevButton != 2){
            topButtons[prevButton].classList.remove("navButtonCurrent");
            topButtons[prevButton].classList.add("navButton");
        }else{
            document.getElementById("projects").classList.remove("navButtonDDCurr");
            document.getElementById("projects").classList.add("navButtonDD");
        }

        document.getElementById("projects").classList.add("navButtonDDCurr");
        document.getElementById("projects").classList.remove("navButtonDDH");
        document.getElementById("projects").classList.remove("navButtonDD");
        
        prevButton = 2;

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


    // window.addEventListener('keydown', function(e){
    //     if(e.key == "q"){
    //         console.log(content.offsetTop / content.clientHeight * 100);
    //     }
    // });
}



//bind scroll event
window.addEventListener('mousewheel', function(e) {
    clearInterval(smothScrollInterval);
    smothScrollInterval = null;

    if (e.wheelDelta > 0 && wasScrollingDown) {
        wasScrollingDown = false;
        return;
    } else if (e.wheelDelta < 0 && !wasScrollingDown) {
        wasScrollingDown = true;
        return;
    }

    if(currScroll + e.wheelDelta/4 >= 0){
        content.style.top = '0px';
        currScroll = 0;
        if(!bottomIconsShown){
            document.getElementById("social-media-icons").style.animation = "1s leaveUp";
            setTimeout(function(){
                document.getElementById("cv").id = "cvBottom";
                document.getElementById("linkedin").id = "linkedinBottom";
                document.getElementById("github").id = "githubBottom";
                document.getElementById("email").id = "emailBottom";
                document.getElementById("social-media-icons").style.top = "";
                document.getElementById("social-media-icons").style.bottom = "0";
                document.getElementById("social-media-icons").style.left = "";
                document.getElementById("social-media-icons").style.right = "0";
                document.getElementById("social-media-icons").style.justifyContent = "end";
                document.getElementById("email-icon").style.marginTop = "20%";
                document.getElementById("github-icon").style.marginTop = "20%";
                document.getElementById("linkedin-icon").style.marginTop = "20%";
                document.getElementById("cv-icon").style.marginTop = "20%";
            }, 1000);
            bottomIconsShown = true;
        }

        if(prevButton != 2){
            topButtons[prevButton].classList.remove("navButtonCurrent");
            topButtons[prevButton].classList.add("navButton");
        }else{
            document.getElementById("projects").classList.remove("navButtonDDCurr");
            document.getElementById("projects").classList.add("navButtonDD");
        }
        topButtons[0].classList.add("navButtonCurrent");
        topButtons[0].classList.remove("navButton");
        prevButton = 0;

        console.log("top");
        

        return;
    }else if (currScroll + e.wheelDelta/4 < heights[heights.length - 1] * content.clientHeight / 100){
        content.style.top = `${heights[heights.length - 1] * content.clientHeight / 100}px`;
        currScroll = heights[heights.length - 1] * content.clientHeight / 100;

        return;
    }else{
        if(bottomIconsShown){
            document.getElementById("social-media-icons").style.animation = "1s leaveDown";
            setTimeout(function(){
                document.getElementById("emailBottom").id = "email";
                document.getElementById("githubBottom").id = "github";
                document.getElementById("linkedinBottom").id = "linkedin";
                document.getElementById("cvBottom").id = "cv";
                document.getElementById("social-media-icons").style.top = "0";
                document.getElementById("social-media-icons").style.bottom = "";
                document.getElementById("social-media-icons").style.left = "0";
                document.getElementById("social-media-icons").style.right = "";
                document.getElementById("social-media-icons").style.justifyContent = "start";
                document.getElementById("social-media-icons").style.marginLeft = "10%";
                document.getElementById("email-icon").style.marginTop = "70%";
                document.getElementById("github-icon").style.marginTop = "70%";
                document.getElementById("linkedin-icon").style.marginTop = "70%";
                document.getElementById("cv-icon").style.marginTop = "70%";
            }, 1000);
            bottomIconsShown = false;
        }
    }


    currScroll += e.wheelDelta/4;
    content.style.top = `${content.offsetTop + e.wheelDelta/4}px`;
    for(let i = 0; i < heights.length-1; i++){
        if(Math.abs(parseFloat(content.style.top) - heights[i] * content.clientHeight / 100) < 24){
            if(prevButton != i){
                if(prevButton != 2){
                    topButtons[prevButton].classList.remove("navButtonCurrent");
                    topButtons[prevButton].classList.add("navButton");
                }else{
                    document.getElementById("projects").classList.remove("navButtonDDCurr");
                    document.getElementById("projects").classList.add("navButtonDD");
                }
                if(i != 2){
                    topButtons[i].classList.add("navButtonCurrent");
                    topButtons[i].classList.remove("navButton");
                }else{
                    document.getElementById("projects").classList.add("navButtonDDCurr");
                    document.getElementById("projects").classList.remove("navButtonDDH");
                    document.getElementById("projects").classList.remove("navButtonDD");
                }
                prevButton = i;

                if(i == 3 && !zoomedYet){
                    zoomedYet = true;
                    Test();
                }
            }
            break;
        }
    }
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
    if(document.getElementById("projects").classList.contains("navButtonDD")){
        document.getElementById("projects").classList.add("navButtonDDH");
        document.getElementById("projects").classList.remove("navButtonDD");
    }
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
    if(document.getElementById("projects").classList.contains("navButtonDDH")){
        document.getElementById("projects").classList.remove("navButtonDDH");
        document.getElementById("projects").classList.add("navButtonDD");
    }
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




function Test(){
    var slids = document.getElementsByClassName("slid");

    //create a mask that covers the entire right half of test
    var i = 0;
    var speed = 25;

    mask1 = "";
    mask2 = "mask-position: ";
    mask3 = "mask-size: ";
    mask4 = "mask-repeat: no-repeat;";
    mask5 = "mask-composite: source-over;";

    for(var j = 0; j < 100; j++){
        mask2 += j + "% 0%,";
        mask3 += "1% 100%,";
    }

    mask2 = mask2.slice(0, -1) + ";";
    mask3 = mask3.slice(0, -1) + ";";

    combMask = mask2 + mask3 + mask4 + mask5;

    min = 0;
    var fillBar = setInterval(function() {   
        mask1 = "mask-image: ";
        
        for(var j = min; j < 100; j++){
            if(j < i) mask1 += "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) " + (100 - i + j) + "%,  rgba(0, 0, 0, 1) " + (100 - i + j)  + "%, rgba(0, 0, 0, 1) 100%),";
        }
    
        mask1 = mask1.slice(0, -1) + ";";
        for(var key in sliders){
            if(document.getElementById(sliders[key].name).children.namedItem("slid"))
                document.getElementById(sliders[key].name).children.namedItem("slid").style.cssText = "clip-path: inset(0% " + (Math.max((100-i), 100 - sliders[key].value)) + "% 0% 0%); -webkit-clip-path: inset(0% " + (Math.max((100-i),  100 - sliders[key].value)) + "% 0% 0%);" + mask1 + combMask;
            
            if(i < sliders[key].value + 5){
                document.getElementById(sliders[key].name).children.namedItem("sliderVal").innerHTML = i+1-5;
                document.getElementById(sliders[key].name).children.namedItem("sliderVal").style.cssText = "margin-left: " + (-81 + ((i-5) / 101) * (0 - (-82))) + "%;";
            }
        }

        
        i++;
        if(i >= 200){
            for(var key in sliders){
                document.getElementById(sliders[key].name).children.namedItem("slid").style.cssText = "clip-path: inset(0% " + (Math.max((100-i), 100 - sliders[key].value)) + "% 0% 0%); -webkit-clip-path: inset(0% " + (Math.max((100-i),  100 - sliders[key].value)) + "% 0% 0%);";
            }
            //cleanup
            delete slids;
            delete i;
            delete speed;
            delete mask1;
            delete mask2;
            delete mask3;
            delete mask4;
            delete mask5;
            delete combMask;
            delete fillBar;


            clearInterval(fillBar);
        }
    }, speed);
}

function GrowBar(sliderId, len, maxLen, speed){   
    //grab the correct slider element
    const slider = document.getElementById(sliderId);
    const  sliderText = slider.children.namedItem("sliderVal")
    var i = 0;

    var fillBar = setInterval(function() {   
        slider.children.namedItem("sliderBar" + i).style.cssText = "animation: barStart 5s cubic-bezier(0.29, 1, 0.12, 1) forwards;";
        
        //linear interp from -89 to 0 from len to maxLen
        sliderText.style.cssText = "margin-left: " + (-89 + (i / 101) * (0 - (-89.2))) + "%;";
        sliderText.innerHTML = len + 1;

        speed = (len < maxLen/2 ? speed - 0.25 : speed + 0.5);
        if(++i == maxLen) clearInterval(fillBar);
    }, speed*1.2);


    //cleanup
    delete slider;
    delete sliderText;
    delete i;
    delete fillBar;
}