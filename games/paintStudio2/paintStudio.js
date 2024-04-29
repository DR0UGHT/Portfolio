var painting = false;
var selecting = false;
var editSelecting = false;

var strokes = [];
var redo = [];
var isFullScreen = false;
var ctx;

var showGridSize = 10;
var zoomX = 96.0;
var zoomY = 96.0;

var selectStart = {x: 0, y: 0};
var selectEnd = {x: -1, y: -1};

var copyData = null;

var currentTool = 'pen';

var fileDropdown, editDropdown, viewDropdown;

window.onload = function() {
    document.getElementById('drawI').style.background = '#3939394c';
    
    var canvas = document.getElementById('canvas');
    var canvasgrid = document.getElementById('grid');
    var canvasSel = document.getElementById('select');

    let screenW = window.outerWidth;
    let screenH = window.outerHeight;

    canvas.style.width = "96%";
    canvas.style.height = "96%";
    canvas.width = screenW * 0.8;
    canvas.height = screenH * 0.8;
    canvas.style.marginTop = "0%";

    canvasgrid.style.width = "95%";
    canvasgrid.style.height = "77%";
    canvasgrid.width = screenW * 0.8;
    canvasgrid.height = screenH * 0.8;
    canvasgrid.style.marginTop = "0%";
    
    canvasSel.style.width = "95%";
    canvasSel.style.height = "77%";
    canvasSel.width = screenW * 0.8;
    canvasSel.height = screenH * 0.8;
    canvasSel.style.marginTop = "0%";


    ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true, imageSmoothingEnabled: true, imageSmoothingQuality: 'high', antialias: true});

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    painting = false;

    //mouse move
    window.addEventListener('mousemove', function(e) {
        if (painting) {
            let x = e.clientX;
            let y = e.clientY;
            let xOnCanvas = (x - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width);
            let yOnCanvas = (y - canvas.getBoundingClientRect().top) * (canvas.height / canvas.getBoundingClientRect().height);
            let isPenOnCanvas = x < canvas.getBoundingClientRect().right && x > canvas.getBoundingClientRect().left && y < canvas.getBoundingClientRect().bottom && y > canvas.getBoundingClientRect().top;
            var ctx = canvas.getContext('2d');
            if(isPenOnCanvas) {
                ctx.lineTo(xOnCanvas, yOnCanvas);
            }else{
                ctx.moveTo(xOnCanvas, yOnCanvas);
            }
            ctx.stroke();
        }else if(selecting){
            var canvasSel = document.getElementById('select');
            var ctx = canvasSel.getContext('2d');

            let x = e.clientX;
            let y = e.clientY;

            let xOnCanvas = (x - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width);
            let yOnCanvas = (y - canvas.getBoundingClientRect().top) * (canvas.height / canvas.getBoundingClientRect().height);
            let isPenOnCanvas = x < canvas.getBoundingClientRect().right && x > canvas.getBoundingClientRect().left && y < canvas.getBoundingClientRect().bottom && y > canvas.getBoundingClientRect().top;

            let w = xOnCanvas - selectStart.x;
            let h = yOnCanvas - selectStart.y;

            if(!isPenOnCanvas) return;

          DrawSelectionBox(false)     
            
            selectEnd.x = xOnCanvas;
            selectEnd.y = yOnCanvas;
        }
    });

    //mouse down
    canvas.addEventListener('mousedown', function(e) {
        if (event.button != 0)  return;

        if(currentTool == 'pen'){
            painting = true;
            ctx.beginPath();
        }else if(currentTool == 'select'){
            let xOnCanvas = (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width);
            let yOnCanvas = (e.clientY - canvas.getBoundingClientRect().top) * (canvas.height / canvas.getBoundingClientRect().height);
            selecting = true;
            selectStart.x = xOnCanvas;
            selectStart.y = yOnCanvas;
        }
    });

    //mouse up
    window.addEventListener('mouseup', function() {
        if (event.button != 0)  return;
        
        if(painting){
            strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            redo = [];
        }else if(selecting){
            DrawSelectionBox(true);
        }


        painting = false;
        selecting = false;
    });

    //disable right click
    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });


    window.addEventListener('mousedown', function(e) {
        let x = (e.clientX / window.innerWidth) * 100;
        let y = (e.clientY / window.innerHeight) * 100;


        if(fileDropdown.style.display == 'flex'){
            if(x > 10.3 || y > 28.5){
                fileDropdown.style.display = 'none';
            }
        }else if(editDropdown.style.display == 'flex'){
            if(x > 13.5 || x < 3.3 || y > 28.5){
                editDropdown.style.display = 'none';
            }
        }else if(viewDropdown.style.display == 'flex'){
            if(x > 13.5 || x < 3.3 || y > 28.5){
                viewDropdown.style.display = 'none';
            }
        }
    });

    //bind escape key to close dropdowns
    window.addEventListener('keydown', function(e) {
        if(e.key == 'Escape'){
            fileDropdown.style.display = 'none';
            editDropdown.style.display = 'none';
            viewDropdown.style.display = 'none';
        }
    });

    fileDropdown = document.getElementById('fileDropdown');
    editDropdown = document.getElementById('editDropdown');
    viewDropdown = document.getElementById('viewDropdown');

    document.addEventListener('fullscreenchange', function() {
        isFullScreen = !isFullScreen;
    });
}

function DrawSelectionBox(needDragDots){
    var canvasSel = document.getElementById('select');
    var ctx = canvasSel.getContext('2d');

    let w = selectEnd.x - selectStart.x;
    let h = selectEnd.y - selectStart.y;

    if(w == 0 || h == 0) return;

    ctx.clearRect(0, 0, canvasSel.width, canvasSel.height);
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.strokeRect(selectStart.x, selectStart.y, w, h);     

    if(needDragDots){
        //draw 4 drag dots in the 4 corners of the selection box
        ctx.lineWidth = 5;
        ctx.setLineDash([]);
        ctx.strokeRect(selectStart.x - 5, selectStart.y - 5, 10, 10);
        ctx.strokeRect(selectEnd.x - 5, selectStart.y - 5, 10, 10);
        ctx.strokeRect(selectStart.x - 5, selectEnd.y - 5, 10, 10);
        ctx.strokeRect(selectEnd.x - 5, selectEnd.y - 5, 10, 10);
        //draw 4 dots in the middle of the 4 sides of the selection box
        ctx.strokeRect(selectStart.x + w/2 - 5, selectStart.y - 5, 5, 5);
        ctx.strokeRect(selectStart.x + w/2 - 5, selectEnd.y - 5, 5, 5);
        ctx.strokeRect(selectStart.x - 5, selectStart.y + h/2 - 5, 5, 5);
        ctx.strokeRect(selectEnd.x - 5, selectStart.y + h/2 - 5, 5, 5);
        
    }

}

function Select(){
    currentTool = 'select';
    document.getElementById('canvas').style.cursor = 'crosshair';

    document.getElementById('selectI').style.background = '#3939394c';
    document.getElementById('drawI').style.background = 'transparent';
}

function Draw(){
    currentTool = 'pen';
    ClearSelectionDraw();
    
    document.getElementById('canvas').style.cursor = 'default';

    document.getElementById('selectI').style.background = 'transparent';
    document.getElementById('drawI').style.background = '#3939394c';

    selectEnd.x = -1;
    selectEnd.y = -1;
}

function OpenCloseFileDropdown() {
    if (fileDropdown.style.display == 'none') {
        fileDropdown.style.display = 'flex';
    } else {
        fileDropdown.style.display = 'none';
    }

    editDropdown.style.display = 'none';
    viewDropdown.style.display = 'none';
}

function OpenCloseEditDropdown() {
    if (editDropdown.style.display == 'none') {
        editDropdown.style.display = 'flex';
    } else {
        editDropdown.style.display = 'none';
    }

    fileDropdown.style.display = 'none';
    viewDropdown.style.display = 'none';
}

function OpenCloseViewDropdown() {
    if (viewDropdown.style.display == 'none') {
        viewDropdown.style.display = 'flex';
    } else {
        viewDropdown.style.display = 'none';
    }

    fileDropdown.style.display = 'none';
    editDropdown.style.display = 'none';
}

function ClearCanvas() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = [];
}
    
function Undo(){
    if(strokes.length === 0) return;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    redo.push(strokes[strokes.length - 1]);
    strokes.pop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(function(stroke) {
        ctx.putImageData(stroke, 0, 0);
    });

}

function Redo(){
    if(redo.length === 0) return;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    strokes.push(redo.pop());
    ctx.putImageData(strokes[strokes.length - 1], 0, 0);
}

function NewStructure(){
    fileDropdown.style.display = 'none';

    if(strokes.length === 0){
        ClearCanvas();
        return;
    }
    var confirm = document.getElementsByClassName('conformation')[0];
    confirm.style.display = 'flex';
}

function ConfirmNo(){
    var confirm = document.getElementsByClassName('conformation')[0];
    confirm.style.display = 'none';
}

function ConfirmYes(){
    var confirm = document.getElementsByClassName('conformation')[0];
    confirm.style.display = 'none';
    ClearCanvas();
}

function OpenFile(){
    fileDropdown.style.display = 'none';
    //open up file sytem then load any png or jpg file to the canvas
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => { 
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            var image = new Image();
            image.src = content;
            image.onload = function() {
                //if the image.width is greater than the canvas.width or image.height is greater than the canvas.height, ratio both down to fit the canvas
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                var ratio = 1;
                var imageW = image.width;
                var imageH = image.height;
                if(imageW > canvas.width || imageH > canvas.height){
                    ratio = Math.min(canvas.width / imageW, canvas.height / imageH);
                }
                imageW *= ratio;
                imageH *= ratio;

                strokes = [];
                redo = [];

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, imageW, imageH);
                strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            }
        }
    }
    input.click();
}

function SaveFile(){
    fileDropdown.style.display = 'none';
    var canvas = document.getElementById('canvas');
    var link = document.createElement('a');
    link.download = 'painting.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

async function PrintFile(){
    fileDropdown.style.display = 'none';
    var canvas = document.getElementById('canvas');
    
    var printWindow = window.open('', '', 'width=' + canvas.width + ',height=' + canvas.height);
    printWindow.document.write('<img src="' + canvas.toDataURL('image/png') + '" />');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    await new Promise(resolve => setTimeout(resolve, 1000));
    printWindow.close();
}

function ZoomIn(){
    var canvas = document.getElementById('canvas');
    zoomX += 5;
    zoomY += 5;
    canvas.style.width = zoomX + "%";
    canvas.style.height = zoomY + "%";
}

function ZoomOut(){
    var canvas = document.getElementById('canvas');
    zoomX -= 5;
    zoomY -= 5;
    canvas.style.width = zoomX + "%";
    canvas.style.height = zoomY + "%";
}

function FullScreen(){
    //fullscreen chrome
    if(!isFullScreen){
        document.body.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
}

//put
function ShowGrid(){
    var canvas = document.getElementById('grid');

    if(canvas.style.visibility == 'hidden'){
        canvas.style.visibility = 'visible';
    }
    else{
        canvas.style.visibility = 'hidden';
        return;
    }

    DrawGrid();
}

function DrawGrid(){
    var canvas = document.getElementById('grid');

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(function(stroke) {
        ctx.putImageData(stroke, 0, 0);
    });

    var x = 0;
    var y = 0;
    var w = canvas.width;
    var h = canvas.height;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    while(x < w){
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        x += showGridSize * 10;
    }
    while(y < h){
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        y += showGridSize * 10;
    }
    ctx.stroke();
}

function UpdateGridSize(){
    var input = document.getElementById('gridSize');
    showGridSize = input.value;
    document.getElementById('gridSizeValue').innerText = showGridSize;
    DrawGrid();
}

function Copy(){
    editDropdown.style.display = 'none';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var w = selectEnd.x - selectStart.x;
    var h = selectEnd.y - selectStart.y;

    if(w == 0 || h == 0) return;

    copyData = ctx.getImageData(selectStart.x, selectStart.y, w, h);
}

function Paste(){
    editDropdown.style.display = 'none';
    if(copyData == null) return;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.putImageData(copyData, 0, 0);
    strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redo = [];

    ClearSelectionDraw();
}

function ClearSelectionDraw(){
    var canvasSel = document.getElementById('select');
    var ctx = canvasSel.getContext('2d');
    ctx.clearRect(0, 0, canvasSel.width, canvasSel.height);
}

function Cut(){
    editDropdown.style.display = 'none';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var w = selectEnd.x - selectStart.x;
    var h = selectEnd.y - selectStart.y;

    if(w == 0 || h == 0) return;

    copyData = ctx.getImageData(selectStart.x, selectStart.y, w, h);
    ctx.clearRect(selectStart.x, selectStart.y, w, h);
    strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redo = [];

    ClearSelectionDraw();
}

function Crop(){
    if(currentTool !== 'select') return;
    if(selectEnd.x == -1 || selectEnd.y == -1) return;
    editDropdown.style.display = 'none';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var w = selectEnd.x - selectStart.x;
    var h = selectEnd.y - selectStart.y;

    if(w == 0 || h == 0) return;


    SetCanvasSize(w, h);
    copyData = ctx.getImageData(selectStart.x, selectStart.y, w, h);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(copyData, 0, 0);
    strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redo = [];

    ClearSelectionDraw();
}


function SetCanvasSize(sizex, sizey){
    var canvas = document.getElementById('canvas');
    var canvasgrid = document.getElementById('grid');
    var canvasSel = document.getElementById('select');

    var widthRatio = lerp(10, 96, sizex / window.innerWidth);
    var widthRatio1 = lerp(10, 95, sizex / window.innerWidth);
    var HeightRatio = lerp(10, 77, sizey / window.innerHeight);

    canvas.style.width = widthRatio + "%";
    canvas.style.height = HeightRatio + "%"
    canvas.width = sizex;
    canvas.height = sizey;

    canvasgrid.style.width = widthRatio1 + "%";
    canvasgrid.style.height = (HeightRatio*77) + "%";
    canvasgrid.width = sizex;
    canvasgrid.height = sizey;
    
    canvasSel.style.width = widthRatio1 + "%";
    canvasSel.style.height = (HeightRatio*77) + "%";
    canvasSel.width = sizex;
    canvasSel.height = sizey;

    console.log(canvas.width + " " + canvas.height);
}

function lerp(a, b, t){
    return a + (b - a) * t;
}