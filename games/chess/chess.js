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

var showWhiteAttack = false;
var showBlackAttack = false;

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

        //if key is Q, show white attack
        if(e.keyCode == 81){
            var attackedSquaresBlack = GetAllAttackedSquares('white');
            console.log(attackedSquaresBlack);
            ShowDots();
            for(let i = 0; i < attackedSquaresBlack.length; i++){
                let dot = document.getElementById('dot'+rowColToAlgebraic(attackedSquaresBlack[i][0], attackedSquaresBlack[i][1]));
                dot.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
            }
        }else if(e.keyCode == 87){
            var attackedSquaresBlack = GetAllAttackedSquares('black');
            console.log(attackedSquaresBlack);
            ShowDots();
            for(let i = 0; i < attackedSquaresBlack.length; i++){
                let dot = document.getElementById('dot'+rowColToAlgebraic(attackedSquaresBlack[i][0], attackedSquaresBlack[i][1]));
                dot.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
            }
        }
    }
    // let fen = '8/P7/8/8/4kp2/8/8/K7 w - - 0 1'
    // LoadFen(fen);

}


async function ComputerMove(){
    while(!inGame){
        await new Promise(r => setTimeout(r, 1000));
    }

    while(inGame){
        while(currentTurn == 'w'){
            await new Promise(r => setTimeout(r, 1000));
        }

        if(await CheckForGameOver()){
            inGame = false;
            console.log("Game over");
            break;
        }
        console.log("Computer move");
        let move = await GetStockfishMove(startDepth);

        let from = move.substring(0, 2);
        let to = move.substring(2, 4);

        MovePieces(from, to);

        if(await CheckForGameOver()){
            inGame = false;
            console.log("Game over");
            break;
        }

        currentTurn = 'w';
        EnablePieceClicks(true);
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

function LoadFen(fen){
    let fenParts = fen.split(' ');
    let chessGridNew = [
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--'],
        ['--', '--', '--', '--', '--', '--', '--', '--']
    ]
    for(var i = 0; i < 8; i++){
        let row = fenParts[0].split('/')[7 - i];
        let col = 1;
        for(let j = 0; j < row.length; j++){
            if(!isNaN(row[j])){
                col += parseInt(row[j]);
            }else{
                chessGridNew[i][col-1] = row[j];
                col++;
            }
        }
    }

    currentTurn = fenParts[1];
    whiteCanCastleKingSide = fenParts[2].includes('K');
    whiteCanCastleQueenSide = fenParts[2].includes('Q');
    blackCanCastleKingSide = fenParts[2].includes('k');
    blackCanCastleQueenSide = fenParts[2].includes('q');
    enPassant = fenParts[3];
    halfMoveClock = fenParts[4];
    fullMoveNumber = fenParts[5];

    chessGrid = chessGridNew;

    for(const letter of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']){
        for(let i = 1; i < 9; i++){
            let cell = document.getElementById(letter + (9 - i));
            while(cell.children.length > 0){
                cell.removeChild(cell.children[0]);
            }
            let p = gridToPiece(chessGrid[8-i][letter.charCodeAt(0)-97]);
            if(p === 'empty'){
                continue
            }
            var newPiece = document.createElement('img');
            newPiece.src = '../images/' + p + '.png';
            newPiece.className = 'piece';
            newPiece.setAttribute('id', (p + letter + i));
            newPiece.setAttribute('onclick', 'ClickAPiece(\''+chessGrid[i-1][letter.charCodeAt(0)-97]+'\', \''+letter+i+'\')');
            cell.appendChild(newPiece);
        }
    }
}

function gridToPiece(piece){
    if(piece === '--'){
        return 'empty';
    }else if (piece === 'P') return 'whitePawn';
    else if (piece === 'R') return 'whiteRook';
    else if (piece === 'N') return 'whiteKnight';
    else if (piece === 'B') return 'whiteBishop';
    else if (piece === 'Q') return 'whiteQueen';
    else if (piece === 'K') return 'whiteKing';
    else if (piece === 'p') return 'blackPawn';
    else if (piece === 'r') return 'blackRook';
    else if (piece === 'n') return 'blackKnight';
    else if (piece === 'b') return 'blackBishop';
    else if (piece === 'q') return 'blackQueen';
    else if (piece === 'k') return 'blackKing';
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

    if(currentTurn === 'w'){
        currentTurn = 'b';
        EnablePieceClicks(false);
    }
}

async function CheckForGameOver(){
    ret = '';

    stockfish.onmessage = function(event) { 
        if(event.data.startsWith('bestmove')){
            ret = event.data.split(' ')[1];
        }
        // console.log(event.data);
    };
    stockfish.postMessage('position fen ' + chessGridToFen(chessGrid));
    stockfish.postMessage('go depth 10');

    while(ret === ''){
        await new Promise(r => setTimeout(r, 100));
    }

    if(ret === '(none)'){
        console.log(IsInCheck('black'));
        if(IsInCheck(currentTurn === 'w' ? 'white' : 'black')){
            console.log("White wins");
        }else if(IsInCheck('white')){
            console.log("Black wins");
        }else{
            console.log("Stalemate");
        }

        return true;
    }else{
        return false;
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
            chessGrid[fromRow-1][fromCol-1] = piece === 'P' ? 'Q' : 'q';
            document.getElementById(from).children[0].src = '../images/' + (piece === 'P' ? 'whiteQueen' : 'blackQueen') + '.png';
            document.getElementById(from).children[0].setAttribute('onclick', 'ClickAPiece(\''+(piece === 'P' ? 'Q' : 'q')+'\', \''+from+'\')');
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

function GetAllPiecesPositions(color){
    let positions = [];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(GetPieceColorAtPosition(i+1, j+1) === color){
                positions.push([i+1, j+1]);
            }
        }
    }
    return positions;
}
function ClieckedPiece(pieceType, row, col){
    console.log(pieceType, row, col);
    let placesToMarker = [];
    var isInCheck = IsInCheck(currentTurn === 'w' ? 'white' : 'black');
    switch(pieceType){
        case 'P':
            var allWhitePositions = GetAllPiecesPositions('white');
            GetAllPawnMoves(row, col, 'white', false, true).forEach(move => {
                if(!PositionInArray(allWhitePositions, move)){
                    if(!isInCheck || DoesMoveStopCheck(row, col, move[0], move[1])){
                        placesToMarker.push(move);
                    }
                }
            });
            break;
        case 'R':
            var allWhitePositions = GetAllAttackedSquares('white');

            GetAllRookMoves(row, col, 'white', false, true).forEach(move => {
                if(!PositionInArray(allWhitePositions, move)){
                    if(!isInCheck || DoesMoveStopCheck(row, col, move[0], move[1])){
                        placesToMarker.push(move);
                    }
                }
            });
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
            let allBlackPositions = GetAllPiecesPositions('black');
            GetAllPawnMoves(row, col, 'black', false, true).forEach(move => {
                if(!PositionInArray(allBlackPositions, move)){
                    if(!isInCheck || DoesMoveStopCheck(row, col, move[0], move[1])){
                        placesToMarker.push(move);
                    }
                }
            });
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
                        //WORK ON THIS
                        GetAllPawnMoves(row, col, 'white', true).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'R':
                        GetAllRookMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'N':
                        GetAllKnightMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'B':
                        GetAllBishopMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'Q':
                        GetAllQueenMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'K':
                        GetAllKingMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'p':
                        GetAllPawnMoves(row, col, 'black', true).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'r':
                        GetAllRookMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'n':
                        GetAllKnightMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'b':
                        GetAllBishopMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'q':
                        GetAllQueenMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                    case 'k':
                        GetAllKingMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
                        break;
                }
            }
        }
    }

    return placesToMarker;
}

function GetAllKingMoves(row, col){
    let placesToMarker = [];
    for(const newPos of [[row+1, col], [row-1, col], [row, col+1], [row, col-1], [row+1, col+1], [row+1, col-1], [row-1, col+1], [row-1, col-1]]){
        if(GetPieceColorAtPosition(newPos[0], newPos[1]) !== 'bad'){
            placesToMarker.push(newPos);
        }
    }

    return placesToMarker;
}

function GetStraightlineMoves(row, col){
    let placesToMarker = [];
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

    return placesToMarker;
}

function GetCrookedlineMoves(row, col){
    let placesToMarker = [];
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

    return placesToMarker;
}

function GetAllKnightMoves(row, col){
    let placesToMarker = [];
    for(const newPos of [[row+2, col+1], [row+2, col-1], [row-2, col+1], [row-2, col-1], [row+1, col+2], [row+1, col-2], [row-1, col+2], [row-1, col-2]]){
        if(GetPieceColorAtPosition(newPos[0], newPos[1]) !== 'bad'){
            placesToMarker.push(newPos);
        }
    }

    return placesToMarker;
}
function GetAllRookMoves(row, col){
    return GetStraightlineMoves(row, col);
}

function GetAllPawnMoves(row, col, pieceColor, attackOnly = false, eatOnly = false){
    let placesToMarker = [];
    if(!attackOnly){
        if(pieceColor === 'white' || pieceColor === 'w'){
            if(row === 2){
                if(GetPieceColorAtPosition(row+1, col) === 'none' && GetPieceColorAtPosition(row+2, col) === 'none'){
                    placesToMarker.push([row+2, col]);
                    placesToMarker.push([row+1, col]);
                }else if(GetPieceColorAtPosition(row+1, col) === 'none'){
                    placesToMarker.push([row+1, col]);
                }
            }else{
                if(GetPieceColorAtPosition(row+1, col) === 'none'){
                    placesToMarker.push([row+1, col]);
                }
            }
        }else{
            if(row === 7){
                if(GetPieceColorAtPosition(row-1, col) === 'none' && GetPieceColorAtPosition(row-2, col) === 'none'){
                    placesToMarker.push([row-2, col]);
                    placesToMarker.push([row-1, col]);
                }else if(GetPieceColorAtPosition(row-1, col) === 'none'){
                    placesToMarker.push([row-1, col]);
                }
            }else{
                if(GetPieceColorAtPosition(row-1, col) === 'none'){
                    placesToMarker.push([row-1, col]);
                }
            }
        }
    }

    if(pieceColor === 'white' || pieceColor === 'w'){
        if(!eatOnly){
            if(GetPieceColorAtPosition(row+1, col-1) !== 'bad'){
                placesToMarker.push([row+1, col-1]);
            }
            if(GetPieceColorAtPosition(row+1, col+1) !== 'bad'){
                placesToMarker.push([row+1, col+1]);
            }
        }else{
            if(GetPieceColorAtPosition(row+1, col-1) === 'black'){
                placesToMarker.push([row+1, col-1]);
            }
            if(GetPieceColorAtPosition(row+1, col+1) === 'black'){
                placesToMarker.push([row+1, col+1]);
            }
        }

    }else{
        if(!eatOnly){
            if(GetPieceColorAtPosition(row-1, col-1) !== 'bad'){
                placesToMarker.push([row-1, col-1]);
            }
            if(GetPieceColorAtPosition(row-1, col+1) !== 'bad'){
                placesToMarker.push([row-1, col+1]);
            }
        }else{
            if(GetPieceColorAtPosition(row-1, col-1) === 'white'){
                placesToMarker.push([row-1, col-1]);
            }
            if(GetPieceColorAtPosition(row-1, col+1) === 'white'){
                placesToMarker.push([row-1, col+1]);
            }
        }
    }

    return placesToMarker;
}
function GetAllQueenMoves(row, col){
    let placesToMarker = [];
    GetStraightlineMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });
    GetCrookedlineMoves(row, col).forEach((newPos) => { placesToMarker.push(newPos); });

    return placesToMarker;
}

function GetAllBishopMoves(row, col){
    return  GetCrookedlineMoves(row, col);
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
        if((pieces[i].id.includes('white') && isWhite)){
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