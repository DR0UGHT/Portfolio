const SCROLL_SPEED = 5;
const minVal = 0;
const maxVal = 65;
var movingDown = false;

//dictionary of all the skills
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
    Test();
};

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


function checkScrollWheel(){
    //bind the scroll wheel to the movePacman function
    window.addEventListener('wheel', function(e){ scrollWindow(e.deltaY < 0); });
}


function scrollWindow(up){
    //prevent jittering
    if(up && movingDown){
        movingDown = false;
        return;
    }else if(!up && !movingDown){
        movingDown = true;
        return;
    }


    var scrollbarSkill = document.getElementById("skillScroll");


    // set range input value
    if(scrollbarSkill.value == scrollbarSkill.min && !up){
        return;
    }
    if(scrollbarSkill.value == scrollbarSkill.max && up){
        return;
    }

    //set the new top to the current top plus the scroll speed
    var newVal =  parseFloat(scrollbarSkill.value) + (up ? SCROLL_SPEED : -SCROLL_SPEED);
    scrollbarSkill.value = newVal;

    //move the stuff
    moveStuff();

    delete scrollbarSkill;
}

function moveStuff(){
    var scrollbarSkill = document.getElementById("skillScroll");

    //lerp from 0 to 50 from minVal to maxVal
    var scrollval = maxVal - (parseFloat(scrollbarSkill.value) / (100 / maxVal));
    document.getElementById("skillContainer").style.cssText = "transform: translateY(" + (-scrollval) + "%);";
}