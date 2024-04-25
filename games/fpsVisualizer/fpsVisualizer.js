let fpsDots = [];

window.onload = function() {
    fpsDots.push(document.getElementById("1FPSBall"));
    fpsDots.push(document.getElementById("5FPSBall"));
    fpsDots.push(document.getElementById("10FPSBall"));
    fpsDots.push(document.getElementById("20FPSBall"));
    fpsDots.push(document.getElementById("30FPSBall"));
    fpsDots.push(document.getElementById("60FPSBall"));
    fpsDots.push(document.getElementById("120FPSBall"));
    var frame = 0;
    var currentMargin = 0;
    var dir = 1;
    var moveBalls = setInterval(function() {
        frame++;
        //120fps dot
        if(frame % 2 == 0) {
            fpsDots[6].style.marginLeft = currentMargin + "%";
        }
        //60fps dot
        if(frame % 4 == 0) {
            fpsDots[5].style.marginLeft = currentMargin + "%";
        }
        //30fps dot
        if(frame % 8 == 0) {
            fpsDots[4].style.marginLeft = currentMargin + "%";
        }
        //20fps dot
        if(frame % 12 == 0) {
            fpsDots[3].style.marginLeft = currentMargin + "%";
        }
        //10fps dot
        if(frame % 24 == 0) {
            fpsDots[2].style.marginLeft = currentMargin + "%";
        }
        //5fps dot
        if(frame % 48 == 0) {
            fpsDots[1].style.marginLeft = currentMargin + "%";
        }
        //1fps dot
        if(frame % 240 == 0) {
            frame = 0;
            fpsDots[0].style.marginLeft = currentMargin + "%";
        }
        currentMargin += 0.1 * dir;
        if(currentMargin >= 95 || currentMargin <= 0) {
            dir *= -1;
        }
    }, 1000 / 240);
}
