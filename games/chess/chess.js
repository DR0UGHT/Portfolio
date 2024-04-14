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
var startDepth = 1;

var stockfish = new Worker("stockfish.js");

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
    console.log(chessGridToFen(chessGrid));
    LoadFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    //console.log(chessGridToFen(chessGrid));
    //CheckForStalemate('b');

}

function LoadFen(fen){
    let fenParts = fen.split(' ');
    let board = fenParts[0];
    let turn = fenParts[1];
    let castling = fenParts[2];
    let enPassant = fenParts[3];
    let halfMove = fenParts[4];
    let fullMove = fenParts[5];

    let boardRows = board.split('/');
    for(let i = 0; i < boardRows.length; i++){
        let row = boardRows[i];
        let col = 1;
        for(let j = 0; j < row.length; j++){
            let piece = row[j];
            if(isNaN(piece)){
                chessGrid[i][col-1] = piece;
                col++;
            }else{
                for(let k = 0; k < parseInt(piece); k++){
                    chessGrid[i][col-1] = '--';
                    col++;
                }
            }
        }
    }

    currentTurn = turn;
    whiteCanCastleKingSide = castling.includes('K');
    whiteCanCastleQueenSide = castling.includes('Q');
    blackCanCastleKingSide = castling.includes('k');
    blackCanCastleQueenSide = castling.includes('q');
    enPassant = enPassant;
    halfMoveClock = parseInt(halfMove);
    fullMoveNumber = parseInt(fullMove);

    console.log(chessGrid);
}

async function ComputerMove(){
    while(!inGame){
        await new Promise(r => setTimeout(r, 1000));
    }

    while(inGame){
        while(currentTurn == 'w'){
            await new Promise(r => setTimeout(r, 1000));
        }

        let move = await GetStockfishMove(startDepth);

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

async function CheckForStalemate(whosturn){
    //give me a FEN for stalemate
    let fen = 'k1Q5/8/1QK5/8/8/8/8/8 ' + whosturn + ' - - 0 1'
    ret = '';

    stockfish.onmessage = function(event) { 
        if(event.data.startsWith('bestmove')){
            ret = event.data.split(' ')[1];
        }
        console.log(event.data);
    };
    // stockfish.postMessage('position fen ' + chessGridToFen(chessGrid));
    console.log(fen);
    stockfish.postMessage('position fen ' + fen);
    stockfish.postMessage('go depth 20');

    while(ret === ''){
        await new Promise(r => setTimeout(r, 100));
    }

    if(ret === '(none)'){
        console.log(IsInCheck('black'));
        if(IsInCheck(whosturn === 'w' ? 'white' : 'black')){
            console.log("White wins");
        }else if(IsInCheck('white')){
            console.log("Black wins");
        }else{
            console.log("Stalemate");
        }
    }
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

    if(piece === 'P' || piece === 'p'){
        if(toRow === 8 || toRow === 1){
            piece = piece === 'P' ? 'Q' : 'q';
        }
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
    var isInCheck = IsInCheck(currentTurn === 'w' ? 'white' : 'black');
    switch(pieceType){
        case 'P':
            if(row == 2){
                if(GetPieceColorAtPosition(row+2, col) === 'none' && GetPieceColorAtPosition(row+1, col) === 'none'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+2, col)){
                            placesToMarker.push([row+2, col]);
                        }

                        if(DoesMoveStopCheck(row, col, row+1, col)){
                            placesToMarker.push([row+1, col]);
                        }
                    }else{
                        placesToMarker.push([row+1, col]);
                        placesToMarker.push([row+2, col]);
                    }
                }else if(GetPieceColorAtPosition(row+1, col) === 'none'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+1, col)){
                            placesToMarker.push([row+1, col]);
                        }
                    }else{
                        placesToMarker.push([row+1, col]);
                    }
                }

                if(GetPieceColorAtPosition(row+1, col-1) === 'black'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+1, col-1)){
                            placesToMarker.push([row+1, col-1]);
                        }
                    }else{
                        placesToMarker.push([row+1, col-1]);
                    }
                }

                if(GetPieceColorAtPosition(row+1, col+1) === 'black'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+1, col+1)){
                            placesToMarker.push([row+1, col+1]);
                        }
                    }else{
                        placesToMarker.push([row+1, col+1]);
                    }
                }
            }else{
                if(GetPieceColorAtPosition(row+1, col) === 'none'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+1, col)){
                            placesToMarker.push([row+1, col]);
                        }
                    }else{
                        placesToMarker.push([row+1, col]);
                    }
                }

                if(GetPieceColorAtPosition(row+1, col-1) === 'black'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+1, col-1)){
                            placesToMarker.push([row+1, col-1]);
                        }
                    }else{
                        placesToMarker.push([row+1, col-1]);
                    }
                }

                if(GetPieceColorAtPosition(row+1, col+1) === 'black'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row+1, col+1)){
                            placesToMarker.push([row+1, col+1]);
                        }
                    }else{
                        placesToMarker.push([row+1, col+1]);
                    }
                }
            }
            break;
        case 'R':
            for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
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
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                            placesToMarker.push(newPos);
                        }
                    }else{
                        placesToMarker.push(newPos);
                    }
                }
            }
            break;
        case 'B':
            for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
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
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }

                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                          placesToMarker.push(newPos);
                        }
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
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }

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
                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none' && !PositionInArray(attackedSquaresBlack, newPos)){;
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                            placesToMarker.push(newPos);
                        }
                    }else{
                        placesToMarker.push(newPos);
                    }
                }

                if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'black' && !PositionInArray(attackedSquaresBlack, newPos)){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                            placesToMarker.push(newPos);
                        }
                    }else{
                        placesToMarker.push(newPos);
                    }
                }
            }

            if(whiteCanCastleKingSide && GetPieceColorAtPosition(1, 6) === 'none' && GetPieceColorAtPosition(1, 7) === 'none'){
                if(!CanPieceAttackSquare(1, 8, 'black') && !CanPieceAttackSquare(1, 7, 'black')){
                    if(!isInCheck){
                        placesToMarker.push([1, 7]);
                    }
                }
            }

            if(whiteCanCastleQueenSide && GetPieceColorAtPosition(1, 2) === 'none' && GetPieceColorAtPosition(1, 3) === 'none' && GetPieceColorAtPosition(1, 4) === 'none'){
                if(!CanPieceAttackSquare(1, 1, 'black') && !CanPieceAttackSquare(1, 2, 'black') && !CanPieceAttackSquare(1, 3, 'black')){
                    if(!isInCheck){
                        placesToMarker.push([1, 3]);
                    }
                }
            }

            break;
        case 'p':
            if(row === 7){
                if(GetPieceColorAtPosition(row-1, col) === 'none' && GetPieceColorAtPosition(row-2, col) === 'none'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row-2, col)){
                            placesToMarker.push([row-2, col]);
                        }

                        if(DoesMoveStopCheck(row, col, row-1, col)){
                            placesToMarker.push([row-1, col]);
                        }
                    }else{
                        placesToMarker.push([row-1, col]);
                        placesToMarker.push([row-2, col]);
                    }
                }

                if(GetPieceColorAtPosition(row-1, col-1) === 'white'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row-1, col-1)){
                            placesToMarker.push([row-1, col-1]);
                        }
                    }else{
                        placesToMarker.push([row-1, col-1]);
                    }
                }

                if(GetPieceColorAtPosition(row-1, col+1) === 'white'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row-1, col+1)){
                            placesToMarker.push([row-1, col+1]);
                        }
                    }else{
                        placesToMarker.push([row-1, col+1]);
                    }
                }

            }else{
                if(GetPieceColorAtPosition(row-1, col) === 'none'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row-1, col)){
                            placesToMarker.push([row-1, col]);
                        }
                    }else{
                        placesToMarker.push([row-1, col]);
                    }
                }

                if(GetPieceColorAtPosition(row-1, col-1) === 'white'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row-1, col-1)){
                            placesToMarker.push([row-1, col-1]);
                        }
                    }else{
                        placesToMarker.push([row-1, col-1]);
                    }
                }

                if(GetPieceColorAtPosition(row-1, col+1) === 'white'){
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, row-1, col+1)){
                            placesToMarker.push([row-1, col+1]);
                        }
                    }else{
                        placesToMarker.push([row-1, col+1]);
                    }
                }
            }

            break;
        case 'r':
            for(const direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }

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
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                            placesToMarker.push(newPos);
                        }
                    }else{
                        placesToMarker.push(newPos);
                    }
                }
            }
            break;
        case 'b':
            for(const direction of [[1, 1], [-1, -1], [1, -1], [-1, 1]]){
                let num = 1;
                var newPos = [row + direction[0]*num, col + direction[1]*num];
                while(true){
                    if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'none'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }

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
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }
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
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }

                        num++;
                    }else if(GetPieceColorAtPosition(newPos[0], newPos[1]) === 'white'){
                        if(isInCheck){
                            if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                                placesToMarker.push(newPos);
                            }
                        }else{
                            placesToMarker.push(newPos);
                        }

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
                    if(isInCheck){
                        if(DoesMoveStopCheck(row, col, newPos[0], newPos[1])){
                            placesToMarker.push(newPos);
                        }
                    }else{
                        placesToMarker.push(newPos);
                    }
                }
            }

            if(blackCanCastleKingSide && GetPieceColorAtPosition(8, 8) === 'none' && GetPieceColorAtPosition(8, 7) === 'none'){
                if(!CanPieceAttackSquare(8, 7, 'white') && !CanPieceAttackSquare(8, 6, 'white') && !CanPieceAttackSquare(8, 5, 'white')){
                    if(!isInCheck){
                        placesToMarker.push([8, 7]);
                    }
                }
            }

            if(blackCanCastleQueenSide && GetPieceColorAtPosition(8, 2) === 'none' && GetPieceColorAtPosition(8, 3) === 'none' && GetPieceColorAtPosition(8, 4) === 'none' && GetPieceColorAtPosition(8, 5) === 'none'){
                if(!CanPieceAttackSquare(8, 1, 'white') && !CanPieceAttackSquare(8, 2, 'white') && !CanPieceAttackSquare(8, 3, 'white')){
                    if(!isInCheck){
                        placesToMarker.push([8, 3]);
                    }
                }
            }

            break;
    }

    return placesToMarker;
}

function IsInCheck(pieceColor){
    let kingPos = [];
    for(let i = 1; i < 9; i++){
        for(let j = 1; j < 9; j++){
            if(GetPieceAtPosition(i, j) === (pieceColor === 'white' ? 'K' : 'k')){
                kingPos = [i, j];
                break;
            }
        }
    }

    console.log(kingPos);

    if(pieceColor === 'white'){
        return CanPieceAttackSquare(kingPos[0], kingPos[1], 'black');
    }else{
        return CanPieceAttackSquare(kingPos[0], kingPos[1], 'white');
    }
}

function DoesMoveStopCheck(from, to){
    let fromRow = algebraicToRowCol(from)[0];
    let fromCol = algebraicToRowCol(from)[1];
    let toRow = algebraicToRowCol(to)[0];
    let toCol = algebraicToRowCol(to)[1];

    if(fromRow-1 == 0 || fromCol-1 == 0 || toRow-1 == 0 || toCol-1 == 0){
        return false;
    }

    let piece = chessGrid[fromRow-1][fromCol-1];
    let pieceColor = piece.charCodeAt(0) < 91 ? 'white' : 'black';

    let tempGrid = CopyArray(chessGrid);
    chessGrid[fromRow-1][fromCol-1] = '--';
    chessGrid[toRow-1][toCol-1] = piece;

    if(IsInCheck(pieceColor)){
        chessGrid = tempGrid;
        return false;
    }else{
        chessGrid = tempGrid;
        return true;
    }
    
}

function CopyArray(array){
    let newArray = [];
    for(let i = 0; i < array.length; i++){
        newArray.push(array[i].slice());
    }

    return newArray;
}

function DoesMoveStopCheck(fromx, fromy, tox, toy){
    if(fromx-1 < 0 || fromy-1 < 0 || tox-1 < 0 || toy-1 < 0){
        console.log("bad");
        return false;
    }

    let piece = chessGrid[fromx-1][fromy-1];
    let pieceColor = piece.charCodeAt(0) < 91 ? 'white' : 'black';
    let tempGrid = CopyArray(chessGrid);
    chessGrid[fromx-1][fromy-1] = '--';
    chessGrid[tox-1][toy-1] = piece;

    if(IsInCheck(pieceColor)){
        chessGrid = tempGrid;
        return false;
    }else{
        chessGrid = tempGrid;
        return true;
    }
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
    let attackedSquares = GetAllAttackedSquares(pieceColor);
    for(let i = 0; i < attackedSquares.length; i++){
        if(PositionInArray(attackedSquares, [row, col])){
            return true;
        }
    }

    return false;
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


async function GetStockfishMove(depth){
    ret = '';
    retBack = '';
    stockfish.onmessage = function(event) { 
        if(event.data.includes('bestmove')){
            ret = event.data.split(' ')[1];
            retBack = event.data.split(' ')[3];
        }
        console.log(event.data);
    };
    stockfish.postMessage('position fen ' + chessGridToFen(chessGrid));
    stockfish.postMessage('go depth ' + depth);
    

    while(ret === ''){
        await new Promise(r => setTimeout(r, 100));
    }

    //if the move from is equal to the move to, then the move is a promotion
    if(ret.substring(0, 2) === ret.substring(2, 4)){
        ret = retback;
    }

    if(ret.substring(0, 2) === ret.substring(2, 4)){
        return await GetStockfishMove(depth+1);
    }else{
        return ret;
    }
}

function SetSkillLevel(skill){
    //NOTE: Stockfish level 20 does not make errors (intentially), so these numbers have no effect on level 20.
    // Level 0 starts at 1
    err_prob = Math.round((skill * 6.35) + 1);
    // Level 0 starts at 10
    max_err = Math.round((skill * -0.5) + 10);
    stockfish.postMessage('setoption name Skill Level value ' + skill);
    stockfish.postMessage('setoption name Skill Level Maximum Error value ' + max_err);
    stockfish.postMessage('setoption name Skill Level Probability value ' + err_prob);
}