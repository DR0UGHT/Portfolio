let currentTurn = 'w';
let enPassant = '-';
let halfMoveClock = 0;
let fullMoveNumber = 1;
let whiteCanCastleKingSide = true;
let whiteCanCastleQueenSide = true;
let blackCanCastleKingSide = true;
let blackCanCastleQueenSide = true;

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
    console.log(chessGridToFen(chessGrid));
}
function chessGridToFen(chessGrid) {
    let fen = '';
    for (let i = 0; i < chessGrid.length; i++) {
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
        if (i < chessGrid.length - 1) {
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
    let row = algebraicToRowCol(pos)[0];
    let col = algebraicToRowCol(pos)[1];    
    //console.log(row, col);
    let placesToMarker = ClieckedPiece(pieceType, row, col);
    for(let i = 0; i < placesToMarker.length; i++){
        let cell = document.getElementById(rowColToAlgebraic(placesToMarker[i][0], placesToMarker[i][1]));
        let dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.width = '80%';
        dot.style.height = '80%';
        if(cell.children.length > 0){
            dot.style.marginTop = '-80%';

        }else{
            dot.style.marginTop = '10%';
        }
        dot.style.marginLeft = '10%';
        dot.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        dot.style.borderRadius = '50%';
        dot.style.zIndex = '100';
        //bind a click event to the
        dot.onclick = function(){
            console.log('clicked');
            MovePieces(pos, rowColToAlgebraic(placesToMarker[i][0], placesToMarker[i][1]));
        }
        cell.appendChild(dot);
    }
}

function MovePieces(from, to){
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

    var newPiece = fromCell.children[toCell.children.length-1];
    newPiece.setAttribute('onclick', 'ClickAPiece(\''+piece+'\', \''+toCellAlg+'\')');
    toCell.appendChild(newPiece);


    ClearDots();
}
function ClearDots(){
    let dots = document.getElementsByClassName('dot');
    while(dots.length > 0){
        dots[0].parentNode.removeChild(dots[0]);
    }
}
function ClieckedPiece(pieceType, row, col){
    let placesToMarker = [];
    switch(pieceType){
        case 'P':
            console.log(row + " " + col);
            if(row == 2){
                if(GetPieceColorAtPosition(row+1, col) === 'none' && GetPieceColorAtPosition(row+2, col) === 'none'){
                    placesToMarker.push([row+1, col]);
                    placesToMarker.push([row+2, col]);
                }
            }else{
                console.log(GetPieceColorAtPosition(row+1, col));
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
            break;
        case 'N':
            break;
        case 'B':
            break;
        case 'Q':
            break;
        case 'K':
            break;
        case 'p':
            if(row === 7){
                if(GetPieceColorAtPosition(row-1, col) === 'none' && GetPieceColorAtPosition(row-2, col) === 'none'){
                    placesToMarker.push([row-1, col]);
                    placesToMarker.push([row-2, col]);
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
            break;
        case 'n':
            break;
        case 'b':
            break;
        case 'q':
            break;
        case 'k':
            break;
    }

    return placesToMarker;
}

function GetPieceColorAtPosition(row, col){
    if(chessGrid[row-1][col-1] === '--'){
        return 'none';
    }else if(row > 8 || row < 1 || col > 8 || col < 1){
        return 'bad';
    } else{
        return chessGrid[row-1][col-1].charCodeAt(0) < 91 ? 'white' : 'black';
    }
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