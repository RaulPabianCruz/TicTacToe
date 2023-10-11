const EMPTY_VALUE = ' ';

const playerFactory = function(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;

    const setName = function(name) {
        playerName = name;
    };

    const setSymbol = function(symbol) {
        playerSymbol = symbol;
    };

    const getName = function() {
        return playerName;
    };

    const getSymbol = function() {
        return playerSymbol;
    };

    return {setName, setSymbol, getName, getSymbol};
}

const cellFactory = function(newValue = EMPTY_VALUE) {
    let value = newValue;

    let setValue = function(newValue) {
        value = newValue;
    };

    let getValue = function() {
        return value;
    };

    return {setValue, getValue};
}


//Game Board Module
//Holds the values of the tictactoe board
const gameBoard = function() {
    let gameBoardArray = [];

    const _initBoard = function() {
        for(let i = 0; i < 3; i++){
            gameBoardArray[i] = [];
            for(let j = 0; j < 3; j++)
                gameBoardArray[i].push(cellFactory());
        }
    };

    const clearBoard = function() {
        gameBoardArray = [];
        _initBoard();
    };
    
    const getBoardArray = function() {
        //prob should return a copy of array, not the reference itself
        return gameBoardArray;
    };

    const setSquareValue = function(row, col, symbol) {
        gameBoardArray[row][col].setValue(symbol);
    };

    const getSquareValue = function(row, col) {
        return gameBoardArray[row][col].getValue();
    };

    _initBoard();

    return {clearBoard, getBoardArray, setSquareValue, getSquareValue};
}();


const PLAYER1 = playerFactory('player1', 'X');
const PLAYER2 = playerFactory('player2', 'O');

//Game Controller Module
//Controls the logic of the game as its being played
const gameController = function(firstPlayer, secondPlayer) {
    let player1 = firstPlayer;
    let player2 = secondPlayer;
    let activePlayerTurn = player1;
    let victoriousPlayer = undefined;
    let isWinConditionMet = false;
    let numOfTurns = 1;

    const _checkWinCondition = function() {
        if(!isWinConditionMet){
            if(numOfTurns >= 5){
                let rowWithWinCondition = _checkHorizontals();
                let colWithWinCondition = _checkVerticals();
                let firstDiagWinConditionMet = _checkFirstDiagonal();
                let secDiagWinConditionMet = _checkSecondDiagonal();

                if(rowWithWinCondition >= 0){
                    isWinConditionMet = true;
                    _setVictoriousPlayer(rowWithWinCondition, 0)
                }
                else if(colWithWinCondition >= 0){
                    isWinConditionMet = true;
                    _setVictoriousPlayer(0, colWithWinCondition);
                }
                else if(firstDiagWinConditionMet){
                    isWinConditionMet = true;
                    _setVictoriousPlayer(0, 0);
                }
                else if(secDiagWinConditionMet) {
                    isWinConditionMet = true;
                    _setVictoriousPlayer(2, 0);
                }

                if(numOfTurns == 9)
                    isWinConditionMet = true;
            }
        }
    };

    const _checkHorizontals = function() {
        for(let i = 0; i < 3; i++){
            let firstSymbol = gameBoard.getSquareValue(i,0);
            if(firstSymbol === EMPTY_VALUE)
                continue;
            else if(firstSymbol === gameBoard.getSquareValue(i,1)
                && firstSymbol === gameBoard.getSquareValue(i,2))
                return i;
        }

        return -1;
    };

    const _checkVerticals = function(col) {
        for(let i = 0; i < 3; i++){
            let firstSymbol = gameBoard.getSquareValue(0,i);
            if(firstSymbol === EMPTY_VALUE)
                continue;
            else if(firstSymbol === gameBoard.getSquareValue(1,i)
                && firstSymbol === gameBoard.getSquareValue(2,i))
                return i;
        }

        return -1;
    };

    const _checkFirstDiagonal = function() {
        let firstSymbol = gameBoard.getSquareValue(0,0);
        if(firstSymbol !== EMPTY_VALUE){
            if(firstSymbol === gameBoard.getSquareValue(1,1) 
                && firstSymbol === gameBoard.getSquareValue(2,2))
                return true;
        }
        return false;
    };

    const _checkSecondDiagonal = function() {
        let firstSymbol = gameBoard.getSquareValue(2,0);
        if(firstSymbol !== EMPTY_VALUE){
            if(firstSymbol === gameBoard.getSquareValue(1,1)  
                && firstSymbol === gameBoard.getSquareValue(0,2))
                return true;
        }
        return false;
    };

    const _setVictoriousPlayer = function(row, col) {
        let winningValue = gameBoard.getSquareValue(row,col);
        if(winningValue === player1.getSymbol())
            victoriousPlayer = player1;
        else
            victoriousPlayer = player2;
    };

    const _switchTurns = function() {
        if(activePlayerTurn === player1)
            activePlayerTurn = player2;
        else
            activePlayerTurn = player1;
    };

    const playRound = function(row, col) {
        let playerSymbol = activePlayerTurn.getSymbol();
        gameBoard.setSquareValue(row, col, playerSymbol);
        _checkWinCondition();
        _switchTurns();
        numOfTurns++;
    };

    const isValidChoice = function(row, col) {
        let squareValue = gameBoard.getSquareValue(row, col);
        return squareValue === EMPTY_VALUE;
    }

    const isGameOver = function() {
        return isWinConditionMet;
    };

    const getGameOverResult = function() {
        if(victoriousPlayer !== undefined)
            return "Winner: " + victoriousPlayer.getName();
        else
            return "Tie Game! hehe"
    };

    const getActivePlayer = function() {
        return activePlayerTurn;
    }

    const resetGame = function() {
        gameBoard.clearBoard();
        activePlayerTurn = player1;
        isWinConditionMet = false;
        victoriousPlayer = undefined;
        numOfTurns = 1;
    };

    return {playRound, isValidChoice, isGameOver, getGameOverResult, getActivePlayer, resetGame};
}(PLAYER1, PLAYER2);


//Display Controller Module
//Controls what is displayed to the html
const displayController = function() {
    let boardContainer = document.querySelector('.gameboard-container');
    let infoScreen = document.querySelector('.info-screen');
    let restartButton = document.querySelector('.restart-bttn');

    const _createBoardElement = function(row, col, value) {
        let boardSquare = document.createElement("div");

        boardSquare.classList.add("tictactoe-square");
        boardSquare.setAttribute("data-row", row);
        boardSquare.setAttribute("data-col", col);
        boardSquare.textContent = value;

        return boardSquare;
    };

    const _boardClickHandler = function(event) {
        let boardSquare = event.target;
        let row = Number(boardSquare.getAttribute("data-row"));
        let col = Number(boardSquare.getAttribute("data-col"));

        if(gameController.isValidChoice(row, col)){
            gameController.playRound(row, col);
            updateScreen();
        }
    };

    const _restartHandler = function() {
        gameController.resetGame();
        updateScreen();
    };

    const updateScreen = function() {
        boardContainer.replaceChildren();

        let boardArray = gameBoard.getBoardArray();
        for(let i = 0; i < boardArray.length; i++){
            for(let j = 0; j < boardArray[i].length; j++){
                let squareValue = boardArray[i][j].getValue();
                let boardSquare = _createBoardElement(i, j, squareValue);
                boardContainer.appendChild(boardSquare);
            }
        }

        if(gameController.isGameOver())
            infoScreen.textContent = gameController.getGameOverResult();
        else
            infoScreen.textContent = gameController.getActivePlayer().getName();
    };

    boardContainer.addEventListener('click', _boardClickHandler);
    restartButton.addEventListener('click', _restartHandler);

    return {updateScreen};
}();

displayController.updateScreen();