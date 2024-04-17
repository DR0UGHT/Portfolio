var speed = 1;
var currentFile = './note.mp3';
var uploadedFile;
var usingUploadedFile = false;
//notesAsHz

function playSound(file, octave=0) {
    var audio = new AudioContext();
    var source = audio.createBufferSource();
    var request = new XMLHttpRequest();
    
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        var audioData = request.response;
        audio.decodeAudioData(audioData, function(buffer) {
            source.buffer = buffer;
            source.detune.value = octave;
            source.connect(audio.destination);
            source.start(0);
        }, function(e){"Error with decoding audio data" + e.err});
    }
    request.send();
    return source;
}
var source

function playNote(octave = 0) {
    source = playSound(currentFile, octave/2.0);
}

function setSFX(file) {
    currentFile = file;
}

function stop() {
    source.stop(0);
}

window.onload = function() {
    //if press Q, play sound
    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 81) {
            play();
        }
    });

    //if press W, stop sound
    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 87) {
            stop();
        }
    });

    //if press key 1-10, set speed to 0.1-3
    window.addEventListener('keydown', function(e) {
        if(e.keyCode >= 49 && e.keyCode <= 57) {
            speed = (e.keyCode - 48) / 10;
        }
    });
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}