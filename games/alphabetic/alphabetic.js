function ConvertAlphabeticToMorse(){
    let AlphabeticHolder = document.getElementById("alphabetic").value;
    let morseHolder = document.getElementById("morse");

    let AlphabeticArray = AlphabeticHolder.split("");
    let morseArray = [];

    for (let i = 0; i < AlphabeticArray.length; i++) {
        let Alphabetic = AlphabeticArray[i];
        let morse = AlphabeticToMorse(Alphabetic);
        morseArray.push(morse);
    }

    console.log(morseArray);
    morseHolder.value = morseArray.join(" ");
}

function AlphabeticToMorse(Alphabetic){
    switch (Alphabetic.toLowerCase()) {
        case "a":
            return ".-";
        case "b":
            return "-...";
        case "c":
            return "-.-.";
        case "d":
            return "-..";
        case "e":
            return ".";
        case "f":
            return "..-.";
        case "g":
            return "--.";
        case "h":
            return "....";
        case "i":
            return "..";
        case "j":
            return ".---";
        case "k":
            return "-.-";
        case "l":
            return ".-..";
        case "m":
            return "--";
        case "n":
            return "-.";
        case "o":
            return "---";
        case "p":
            return ".--.";
        case "q":
            return "--.-";
        case "r":
            return ".-.";
        case "s":
            return "...";
        case "t":
            return "-";
        case "u":
            return "..-";
        case "v":
            return "...-";
        case "w":
            return ".--";
        case "x":
            return "-..-";
        case "y":
            return "-.--";
        case "z":
            return "--..";
        case "1":
            return ".----";
        case "2":
            return "..---";
        case "3":
            return "...--";
        case "4":
            return "....-";
        case "5":
            return ".....";
        case "6":
            return "-....";
        case "7":
            return "--...";
        case "8":
            return "---..";
        case "9":
            return "----.";
        case "0":
            return "-----";
        default:
            return "";
    }
}

function ConvertMorseToAlphabetic(){
    let morseHolder = document.getElementById("morse").value;
    let AlphabeticHolder = document.getElementById("alphabetic");

    let morseArray = morseHolder.split(" ");
    let AlphabeticArray = [];

    for (let i = 0; i < morseArray.length; i++) {
        let morse = morseArray[i];
        let Alphabetic = MorseToAlphabetic(morse);
        AlphabeticArray.push(Alphabetic);
    }

    AlphabeticHolder.value = AlphabeticArray.join("");
}

function MorseToAlphabetic(morse){
    switch (morse) {
        case ".-":
            return "a";
        case "-...":
            return "b";
        case "-.-.":
            return "c";
        case "-..":
            return "d";
        case ".":
            return "e";
        case "..-.":
            return "f";
        case "--.":
            return "g";
        case "....":
            return "h";
        case "..":
            return "i";
        case ".---":
            return "j";
        case "-.-":
            return "k";
        case ".-..":
            return "l";
        case "--":
            return "m";
        case "-.":
            return "n";
        case "---":
            return "o";
        case ".--.":
            return "p";
        case "--.-":
            return "q";
        case ".-.":
            return "r";
        case "...":
            return "s";
        case "-":
            return "t";
        case "..-":
            return "u";
        case "...-":
            return "v";
        case ".--":
            return "w";
        case "-..-":
            return "x";
        case "-.--":
            return "y";
        case "--..":
            return "z";
        case ".----":
            return "1";
        case "..---":
            return "2";
        case "...--":
            return "3";
        case "....-":
            return "4";
        case ".....":
            return "5";
        case "-....":
            return "6";
        case "--...":
            return "7";
        case "---..":
            return "8";
        case "----.":
            return "9";
        case "-----":
            return "0";
        default:
            return " ";
    }
}

