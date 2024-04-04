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
    }
}