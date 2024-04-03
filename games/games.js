function LoadGame(game) {
    //open in new tab
    switch (game) {
        case "Sand Simulator":
            window.open('./sandSimulation/sandSimulator.html', '_blank');
        case "Pong":
            window.open('./pong/pong.html', '_blank');
        case "Circular Accuracy":
            window.open('./circleAcuracy/circle.html', '_blank');
    }
}