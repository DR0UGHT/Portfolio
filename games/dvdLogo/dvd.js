var cornerHits = 0;
var nonCornerHits = 0;

var dvd;

let winMin = {x: 0, y: 0};
let winMax = {x: 100, y: 100};

window.onload = function() {
    dvd = document.getElementById("dvd");

    CreateDVD();
    moveDVD();
}

function CreateDVD() {
    dvd = document.createElement("div");
    dvd.style.position = "absolute";
    dvd.style.width = "10vw";
    dvd.style.height = "10vw";
    dvd.style.border = "none";
    dvd.style.backgroundColor = "transparent";
    dvd.style.content = "url('../images/dvd.png')";
    dvd.style.left = "50vw";
    dvd.style.top = "50vh";
    dvd.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(dvd);
}

async function moveDVD() {
    let randomRadion = 40 * Math.PI / 180;
    let rotationAmount = Math.floor(Math.random() * 4);
    let finalRot = randomRadion + (rotationAmount * Math.PI / 2);
    let dir = {x: Math.cos(finalRot), y: Math.sin(finalRot)}

    let speed = 0.2;
    let dvdWidth = parseFloat(dvd.style.width.replace("vw", ""));
    let dvdHeight = parseFloat(dvd.style.height.replace("vh", ""));
    let justHitCorner = false;
    while(true){
        let dvdX = parseFloat(dvd.style.left.replace("vw", ""));
        let dvdY = parseFloat(dvd.style.top.replace("vh", ""));

        if(!dvdX || !dvdY){
            dvdX = 50;
            dvdY = 50;
        }

        if(dvdX + dir.x * speed - dvdWidth/2 < winMin.x || dvdX + dir.x * speed + dvdWidth/2 > winMax.x){
            dir.x *= -1;
            //add a slight amount of randomness to the direction
            dir.y = dir.y + (Math.random() - 0.5) * 0.1;

            if((dvdY >= 94 || dvdY <= 6) && !justHitCorner){
                cornerHits++;
                justHitCorner = true;
                UpdateNumberDisplay();
            }else{
                if(justHitCorner){
                    justHitCorner = false;
                }else{
                    nonCornerHits++;
                    UpdateNumberDisplay();
                }
            }
        }else if(dvdY + dir.y * speed - dvdHeight/2 < winMin.y || dvdY + dir.y * speed + dvdHeight/2 > winMax.y){
            dir.y *= -1;
            //add a slight amount of randomness to the direction
            dir.x = dir.x + (Math.random() - 0.5) * 0.1;

            if((dvdX >= 94 || dvdX <= 6) && !justHitCorner){
                justHitCorner = true;
                cornerHits++;
                UpdateNumberDisplay();
            }else{
                if(justHitCorner){
                    justHitCorner = false;
                }else{
                    nonCornerHits++;
                    UpdateNumberDisplay();
                }
            }
        }        

        dvd.style.left = dvdX + dir.x * speed + "vw";
        dvd.style.top = dvdY + dir.y * speed + "vh";
        await new Promise(r => setTimeout(r, 10));
    }
}


function UpdateNumberDisplay(){
    document.getElementById("cornerHits").innerText = cornerHits;
    document.getElementById("nonCornerHits").innerText = nonCornerHits;
}