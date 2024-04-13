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
        case "Reaction Time":
            window.open('./reactionTime/reactionTime.html', '_blank');
            break;
        
    }
}