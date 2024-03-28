const SCROLL_SPEED = 4;

function checkScrollWheel(){
    //bind the scroll wheel to the movePacman function
    window.addEventListener('wheel', function(e){ scrollWindow(e.deltaY > 0); });
}

function scrollWindow(up){
    //Grabs the HEV number element and image
    var hevNum = document.getElementById('hevNum');
    var hevImg = document.getElementById('hev1');
    var bg     = document.getElementById('aboutContainer');

    //set the new top to the current top plus the scroll speed
    var limit = parseFloat(hevNum.innerHTML);
    limit = (!limit ? 0 : limit) - (up ? SCROLL_SPEED : -SCROLL_SPEED);
    limit = Math.max(Math.min(100, limit), 0);

    //set the new css for hev
    hevNum.innerHTML = Math.round(limit);
    hevImg.style.cssText = "clip-path: inset(0% 0% " + (limit) + "% 0%);";
    bg.style.cssText = "transform: translateY(" + (limit - 100) + "vh)";
    //clean up
    delete limit;
    delete hevNum;
    delete hevImg;
    delete bg;
}