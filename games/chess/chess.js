let currentTurn = 'w';
let enPassant = '-';
let halfMoveClock = 0;
let fullMoveNumber = 1;
let whiteCanCastleKingSide = true;
let whiteCanCastleQueenSide = true;
let blackCanCastleKingSide = true;
let blackCanCastleQueenSide = true;
let inGame = false;
let whiteInCheck = false;
let blackInCheck = false;
let showAttack = false;

var stockfish = new Worker("stockfish.js-Stockfish11/src/stockfish.js");

let chessGrid = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['--', '--', '--', '--', '--', '--', '--', '--'],
    ['--', '--', '--', '--', '--', '--', '--', '--'],
    ['--', '--', '--', '--', '--', '--', '--', '--'],
    ['--', '--', '--', '--', '--', '--', '--', '--'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
]
window.onload = function () {
    EnablePieceClicks(true);
    ClearDots();
    ComputerMove();
    //bind space to print FEN
    document.body.onkeyup = function(e){
        if(e.keyCode == 32){
            // console.log(chessGridToFen(chessGrid));
            showAttack = !showAttack;
        }
    }

    var stockfish = stockfish();
    stockfish.postMessage('uci');
}

async function ComputerMove(){
    while(!inGame){
        await new Promise(r => setTimeout(r, 1000));
    }

    while(inGame){
        while(currentTurn == 'w'){
            await new Promise(r => setTimeout(r, 1000));
        }

        let move = await GetStockfishMove();

        let from = move.substring(0, 2);
        let to = move.substring(2, 4);

        MovePieces(from, to);
    }
}
function chessGridToFen(chessGrid) {
    let fen = '';
    for (let i = chessGrid.length-1; i >= 0; i--) {
        let empty = 0;
        for (let j = 0; j < chessGrid[i].length; j++) {
            if (chessGrid[i][j] === '--') {
                empty++;
            } else {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                fen += chessGrid[i][j];
            }
        }
        if (empty > 0) {
            fen += empty;
        }
        if (i > 0) {
            fen += '/';
        }
    }

    fen += ' ' + currentTurn + ' ';
    fen += whiteCanCastleKingSide ? 'K' : '';
    fen += whiteCanCastleQueenSide ? 'Q' : '';
    fen += blackCanCastleKingSide ? 'k' : '';
    fen += blackCanCastleQueenSide ? 'q' : '';
    fen += ' ';
    fen += enPassant + ' ';
    fen += halfMoveClock + ' ';
    fen += fullMoveNumber;

    return fen;
}

function ClickAPiece(pieceType, pos){
    ClearDots();

    ShowDots();
    let row = algebraicToRowCol(pos)[0];
    let col = algebraicToRowCol(pos)[1];    
    //console.log(row, col);
    let placesToMarker = ClieckedPiece(pieceType, row, col);
    for(let i = 0; i < placesToMarker.length; i++){
        let alg = rowColToAlgebraic(placesToMarker[i][0], placesToMarker[i][1]);
        let dot = document.getElementById("dot"+alg);
        if(dot.style.backgroundColor !== 'rgba(0, 255, 0, 0.5)'){
            dot.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        }
        dot.setAttribute('onclick', 'MovePieces(\''+pos+'\', \''+rowColToAlgebraic(placesToMarker[i][0], placesToMarker[i][1])+'\')');
        //MovePieces(pos, rowColToAlgebraic(placesToMarker[i][0], placesToMarker[i][1]));
    }
}

function MovePieces(from, to){
    CheckForConditions(from, to);
    inGame = true;
    let fromRow = algebraicToRowCol(from)[0];
    let fromCol = algebraicToRowCol(from)[1];
    let toRow = algebraicToRowCol(to)[0];
    let toCol = algebraicToRowCol(to)[1];
    let piece = chessGrid[fromRow-1][fromCol-1];
    chessGrid[fromRow-1][fromCol-1] = '--';
    chessGrid[toRow-1][toCol-1] = piece;

    let fromCellAlg = rowColToAlgebraic(fromRow, fromCol);
    let fromCell = document.getElementById(fromCellAlg);
    let toCellAlg = rowColToAlgebraic(toRow, toCol);
    let toCell = document.getElementById(toCellAlg);


    if(toCell.children.length > 0){
        toCell.removeChild(toCell.children[toCell.children.length-1]);
    }

    var newPiece = fromCell.children[fromCell.children.length-1];
    newPiece.setAttribute('onclick', 'ClickAPiece(\''+piece+'\', \''+toCellAlg+'\')');
    toCell.appendChild(newPiece);


    ClearDots();

    currentTurn = (currentTurn === 'w' ? 'b' : 'w');
    EnablePieceClicks(currentTurn == 'w');
}

function CheckForConditions(from, to){
    let fromRow = algebraicToRowCol(from)[0];
    let fromCol = algebraicToRowCol(from)[1];
    let toRow = algebraicToRowCol(to)[0];
    let toCol = algebraicToRowCol(to)[1];
    let piece = chessGrid[fromRow-1][fromCol-1];

    if(piece === 'K'){
        whiteCanCastleKingSide = false;
        whiteCanCastleQueenSide = false;
        if(fromRow === 1 && fromCol === 5 && toRow === 1 && toCol === 7){
            chessGrid[1-1][8-1] = '--';
            chessGrid[1-1][6-1] = 'R';

            let rookCellFrom = document.getElementById('h1');
            let rookCellTo = document.getElementById('f1');
            rookCellTo.appendChild(rookCellFrom.children[0]);
        }else if(fromRow === 1 && fromCol === 5 && toRow === 1 && toCol === 3){
            chessGrid[1-1][1-1] = '--';
            chessGrid[1-1][4-1] = 'R';

            let fromCellAlg = rowColToAlgebraic(fromRow, fromCol);
            let fromCell = document.getElementById(fromCellAlg);
            let toCellAlg = rowColToAlgebraic(toRow, toCol);
            let toCell = document.getElementById(toCellAlg);

            if(toCell.children.length > 0){
                toCell.removeChild(toCell.children[toCell.children.length-1]);
            }

            let rookCellFrom = document.getElementById('a1');
            let rookCellTo = document.getElementById('d1');
            rookCellTo.appendChild(rookCellFrom.children[0]);
        }
        
    }else if(piece === 'k'){
        blackCanCastleKingSide = false;
        blackCanCastleQueenSide = false;

        if(fromRow === 8 && fromCol === 5 && toRow === 8 && toCol === 7){
            chessGrid[8-1][8-1] = '--';
            chessGrid[8-1][6-1] = 'r';

            let rookCellFrom = document.getElementById('h8');
            let rookCellTo = document.getElementById('f8');
            rookCellTo.appendChild(rookCellFrom.children[0]);
        }else if(fromRow === 8 && fromCol === 5 && toRow === 8 && toCol === 3){
            chessGrid[8-1][1-1] = '--';
            chessGrid[8-1][4-1] = 'r';

            let fromCellAlg = rowColToAlgebraic(fromRow, fromCol);
            let fromCell = document.getElementById(fromCellAlg);
            let toCellAlg = rowColToAlgebraic(toRow, toCol);
            let toCell = document.getElementById(toCellAlg);

            if(toCell.children.length > 0){
                toCell.removeChild(toCell.children[toCell.children.length-1]);
            }

            let rookCellFrom = document.getElementById('a8');
            let rookCellTo = document.getElementById('d8');
            rookCellTo.appendChild(rookCellFrom.children[0]);
        }


    }else if(piece === 'R'){
        if(fromRow === 1 && fromCol === 1){
            whiteCanCastleQueenSide = false;
        }else if(fromRow === 1 && fromCol === 8){
            whiteCanCastleKingSide = false;
        }
    }else if(piece === 'r'){
        if(fromRow === 8 && fromCol === 1){
            blackCanCastleQueenSide = false;
        }else if(fromRow === 8 && fromCol === 8){
            blackCanCastleKingSide = false;
        }
    }

    if(piece === 'P' && fromRow === 2 && toRow === 4){
        enPassant = rowColToAlgebraic(fromRow+1, fromCol);
    }else if(piece === 'p' && fromRow === 7 && toRow === 5){
        enPassant = rowColToAlgebraic(fromRow-1, fromCol);
    }else{
        enPassant = '-';
    }
}


function ClearDots(){
    let dotsParent = document.getElementsByClassName('dotBoard')[0];
    for(let i = 0; i < dotsParent.children.length; i++){
        dotsParent.children[i].style.backgroundColor = 'transparent';
        let dotSquare = dotsParent.children[i].id.substring(3, 5);
        dotsParent.children[i].setAttribute('onclick', 'HideDots(\'' + dotSquare + '\')');
    }
    HideDots();
}
function ClieckedPiece(pieceType, row, col){
    let placesToMarker = [];
    switch(pieceType){
        case 'P':
            if(row == 2){
                if(GetPieceColorAtPosition(row+1, col) === 'none' && GetPieceColorAtPosition(row+2, col) === 'none'){
                    placesToMarker.push([row+1, col]);
                    placesToMarker.push([row+2, col]);
                }

                if(GetPieceColorAtPosition(row+1, col-1) === 'black'){
                    placesToMarker.push([row+1, col-1]);
                }

                if(GetPieceColorAtPosition(row+1, col+1) === 'black'){
                    placesToMarker.push([row+1, col+1]);
                }
            }else{
                if(GetPieceColorAtPosition(row+1, col) === 'none'){
                    placesToMarker.push([row+1, col]);
                }

                if(GetPieceColorAtPosition(row+1, col-1) === 'black'){
                    placesToMarker.push([row+1, col-1]);
                }

                if(GetPieceColorAtPosition(row+1, col+1) === 'black'){
                    placesToMarker.push([row+1, col+1]);
                }
            }
            break;
        case 'R':
            for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        console.log('black piece on square' + rowColToAlgebraic(newPos[0], newPos[1]));
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }

                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }
            break;
        case 'N':
            for(const newPos of [[row+2, col+1], [row+2, col-1], [row-2, col+1], [row-2, col-1], [row+1, col+2], [row+1, col-2], [row-1, col+2], [row-1, col-2]]){
                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                    placesToMarker.push(newPos);
                }
            }
            break;
        case 'B':
            for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }
            break;
        case 'Q':
            for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }

            for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }
            break;
        case 'K':
            var attackedSquaresBlack = GetAllAttackedSquares('black');
            if(showAttack){
                for(let i = 0; i < attackedSquaresBlack.length; i++){
                    let dot = document.getElementById('dot'+rowColToAlgebraic(attackedSquaresBlack[i][0], attackedSquaresBlack[i][1]));
                    dot.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
                }
            }
            for(const newPos of [[row+1, col], [row-1, col], [row, col+1], [row, col-1], [row+1, col+1], [row+1, col-1], [row-1, col+1], [row-1, col-1]]){
                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none' && !PositionInArray(attackedSquaresBlack, newPos)){
                    placesToMarker.push(newPos);
                }

                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black' && !PositionInArray(attackedSquaresBlack, newPos)){
                    placesToMarker.push(newPos);
                }
            }

            if(whiteCanCastleKingSide && GetPieceColorAtPosition(1, 6) === 'none' && GetPieceColorAtPosition(1, 7) === 'none' && GetPieceColorAtPosition(1, 5) === 'none'){
                if(!CanPieceAttackSquare(1, 8, 'black') && !CanPieceAttackSquare(1, 7, 'black')){
                    placesToMarker.push([1, 7]);
                }
            }

            if(whiteCanCastleQueenSide && GetPieceColorAtPosition(1, 2) === 'none' && GetPieceColorAtPosition(1, 3) === 'none' && GetPieceColorAtPosition(1, 4) === 'none' && GetPieceColorAtPosition(1, 5) === 'none'){
                if(!CanPieceAttackSquare(1, 1, 'black') && !CanPieceAttackSquare(1, 2, 'black') && !CanPieceAttackSquare(1, 3, 'black')){
                    placesToMarker.push([1, 3]);
                }
            }

            break;
        case 'p':
            if(row === 7){
                if(GetPieceColorAtPosition(row-1, col) === 'none' && GetPieceColorAtPosition(row-2, col) === 'none'){
                    placesToMarker.push([row-1, col]);
                    placesToMarker.push([row-2, col]);
                }

                if(GetPieceColorAtPosition(row-1, col-1) === 'white'){
                    placesToMarker.push([row-1, col-1]);
                }

                if(GetPieceColorAtPosition(row-1, col+1) === 'white'){
                    placesToMarker.push([row-1, col+1]);
                }

            }else{
                if(GetPieceColorAtPosition(row-1, col) === 'none'){
                    placesToMarker.push([row-1, col]);
                }

                if(GetPieceColorAtPosition(row-1, col-1) === 'white'){
                    placesToMarker.push([row-1, col-1]);
                }

                if(GetPieceColorAtPosition(row-1, col+1) === 'white'){
                    placesToMarker.push([row-1, col+1]);
                }
            }

            break;
        case 'r':
            for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }
            break;
        case 'n':
            for(const newPos of [[row+2, col+1], [row+2, col-1], [row-2, col+1], [row-2, col-1], [row+1, col+2], [row+1, col-2], [row-1, col+2], [row-1, col-2]]){
                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                    placesToMarker.push(newPos);
                }
            }
            break;
        case 'b':
            for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }
            break;
        case 'q':
            for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }

            for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        placesToMarker.push(newPos);
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        placesToMarker.push(newPos);
                        break;
                    }else{
                        break;
                    }
                    newPos = [row + direction[0]*num, col + direction[1]*num];
                }
            }
            break;
        case 'k':
            var attackedSquaresWhite = GetAllAttackedSquares('white');

            for(const newPos of [[row+1, col], [row-1, col], [row, col+1], [row, col-1], [row+1, col+1], [row+1, col-1], [row-1, col+1], [row-1, col-1]]){
                if((GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white') && !PositionInArray(attackedSquaresWhite, newPos)){
                    placesToMarker.push(newPos);
                }
            }

            if(blackCanCastleKingSide && GetPieceColorAtPosition(8, 8) === 'none' && GetPieceColorAtPosition(8, 7) === 'none'){
                if(!CanPieceAttackSquare(8, 7, 'white') && !CanPieceAttackSquare(8, 6, 'white') && !CanPieceAttackSquare(8, 5, 'white')){
                    placesToMarker.push([8, 7]);
                }
            }

            if(blackCanCastleQueenSide && GetPieceColorAtPosition(8, 2) === 'none' && GetPieceColorAtPosition(8, 3) === 'none' && GetPieceColorAtPosition(8, 4) === 'none' && GetPieceColorAtPosition(8, 5) === 'none'){
                if(!CanPieceAttackSquare(8, 1, 'white') && !CanPieceAttackSquare(8, 2, 'white') && !CanPieceAttackSquare(8, 3, 'white')){
                    placesToMarker.push([8, 3]);
                }
            }

            break;
    }

    return placesToMarker;
}

function GetPieceColorAtPosition(row, col){
    if(row > 8 || row < 1 || col > 8 || col < 1){
        return 'bad';
    }else if(chessGrid[row-1][col-1] === '--'){
        return 'none';
    }else{
        return chessGrid[row-1][col-1].charCodeAt(0) < 91 ? 'white' : 'black';
    }
}


function CanPieceAttackSquare(row, col, pieceColor){
    for(let i = 1; i < 9; i++){
        for(let j = 1; j < 9; j++){
            if(GetPieceColorAtPosition(i, j) === pieceColor){
                let placesToMarker = ClieckedPiece(GetPieceAtPosition(i, j), i, j, true);
                for(let k = 0; k < placesToMarker.length; k++){
                    if(placesToMarker[k][0] === row && placesToMarker[k][1] === col){
                        return true;
                    }
                }
            }
        }
    }
}

function GetAllAttackedSquares(pieceColor){
    let placesToMarker = [];
    for(var i = 1; i < 9; i++){
        for(var j = 1; j < 9; j++){
            if(GetPieceColorAtPosition(i, j) === pieceColor){
                let pieceType = GetPieceAtPosition(i, j);
                var row = i;
                var col = j;
                switch(pieceType){
                    case 'P':
                        if(GetPieceColorAtPosition(i+1, j-1) !== 'bad'){
                            placesToMarker.push([i+1, j-1]);
                        }

                        if(GetPieceColorAtPosition(i+1, j+1) !== 'bad'){
                            placesToMarker.push([i+1, j+1]);
                        }

                        break;
                    case 'R':
                        for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                                    console.log('black piece on square' + rowColToAlgebraic(newPos[0], newPos[1]));
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }

                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }
                        break;
                    case 'N':
                        for(const newPos of [[row+2, col+1], [row+2, col-1], [row-2, col+1], [row-2, col-1], [row+1, col+2], [row+1, col-2], [row-1, col+2], [row-1, col-2]]){
                            if(GetPieceColorAtPosition(newPos[0], newPos[1]) !== 'bad'){
                                placesToMarker.push(newPos);
                            }
                        }
                        break;
                    case 'B':
                        for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }
                        break;
                    case 'Q':
                        for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }

                        for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }
                        break;
                    case 'K':
                        for(const newPos of [[row+1, col], [row-1, col], [row, col+1], [row, col-1], [row+1, col+1], [row+1, col-1], [row-1, col+1], [row-1, col-1]]){
                            if(GetPieceColorAtPosition(newPos[0], newPos[1]) !== 'bad'){
                                placesToMarker.push(newPos);
                            }
                        }
                        break;
                    case 'p':
                        if(GetPieceColorAtPosition(row-1, col-1) !== 'bad'){
                            placesToMarker.push([row-1, col-1]);
                        }

                        if(GetPieceColorAtPosition(row-1, col+1) !== 'bad'){
                            placesToMarker.push([row-1, col+1]);
                        }

                        break;
                    case 'r':
                        for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }
                        break;
                    case 'n':
                        for(const newPos of [[row+2, col+1], [row+2, col-1], [row-2, col+1], [row-2, col-1], [row+1, col+2], [row+1, col-2], [row-1, col+2], [row-1, col-2]]){
                            if(GetPieceColorAtPosition(newPos[0], newPos[1]) !== 'bad'){
                                placesToMarker.push(newPos);
                            }
                        }
                        break;
                    case 'b':
                        for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }
                        break;
                    case 'q':
                        for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }

                        for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                            let num = 1;
                            var newPos = [row + direction[0]*num, col + direction[1]*num];
                            while(true){
                                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                                    placesToMarker.push(newPos);
                                    num++;
                                }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white' || GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                                    placesToMarker.push(newPos);
                                    break;
                                }else{
                                    break;
                                }
                                newPos = [row + direction[0]*num, col + direction[1]*num];
                            }
                        }
                        break;
                    case 'k':
                        for(const newPos of [[row+1, col], [row-1, col], [row, col+1], [row, col-1], [row+1, col+1], [row+1, col-1], [row-1, col+1], [row-1, col-1]]){
                            if(GetPieceColorAtPosition(newPos[0], newPos[1]) !== 'bad'){
                                placesToMarker.push(newPos);
                            }
                        }

                        break;
                }
            }
        }
    }

    return placesToMarker;
}



function GetAllAttackingSquares(pieceType){
    let attackingSquares = [];
    for(let i = 1; i < 9; i++){
        for(let j = 1; j < 9; j++){
            if(GetPieceAtPosition(i, j) === pieceType){
                let placesToMarker = ClieckedPiece(pieceType, i, j);
                for(let k = 0; k < placesToMarker.length; k++){
                    attackingSquares.push(placesToMarker[k]);
                }
            }
        }
    }

    return attackingSquares;

}
function GetPieceAtPosition(row, col){
    if(row > 8 || row < 1 || col > 8 || col < 1){
        return 'bad';
    }

    return chessGrid[row-1][col-1];
}

function rowColToAlgebraic(row, col){
    let algebraic = '';
    switch(col){
        case 1:
            algebraic += 'a';
            break;
        case 2:
            algebraic += 'b';
            break;
        case 3:
            algebraic += 'c';
            break;
        case 4:
            algebraic += 'd';
            break;
        case 5:
            algebraic += 'e';
            break;
        case 6:
            algebraic += 'f';
            break;
        case 7:
            algebraic += 'g';
            break;
        case 8:
            algebraic += 'h';
            break;
    }
    algebraic += row;
    return algebraic;
}

function algebraicToRowCol(algebraic){
    let row = 0;
    let col = 0;
    switch(algebraic[0]){
        case 'a':
            col = 1;
            break;
        case 'b':
            col = 2;
            break;
        case 'c':
            col = 3;
            break;
        case 'd':
            col = 4;
            break;
        case 'e':
            col = 5;
            break;
        case 'f':
            col = 6;
            break;
        case 'g':
            col = 7;
            break;
        case 'h':
            col = 8;
            break;
    }

    row = parseInt(algebraic[1]);

    return [row, col];
}


function EnablePieceClicks(isWhite){
    let pieces = document.getElementsByClassName('piece');
    //if a piece is not the same color as the current turn, set the onclick to null
    for(let i = 0; i < pieces.length; i++){
        if((pieces[i].id.includes('white') && isWhite) || (!pieces[i].id.includes('white') && !isWhite)){
            let row = pieces[i].parentNode.id[0];
            let col = pieces[i].parentNode.id[1];
            let pieceType = 
            pieces[i].id.includes('Pawn') && isWhite ? 'P' :
            pieces[i].id.includes('Rook') && isWhite ? 'R' :
            pieces[i].id.includes('Knight') && isWhite ? 'N' :
            pieces[i].id.includes('Bishop') && isWhite ? 'B' :
            pieces[i].id.includes('Queen') && isWhite ? 'Q' :
            pieces[i].id.includes('King') && isWhite ? 'K' :
            pieces[i].id.includes('Pawn') && !isWhite ? 'p' :
            pieces[i].id.includes('Rook') && !isWhite ? 'r' :
            pieces[i].id.includes('Knight') && !isWhite ? 'n' :
            pieces[i].id.includes('Bishop') && !isWhite ? 'b' :
            pieces[i].id.includes('Queen') && !isWhite ? 'q' :
            pieces[i].id.includes('King') && !isWhite ? 'k' : 'none';

            pieces[i].setAttribute('onclick', 'ClickAPiece(\''+pieceType+'\', \''+row+col+'\')');
        }else{
            pieces[i].setAttribute('onclick', '');
        }
    }
}

function ShowDots(){
    document.getElementsByClassName('dotBoard')[0].style.display = 'grid';
}

function HideDots(pos){
    document.getElementsByClassName('dotBoard')[0].style.display = 'none';

    if(pos){
        console.log(pos);
        let row = algebraicToRowCol(pos)[0];
        let col = algebraicToRowCol(pos)[1];
        if(GetPieceAtPosition(row, col) !== '--'){
            if((GetPieceAtPosition(row, col).charCodeAt(0) < 91 && currentTurn === 'w') || (GetPieceAtPosition(row, col).charCodeAt(0) > 91 && currentTurn === 'b')){
                ClickAPiece(GetPieceAtPosition(row, col), pos);
            }
        }
    
    }
}

function PositionInArray(array, pos){
    for(let i = 0; i < array.length; i++){
        if(array[i][0] === pos[0] && array[i][1] === pos[1]){
            return true;
        }
    }

    return false;
}

async function GetStockfishMove(){
    var fen = chessGridToFen(chessGrid);
    const url = 'https://chess-stockfish-16-api.p.rapidapi.com/chess/api';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'a4536a0c3fmshdb526c9a987fe7bp1a3098jsna0cb810db21c',
            'X-RapidAPI-Host': 'chess-stockfish-16-api.p.rapidapi.com'
        },
        body: new URLSearchParams({
            fen: fen,
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        return result.bestmove;
    } catch (error) {
        await new Promise(r => setTimeout(r, 1000));
        return GetStockfishMove();
    }

    return '';
}