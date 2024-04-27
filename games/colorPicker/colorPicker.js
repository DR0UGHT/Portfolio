var canvas, ctx, fileInput, canvasHolder, zoompixels;

let mouse = {
    lastClickX: 0,
    lastClickY: 0,
    onCanvas: false
}
window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true, imageSmoothingEnabled: true, imageSmoothingQuality: 'high', antialias: true});
    fileInput = document.getElementById("fileInput");
    canvasHolder = document.getElementsByClassName("imgHolder")[0];
    zoompixels = document.getElementsByClassName("zoompixels")[0];

    canvasHolder.style.width = "90%";
    canvasHolder.style.height = "50%";
    canvas.width = 900;
    canvas.height = 500;

    //disable right click
    window.oncontextmenu = function() {
        return false;
    }

    //mouse click event
    canvasHolder.onclick = function(event) {
        //get the x and y of the mouse click as a percentage of canvasholder width and height
        var x = Clamp((event.offsetX / canvasHolder.offsetWidth) * 100, 0, 100) * 1.01;
        var y = Clamp((event.offsetY / canvasHolder.offsetHeight) * 100, 0, 100) * 1.01;

        console.log(x, y);

        if(mouse.lastClickX === x && mouse.lastClickY === y) return;

        UpdateColor(x, y);
    }

    canvasHolder.onmousemove = function(event) {
        var x = Clamp((event.offsetX / canvasHolder.offsetWidth) * 100, 0, 100) * 1.01;
        var y = Clamp((event.offsetY / canvasHolder.offsetHeight) * 100, 0, 100) * 1.01;

        if(mouse.lastClickX === x && mouse.lastClickY === y) return;

        if(mouse.onCanvas) {
            let zoomCanvas = zoompixels.children[0];
            let zoomCtx = zoomCanvas.getContext('2d');
            
            //draw on zoomcanvas the 0-10% of the canvas
            zoomCanvas.width = 40;
            zoomCanvas.height = 40;

            let shiftFactorX = -2;
            let shiftFactorY = -2;

            let startX = Math.floor((canvas.width * (x - shiftFactorX)) / 100) - zoomCanvas.width;
            let startY = Math.floor((canvas.height * (y - shiftFactorY)) / 100) - zoomCanvas.height;

            let imageData = ctx.getImageData(startX, startY, zoomCanvas.width * 2, zoomCanvas.height * 2);
            zoomCtx.putImageData(imageData, 0, 0);
        }
    }

    canvasHolder.onmouseenter = function() {
        mouse.onCanvas = true;
        zoompixels.style.display = "flex";
    }

    canvasHolder.onmouseleave = function() {
        mouse.onCanvas = false;
        zoompixels.style.display = "none";
    }


    //onhover canvas


    window.onmousemove = function(event) {
        var x = Clamp((window.event.clientX / window.innerWidth) * 100, 0, 100);
        var y = Clamp((window.event.clientY / window.innerHeight) * 100, 0, 100);

        if(mouse.onCanvas) {
            zoompixels.style.left = `${x}%`;
            zoompixels.style.top = `${y}%`;
        }
    }
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function UpdateColor(x, y) {

    //turn x and y which is a percentage into a pixel value of image
    var pixelX = Math.floor((canvas.width * x) / 100);
    var pixelY = Math.floor((canvas.height * y) / 100);

    //get the pixel data of the image
    var pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;

    //get the color of the pixel
    var red = pixelData[0];
    var green = pixelData[1];
    var blue = pixelData[2];
    var alpha = pixelData[3];

    SetRGBA(red, green, blue, alpha);
    SetHEX(red, green, blue);
    SetCMYK(red, green, blue);
    SetHSL(red, green, blue);
    SetHSV(red, green, blue);
    SetSelectedColor(red, green, blue, alpha);
}

function SetSelectedColor(red, green, blue, alpha) {
    var color = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
    document.getElementById("colorBox").style.backgroundColor = color;
}

function SetRGBA(red, green, blue, alpha) {
    document.getElementById("R").innerHTML = `R: ${red}`;
    document.getElementById("G").innerHTML = `G: ${green}`;
    document.getElementById("B").innerHTML = `B: ${blue}`;
    document.getElementById("A").innerHTML = `A: ${alpha}`;
}

function SetHEX(red, green, blue) {
    var hex = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
    document.getElementById("HEX").innerHTML = `HEX: ${hex}`;
}

function SetCMYK(red, green, blue) {
    var c = 1 - (red / 255);
    var m = 1 - (green / 255);
    var y = 1 - (blue / 255);
    var k = Math.min(c, m, y);

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    if(isNaN(c)) c = 0;
    if(isNaN(m)) m = 0;
    if(isNaN(y)) y = 0;

    document.getElementById("C").innerHTML = `C: ${Math.round(c * 100)}%`;
    document.getElementById("M").innerHTML = `M: ${Math.round(m * 100)}%`;
    document.getElementById("Y").innerHTML = `Y: ${Math.round(y * 100)}%`;
    document.getElementById("K").innerHTML = `K: ${Math.round(k * 100)}%`;
}

function SetHSL(red, green, blue) {
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var l = (max + min) / 2;
    var s = 0;
    var h = 0;

    if(max !== min) {
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        h = (max === r) ? (g - b) / (max - min) : (max === g) ? 2 + (b - r) / (max - min) : 4 + (r - g) / (max - min);
        h = Math.round(h * 60);
    }

    document.getElementById("H").innerHTML = `H: ${h}°`;
    document.getElementById("S").innerHTML = `S: ${Math.round(s * 100)}%`;
    document.getElementById("L").innerHTML = `L: ${Math.round(l * 100)}%`;
}

function SetHSV(red, green, blue) {
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var v = max;
    var s = 0;
    var h = 0;

    if(max !== min) {
        s = (max === 0) ? 0 : (max - min) / max;
        h = (max === r) ? (g - b) / (max - min) : (max === g) ? 2 + (b - r) / (max - min) : 4 + (r - g) / (max - min);
        h = Math.round(h * 60);
    }

    document.getElementById("HSVH").innerHTML = `H: ${h}°`;
    document.getElementById("HSVS").innerHTML = `S: ${Math.round(s * 100)}%`;
    document.getElementById("HSVV").innerHTML = `V: ${Math.round(v * 100)}%`;
}


function LoadImageToCanvas() {
    var img = new Image();
    img.src = URL.createObjectURL(fileInput.files[0]);
    canvasHolder.style.width = "auto";
    canvasHolder.style.height = "auto";
    canvasHolder.style.margin = "5%";
    canvasHolder.style.maxWidth = "90%";
    canvasHolder.style.maxHeight = "90%";
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        canvasHolder.style.aspectRatio = `${img.width}/${img.height}`;
        ctx.drawImage(img, 0, 0);
    }
}
