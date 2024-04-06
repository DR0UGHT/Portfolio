const url= 'https://api.api-ninjas.com/v1/webscraper?url=https://random-word-api.herokuapp.com/word?length=5';
const headers = { 'X-Api-Key': 'Ml432Sl9mqBHGtRfXN8kBQ==nPc5X62r9yOpniLF' };
const contentType = 'application/json';
var debug = true;

window.onload = async function() {
    SetNewWord();
}

async function GetWord() {
    let myPromise = new Promise((myResolve, myReject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader('X-Api-Key', 'Ml432Sl9mqBHGtRfXN8kBQ==nPc5X62r9yOpniLF');
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = () => {
            if (req.status == 200) {
                //get the json response
                const rt = JSON.parse(req.responseText);
                var word = rt.data.substring(2, rt.data.length - 2);
                myResolve(word);
            } else {
                //lorum ipsum
                myReject('quick');
            }
        };
        req.send();
    });
    return myPromise;
}


function SetNewWord() {
    if(!debug) {
        GetWord().then((result) => {
            console.log(result);
        });
    }else{
        console.log("quick");
    }
}

