const url= 'https://api.api-ninjas.com/v1/webscraper?url=https://randomword.com/paragraph';
const _0x1d2a12=_0x19c1;function _0x19c1(_0x24025b,_0x312fb1){const _0x3eb17f=_0x3eb1();return _0x19c1=function(_0x19c1f8,_0x281c32){_0x19c1f8=_0x19c1f8-0x104;let _0x4bb79a=_0x3eb17f[_0x19c1f8];return _0x4bb79a;},_0x19c1(_0x24025b,_0x312fb1);}(function(_0x1ae5b7,_0x13c54d){const _0x2db837=_0x19c1,_0x47c5d0=_0x1ae5b7();while(!![]){try{const _0x2da342=-parseInt(_0x2db837(0x104))/0x1+parseInt(_0x2db837(0x107))/0x2+-parseInt(_0x2db837(0x105))/0x3*(parseInt(_0x2db837(0x10a))/0x4)+-parseInt(_0x2db837(0x10f))/0x5+parseInt(_0x2db837(0x10b))/0x6*(-parseInt(_0x2db837(0x109))/0x7)+parseInt(_0x2db837(0x108))/0x8*(parseInt(_0x2db837(0x10c))/0x9)+parseInt(_0x2db837(0x10e))/0xa*(parseInt(_0x2db837(0x106))/0xb);if(_0x2da342===_0x13c54d)break;else _0x47c5d0['push'](_0x47c5d0['shift']());}catch(_0x4f0fa5){_0x47c5d0['push'](_0x47c5d0['shift']());}}}(_0x3eb1,0xd76c6));function _0x3eb1(){const _0x1a8a5a=['20452sKaYTT','21630OLLgNK','9lqeItZ','Ml432Sl9mqBHGtRfXN8kBQ==nPc5X62r9yOpniLF','4250loTGZS','8593190WJBIoq','573352vDbwPr','606YnYzRE','73436KOvqQi','3353126LqrSaf','8938416tBfllT','2765tEKGOe'];_0x3eb1=function(){return _0x1a8a5a;};return _0x3eb1();}const headers={'X-Api-Key':_0x1d2a12(0x10d)};
const contentType = 'application/json';
var currentlyWriting = false;
var currentParagraph = "";
var currentUpParagraph = "";

var incorrectPositions = [];
var debug = false;
window.onload = async function() {
    SetNewWords();
}

async function getWords() {
    let myPromise = new Promise((myResolve, myReject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader(_0x1d2a12);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = () => {
            if (req.status == 200) {
                const rt = req.responseText.toString();
                const split1 = rt.substring(rt.indexOf("random_word_definition") + 25);
                const split2 = split1.substring(0, split1.indexOf("</div>"));

                myResolve(split2);
            } else {
                //lorum ipsum
                myReject('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.');
            }
        };
        req.send();
    });
    return myPromise;

}


function SetNewWords() {
    if(!debug) {
        getWords().then((result) => {
            //remove all /n from the result
            var newRes = result.replace("\\", " ");
            document.getElementById('text').innerHTML = "<span style='color: blue'>" + newRes[0] + "</span>" + newRes.substring(1);
            currentParagraph = newRes;
            this.document.getElementById('instructions').style.display = "block";
            StartTest();
        });
    }else{
        //lattin thing to test lorem ipsum
        currentParagraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.";
        document.getElementById('text').innerHTML = "<span style='color: blue'>" + currentParagraph[0] + "</span>" + currentParagraph.substring(1);
        this.document.getElementById('instructions').style.display = "block";
        StartTest();
    }
    document.getElementById('time').innerHTML = 0;
    document.getElementById('wpm').innerHTML = 0;
    document.getElementById('accuracy').innerHTML = 100;
    document.getElementById('correctWords').innerHTML = 0;
    document.getElementById('incorrectWords').innerHTML = 0;
}

function StartTest(){
    let currLetter = 0;
    //increase time every second
    let timer = setInterval(() => {
        if(!currentlyWriting) return;
        document.getElementById('time').innerHTML = parseInt(document.getElementById('time').innerHTML) + 1;
    }, 1000);

    //if user presses any key
    //if user presses any key, bind function to input
    window.addEventListener('keydown', function myKey(event) {
        if(!ValidAlphaNumericOrPunctuation(event.key)) return;

        if(!currentlyWriting) {
            currentlyWriting = true;
        }

        if(event.key != "Backspace" && this.document.getElementById('instructions').style.display != "none") {
            this.document.getElementById('instructions').style.display = "none";
        }

        let input = event.key;

        let correctWords = 0;
        let incorrectWords = 0;
        let accuracy = 0;
        let wpm = 0;

        if(event.key == "Backspace") {
            currLetter--;
            if(currLetter < 0) {
                currLetter = 0;
            }
            if(incorrectPositions.length > 0 && currLetter == incorrectPositions[incorrectPositions.length - 1]) {
                incorrectPositions.pop();
            }
        }else{
            if (event.key != currentParagraph[currLetter]) {
                incorrectPositions.push(currLetter);
            }
            currLetter++;
        }


        currentUpParagraph = "";
        incorrectPosCount = 0;
        let amountOfSpaces = 0;
        //add a red span to currentParagraph if good is false
        for(let i = 0; i < currentParagraph.length; i++) {
            if(incorrectPositions[incorrectPosCount] == i) {
                var letter = currentParagraph[i];
                if(letter == " "){
                    currentUpParagraph += "<span style='background-color: rgba(255, 46, 14, 0.369);'>" + letter + "</span>";
                    amountOfSpaces++;
                }else{
                    currentUpParagraph += "<span style='color: red'>" + letter + "</span>";
                }
                incorrectPosCount++;
            }else if(i == currLetter) {
                var letter = currentParagraph[i];
                if(letter == " "){
                    currentUpParagraph += "<span style='background-color: rgba(14, 46, 255, 0.369);'>" + letter + "</span>";
                    amountOfSpaces++;
                }else{
                    currentUpParagraph += "<span style='color: blue'>" + letter + "</span>";
                }
            } else{
                currentUpParagraph += currentParagraph[i];
                if(i < currLetter && currentParagraph[i] == " ") {
                    amountOfSpaces++;
                }
            }
        }

        //calculate correct words
        let words = document.getElementById('text').innerHTML;
        //remove all span tags
        words = words.replaceAll("</span>", "");
        words = words.replaceAll("<span style=\"background-color: rgba(255, 46, 14, 0.369);\">", "");
        words = words.replaceAll("<span style=\"background-color: rgba(14, 46, 255, 0.369);\">", "");
        words = words.replaceAll("<span style=\"color: red\">", "##")
        words = words.replaceAll("<span style=\"color: blue\">", "");
        words = words.split(' ');

        for (let i = 0; i < words.length && i < amountOfSpaces; i++) {
            if (words[i] === currentParagraph.split(' ')[i]) {
                correctWords++;
            } else {
                incorrectWords++;
            }
        }

        document.getElementById('text').innerHTML = currentUpParagraph;

        if (currLetter === currentParagraph.length) {
            clearInterval(timer);
            window.removeEventListener('keydown', myKey);

            this.document.getElementById('instructions').style.display = "block";
            this.document.getElementById('instructions').innerHTML = "Race is over!\n";
            this.document.getElementById('instructions').innerHTML += "Your got " + wpm + " words per minute!\n";
            this.document.getElementById('instructions').innerHTML += "Press Enter to start a new race!";

            window.addEventListener('keydown', function(event) {
                
                if(event.key == "Enter") {
                    window.location.reload();
                }
            });
        }

        //calculate accuracy of letters
        accuracy = 100 - Math.round((incorrectPositions.length / currLetter) * 100);

        //calculate wpm
        wpm = (correctWords / (parseInt(document.getElementById('time').innerHTML) / 60)).toFixed(0);
        if (isNaN(wpm)) {
            wpm = 0;
        }
        document.getElementById('correctWords').innerHTML = correctWords;
        document.getElementById('incorrectWords').innerHTML = incorrectWords;
        document.getElementById('wpm').innerHTML = wpm;
        document.getElementById('accuracy').innerHTML = accuracy;
    });
}


function ValidAlphaNumericOrPunctuation(key) {
    return (key.match(/^[0-9a-zA-Z.,!? :;'"+=-]+$/) !== null && key != "Shift" && key != "CapsLock");
}
