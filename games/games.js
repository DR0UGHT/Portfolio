function LoadGame(game) {
    //open in new tab
    switch (game) {
        case "Sand Simulator":
            window.open('./sandSimulation/sandSimulator.html', '_blank');
            break;
        case "Pong":
            window.open('./pong/pong.html', '_blank');
            break;
        case "Circular Accuracy":
            window.open('./circleAcuracy/circle.html', '_blank');
            break;
        case "Calorie Calculator":
            window.open('./calorieCarnival/calorie.html', '_blank');
            break;
        case "Type Racer":
            window.open('./typeRacer/typeRacer.html', '_blank');
            break;
        case "Wordle":
            window.open('./wordle/wordle.html', '_blank');
            break;
        case "Popular Movie":
            window.open('./popularMovie/popularMovie.html', '_blank');
            break;
        case "Target Practice":
            window.open('./targetPractice/targetPractice.html', '_blank');
            break;
        case "Double Snake":
            window.open('./doubleSnake/doubleSnake.html', '_blank');
            break;
        case "Sorting Algorithm":
            window.open('./sortingAlgorithm/sortingAlgorithm.html', '_blank');
            break;
        
    }
}

window.onload = function () {

    GetVersionFromGithub();

}

function GetVersionFromGithub() {
    const headers = { 'X-Api-Key': 'Ml432Sl9mqBHGtRfXN8kBQ==nPc5X62r9yOpniLF' };
    var url = "https://api.api-ninjas.com/v1/webscraper?url=https://github.com/DR0UGHT/Portfolio";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
        }
    }
}
