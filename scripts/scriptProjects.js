const SCROLL_SPEED = 1;
const MAX_HEIGHT = -13.5;
const MIN_HEIGHT = -70;
const ITEMS = 4
var movingDown = false;
var prevVal = 0;
var addMargin = 0;

function checkScrollWheel(){
    //bind the scroll wheel to the scrollWindow function
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


    var projectsBox = document.getElementsByClassName("projects")[0];
    var height = 0;
    if(!projectsBox.style.cssText.includes("transform")){
        projectsBox.style.cssText = "transform: translateY(" + MAX_HEIGHT + "%);";
    }
    height = parseFloat(projectsBox.style.transform.replace("translateY(", "").replace("%);", ""));

    //set the new top to the current top plus the scroll speed
    var newVal =  height + (up ? SCROLL_SPEED : -SCROLL_SPEED);

    // set range input value
    if(height <= MIN_HEIGHT && !up){
        console.log("flip down");
        newVal = MAX_HEIGHT;
    }
    if(height >= MAX_HEIGHT && up){
        console.log("flip up");
        newVal = MIN_HEIGHT;
    }
    console.log("addMargin: " + addMargin);
    //move the stuff
    projectsBox.style.cssText = "transform: translateY(" + (newVal) + "%);";

    MovePortalMan(newVal);
    // MovePanels(newVal);
    delete scrollbarSkill;
}


function MovePortalMan(newPos){
    var portalMan = document.getElementById("portalMan");
    if(!portalMan.style.cssText.includes("margin-top")){
        portalMan.style.cssText = "margin-top: 2%;";
    }

    //lerp from 2 to 98 from MIN_HEIGHT to MAX_HEIGHT
    var newVal = lerp(92, 2, (newPos - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT));
    portalMan.style.cssText = "margin-top: " + newVal + "vh;";

    delete portalMan;
}

function MovePanels(newVal){
    // I have a class item called "projects". The children of products are the panels. I want to move the first child to the last child
    var projectsBox = document.getElementsByClassName("projects")[0];
    var panels = projectsBox.children;
    console.log("newVal: " + newVal + " prevVal: " + prevVal);
    if(newVal < -25 && prevVal == -25){
        addMargin = 40;
        projectsBox.appendChild(panels[0]);
        console.log("moved first panel to last panel");
    }else if(newVal > -25 && prevVal == -25){
        addMargin = 0;
        projectsBox.insertBefore(panels[panels.length - 1], panels[0]);
        console.log("moved last panel to first panel");
    }

    projectsBox.style.marginTop = addMargin + "%";
    prevVal = newVal;

}

function lerp(start, end, t) {
    return start + t * (end - start);
}