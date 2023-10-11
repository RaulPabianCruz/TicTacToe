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

const cell = function() {
    let value = 'empty';

    let setValue = function(newValue) {
        value = newValue;
    };

    let getValue = function() {
        return value;
    };

    return {setValue, getValue};
}

const gameBoardModule = function() {
    let gameBoardArray = [];

    const _initBoard = function() {
        for(let i = 0; i < 3; i++){
            gameBoardArray[i] = [];
            for(let j = 0; j < 3; j++)
                gameBoardArray[i].push(cell());
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

    const setCellValue = function(row, column, symbol){
        if(gameBoardArray[row][column].getValue() === 'empty'){
            gameBoardArray[row][column].setValue(symbol);
            return true;
        }
        else
            return false;
    };

    _initBoard();

    return {clearBoard, getBoardArray, setCellValue};
}();

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
        let boardArray = gameBoardModule.getBoardArray();

        for(let i = 0; i < boardArray.length; i++){
            let firstSymbol = boardArray[i][0].getValue();
            if(firstSymbol === 'empty')
                continue;
            else if(firstSymbol === boardArray[i][1].getValue()
                && firstSymbol === boardArray[i][2].getValue())
                return i;
        }

        return -1;
    };

    const _checkVerticals = function(column) {
        let boardArray = gameBoardModule.getBoardArray();

        for(let i = 0; i < boardArray.length; i++){
            let firstSymbol = boardArray[0][i].getValue();
            if(firstSymbol === 'empty')
                continue;
            else if(firstSymbol === boardArray[1][i].getValue()
                && firstSymbol === boardArray[2][i].getValue())
                return i;
        }

        return -1;
    };

    const _checkFirstDiagonal = function() {
        let boardArray = gameBoardModule.getBoardArray();
        let firstSymbol = boardArray[0][0].getValue();
        if(firstSymbol !== 'empty'){
            if(firstSymbol === boardArray[1][1].getValue()  
                && firstSymbol === boardArray[2][2].getValue())
                return true;
        }
        return false;
    };

    const _checkSecondDiagonal = function() {
        let boardArray = gameBoardModule.getBoardArray();
        let firstSymbol = boardArray[2][0].getValue();
        if(firstSymbol !== 'empty'){
            if(firstSymbol === boardArray[1][1].getValue()  
                && firstSymbol === boardArray[0][2].getValue())
                return true;
        }
        return false;
    };

    const _setVictoriousPlayer = function(row, column) {
        let boardArray = gameBoardModule.getBoardArray();
        let winningValue = boardArray[row][column].getValue();
        if(winningValue === player1.getSymbol())
            victoriousPlayer = player1;
        else if(winningValue === player2.getSymbol())
            victoriousPlayer = player2;
    };

    const _switchTurns = function() {
        if(activePlayerTurn == player1)
            activePlayerTurn = player2;
        else
            activePlayerTurn = player1;
    };

    const playRound = function(row, column) {
        let activePlayerSymbol = activePlayerTurn.getSymbol();
        let isValidCell = gameBoardModule.setCellValue(row, column, activePlayerSymbol);        
        
        if(!isValidCell)
            return false;
        else{
            _checkWinCondition();
            _switchTurns();
            numOfTurns++;
            return true;
        }
    };

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
        gameBoardModule.clearBoard();
        activePlayerTurn = player1;
        isWinConditionMet = false;
        victoriousPlayer = undefined;
        numOfTurns = 0;
    };

    return {playRound, isGameOver, getGameOverResult, getActivePlayer, resetGame};
};

let playah1 = playerFactory("Playah 1", "O");
let playah2 = playerFactory("Playah2", "X");

const displayController = function() {
    let boardContainer = document.querySelector('.gameboard-container');
    let infoScreen = document.querySelector('.info-screen');
    let restartButton = document.querySelector('.restart-bttn');
    let game = gameController(playah1, playah2);

    const _createBoardElement = function(row, column, value) {
        let boardSquare = document.createElement("div");

        boardSquare.classList.add("tictactoe-square");
        boardSquare.setAttribute("data-row", row);
        boardSquare.setAttribute("data-col", column);
        boardSquare.textContent = _addBoardElementValue(value);

        return boardSquare;
    };

    const _addBoardElementValue = function(value) {
        //i can refactor the whole "empty" return value
        if(value === 'empty')
            return " ";
        else
            return value;
    };

    const updateScreen = function() {
        boardContainer.replaceChildren();

        let boardArray = gameBoardModule.getBoardArray();
        for(let i = 0; i < boardArray.length; i++){
            for(let j = 0; j < boardArray[i].length; j++){
                let squareValue = boardArray[i][j].getValue();
                let boardSquare = _createBoardElement(i, j, squareValue);
                boardContainer.appendChild(boardSquare);
            }
        }

        infoScreen.textContent = game.getActivePlayer().getName();

        if(game.isGameOver()){
            infoScreen.textContent = game.getGameOverResult();
        }
    };

    const _boardClickHandler = function(event) {
        let boardSquare = event.target;
        let row = Number(boardSquare.getAttribute("data-row"));
        let column = Number(boardSquare.getAttribute("data-col"));

        if(game.playRound(row, column)){
            updateScreen();
        }
    };

    const _restartHandler = function() {
        game.resetGame();
        updateScreen();
    }

    boardContainer.addEventListener('click', _boardClickHandler);
    restartButton.addEventListener('click', _restartHandler);

    return {updateScreen};
}();

displayController.updateScreen();