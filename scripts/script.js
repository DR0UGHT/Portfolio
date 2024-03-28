dontShoot = false;
spinning = false;
prevX = 0;


window.onload = function() {
    if(document.getElementById("content-container").children.length != 4) {
        window.location.reload();
    }
}

function movePlayer() {
    //get the x position of the mouse
    var x = event.clientX;

    //if the player is not moving, return
    if(prevX == x) return;

    //get max x
    maxX = document.getElementsByClassName("background")[0].clientWidth;

    //set the new x position of the player
    prevX = Math.min(96.5, Math.max(3.5, x / maxX * 100));

    //set the new x position of the player
    document.getElementById("playerobj").style.left = prevX - 3.5 + "%";
}

function shootBullet() {
    //if the player is spinning or the player is not allowed to shoot, return
    if(spinning || dontShoot) return;
    
    //get the max x and y
    maxX = document.getElementsByClassName("background")[0].clientWidth;
    maxY = document.getElementsByClassName("background")[0].clientHeight;

    //create a bullet, set its class, and append it to the player
    var bullet = document.createElement("img");
    bullet.className = "bullet-image";
    document.getElementById("player").appendChild(bullet);

    //set the bullet position
    bulletPosition = (prevX - 0.21);
    bullet.style.left = bulletPosition + "%";
    bullet.style.top = "90%";


    //booleans to check if the bullet is gonna hit a page button
    gonnaHitProjects = bulletPosition >= 16.06 && bulletPosition <= 31.06;
    gonnaHitGames = bulletPosition >= 33.54 && bulletPosition <= 48.42;
    gonnaHitSkills = bulletPosition >= 51.15 && bulletPosition <= 65.79;
    gonnaHitAbout = bulletPosition >= 68.51 && bulletPosition <= 83.63;
    gonnaHitProfile = bulletPosition > 48.42 && bulletPosition < 51.15;

    //set the id of the bullet if it is gonna hit a page button
    if(gonnaHitProjects) {
        bullet.id = "bullet-projects";
    }else if(gonnaHitGames) {
        bullet.id = "bullet-games";
    }else if(gonnaHitAbout) {
        bullet.id = "bullet-about";
    }else if(gonnaHitSkills) {
        bullet.id = "bullet-skills";
    }else if(gonnaHitProfile) {
        bullet.id = "bullet-profile";
    }

    //move the bullet upwards until it hits a page button or the top of the screen
    var bulletInterval = setInterval(function() {
        //parse top and height of bullet
        bullet.style.top = (parseInt(bullet.style.top) - 1) + "%";

        //if the bullet is gonna hit a page button, clear the interval and remove the bullet
        switch(bullet.id) {
            case "bullet-projects":
            case "bullet-games":
            case "bullet-about":
            case "bullet-skills":
                if (parseInt(bullet.style.top) <= 35) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                    DamageButton(bullet.id);
                }
                break;
            case "bullet-profile":
                if (parseInt(bullet.style.top) <= 15) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                    DamageProfile();
                }
                break;
        }
    }, 15);
}

function DamageProfile() {
    //if the player is spinning or the player is not allowed to shoot, return
    if(dontShoot || spinning) return;

    //get the health of the profile
    const element = document.querySelector("#profile-image-background");
    health = parseInt(element.style.fontSize);

    //use font size to store health
    if(element.style.fontSize == "") {
        health = 100;
    }

    //decrease health by 10
    health -= 10;

    //set the new health visual
    if(health >= 50) {
        deg = -90 + ((100 - health) / 50) * 180;
        element.style.cssText = "background: linear-gradient(" + deg +"deg, #bcaef5 50%, transparent 50%), linear-gradient(-90deg, #c93131 50%, #bcaef5 50%), linear-gradient(90deg, #bcaef5 50%, transparent 50%); position: relative; width: 7.5vw; height: 7.5vw; margin-top: -98.5%; margin-left: -3.35%; border-radius: 50%; font-size: 0; z-index: 1; font-size: " + health + "%;";
    }else if (health < 50 && health > 0) {
        deg = -90 + ((50 - health) / 50) * 180;
        element.style.cssText = "background: linear-gradient(" + deg +"deg, #c93131 50%, transparent 50%), linear-gradient(-90deg, #c93131 50%, #bcaef5 50%), linear-gradient(90deg, #bcaef5 50%, #bcaef5 50%); position: relative; width: 7.5vw; height: 7.5vw; margin-top: -98.5%; margin-left: -3.35%; border-radius: 50%; font-size: 0; z-index: 1; font-size: " + health + "%;";
    }else if(health <= 0){
        element.style.cssText = "background: linear-gradient(90deg, #c93131 50%, #c93131 50%), linear-gradient(-90deg, #c93131 50%, #bcaef5 50%), linear-gradient(90deg, #bcaef5 50%, #bcaef5 50%); position: relative; width: 7.5vw; height: 7.5vw; margin-top: -98.5%; margin-left: -3.35%; border-radius: 50%; font-size: 0; z-index: 1; font-size: " + health + "%;";
    
        //spin element with class progile-image 360 10 times within 3 seconds
        var timeGone = 0;
        const elem = document.getElementsByClassName("profile-image")[0];
        elem.className = "profile-image-spin";
        health = 0;
        spinning = true;

        //spin the element
        var spinInterval = setInterval(function() {   
            timeGone += 0.015;
            health +=  0.3;
            if(health >= 50) {
                deg = -90 + ((100 - health) / 50) * 180;
                element.style.cssText = "background: linear-gradient(" + deg +"deg, #bcaef5 50%, transparent 50%), linear-gradient(-90deg, #c93131 50%, #bcaef5 50%), linear-gradient(90deg, #bcaef5 50%, transparent 50%); position: relative; width: 7.5vw; height: 7.5vw; margin-top: -98.5%; margin-left: -3.35%; border-radius: 50%; font-size: 0; z-index: 1; font-size: " + health + "%;";
            }else if (health < 50 && health > 0) {
                deg = -90 + ((50 - health) / 50) * 180;
                element.style.cssText = "background: linear-gradient(" + deg +"deg, #c93131 50%, transparent 50%), linear-gradient(-90deg, #c93131 50%, #bcaef5 50%), linear-gradient(90deg, #bcaef5 50%, #bcaef5 50%); position: relative; width: 7.5vw; height: 7.5vw; margin-top: -98.5%; margin-left: -3.35%; border-radius: 50%; font-size: 0; z-index: 1; font-size: " + health + "%;";
            }

            if (timeGone >= 5.0) {
                clearInterval(spinInterval);
                element.style.cssText = "background: linear-gradient(-90deg, #bcaef5 50%, transparent 50%), linear-gradient(-90deg, #c93131 50%, #bcaef5 50%), linear-gradient(90deg, #bcaef5 50%, transparent 50%); position: relative; width: 7.5vw; height: 7.5vw; margin-top: -98.5%; margin-left: -3.35%; border-radius: 50%; font-size: 0; z-index: 1; font-size: " + health + "%;";
                elem.className = "profile-image";
                spinning = false;
            }            
        }, 15);
    }

}
function DamageButton(buttonName) {
    //if the player is spinning or the player is not allowed to shoot, return
    if(dontShoot || spinning) return;

    //get the correct button
    const elemnt = document.getElementById(buttonName.replace("bullet-", ""));

    //set the visual of the button
    if(elemnt.style.backgroundImage == "url(\"images/old_school_button.png\")" || elemnt.style.backgroundImage == "") {
        elemnt.style.backgroundImage = "url(\"images/old_school_button_1.png\")";
    }else if(elemnt.style.backgroundImage == "url(\"images/old_school_button_1.png\")") {
        elemnt.style.backgroundImage = "url(\"images/old_school_button_2.png\")";
    }else if(elemnt.style.backgroundImage == "url(\"images/old_school_button_2.png\")") {
        dontShoot = true;

        //find the other buttons and set their visual to the default
        var elemnts = ["projects", "games", "about", "skills"];
        elemnts.forEach(function(elemnt) {
            if(elemnt != buttonName.replace("bullet-", "")){
                document.getElementById(elemnt).style.backgroundImage = "url(\"images/old_school_button.png\")";
            }
        });

        //copy the button
        var prevButton = document.getElementById(buttonName.replace("bullet-", ""));
        var goToPage = buttonName.replace("bullet-", "") + ".html";

        var newButton = prevButton.cloneNode(true);
        newButton.style.backgroundImage = "url(\"images/old_school_button_4.png\")";
        //delete the first child of the new button
        newButton.children[0].remove();

        //set margins and width of the new button
        newButton.style.left = "-25px";
        newButton.style.marginRight = "3px";
        newButton.style.width = "150px";
        newButton.style.zIndex = "1";

        //add the new button to the document
        document.getElementById("content-container").insertBefore(newButton, prevButton);
        
        //button 2
        newButton1 = prevButton.cloneNode(true);
        newButton1.style.backgroundImage = "url(\"images/old_school_button_3.png\")";
        //delete the first child of the new button
        newButton1.children[0].remove();

        //set margin
        newButton1.style.marginLeft = "3px";
        newButton1.style.width = "150px";
        newButton1.style.zIndex = "1";
        
        newButton.className = "page-button-fall-left";
        newButton1.className = "page-button-fall-right";

        document.getElementById("content-container").insertBefore(newButton, prevButton);
        document.getElementById("content-container").insertBefore(newButton1, prevButton);

        document.getElementById("content-container").removeChild(prevButton);

        //set the new button to fall
        timeGone = 0;
        var buttonInterval = setInterval(function() {   
            timeGone += 0.015;       
            if (timeGone >= 1) {
                clearInterval(buttonInterval);
                
                window.location.href = goToPage;
            }            
        }, 15);
    }
    const lastState = elemnt.style.backgroundImage;

    //set the button back to the default visual
    setTimeout(function() {
        if(lastState == elemnt.style.backgroundImage && !dontShoot)
        elemnt.style.backgroundImage = "url(\"images/old_school_button.png\")";
    }, 1900);
}
