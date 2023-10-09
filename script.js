
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

const gameBoardModule = function() {
    let gameBoardArray = [];

    const _initBoard = function() {
        for(let i = 0; i < 3; i++){
            gameBoardArray[i] = [];
            for(let j = 0; j < 3; j++)
                gameBoardArray[i].push(Cell());
        }
    };

    const clearBoard = function() {
        gameBoardArray = [];
        _initBoard();
    }
    
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

const Cell = function() {
    let value = 'empty';

    let setValue = function(newValue) {
        value = newValue;
    };

    let getValue = function() {
        return value;
    };

    return {setValue, getValue};
}

const gameController = function(firstPlayer, secondPlayer) {
    let player1 = firstPlayer;
    let player2 = secondPlayer;
    let activePlayerTurn = player1;
    let victoriousPlayer = undefined;
    let isWinConditionMet = false;
    let numOfTurns = 1;

    const _checkWinCondition = function() {
        if(numOfTurns >= 5){
            let boardArray = gameBoardModule.getBoardArray();

            for(let index = 0; index < boardArray.length; index++){
                let rowWinConditionMet = _checkHorizontal(index);
                let columnWinConditionMet = _checkVertical(index);
                if(rowWinConditionMet){
                    isWinConditionMet = true;
                    _setVictoriousPlayer(index, 0);
                    break;
                }
                else if(columnWinConditionMet){
                    isWinConditionMet = true;
                    _setVictoriousPlayer(0, index);
                    break;
                }
            }

            if(_checkFirstDiagonal()){
                isWinConditionMet = true;
                _setVictoriousPlayer(0, 0);
            }
            else if(_checkSecondDiagonal()) {
                isWinConditionMet = true;
                _setVictoriousPlayer(2, 0);
            }
        }
        else
            return;

        if(numOfTurns == 9){
            isWinConditionMet = true;
        }
    };

    const _checkHorizontal = function(row) {
        let boardArray = gameBoardModule.getBoardArray();
        let firstSymbol = boardArray[row][0].getValue();

        if(firstSymbol === 'empty')
            return false;
        
        for(let i = 1; i < boardArray[row].length; i++){
            let nextSymbol = boardArray[row][i].getValue();
            if(firstSymbol !== nextSymbol)
                return false;
        }

        return true;
    }

    const _checkVertical = function(column) {
        let boardArray = gameBoardModule.getBoardArray();
        let firstSymbol = boardArray[0][column].getValue();

        if(firstSymbol === 'empty')
            return false;

        for(let i = 1; i < boardArray.length; i++){
            let nextSymbol = boardArray[i][column].getValue();
            if(firstSymbol !== nextSymbol)
                return false;
        }

        return true;
    }

    const _checkFirstDiagonal = function() {
        let boardArray = gameBoardModule.getBoardArray();
        let firstSymbol = boardArray[0][0].getValue();
        if(firstSymbol !== 'empty'){
            if(firstSymbol === boardArray[1][1].getValue()  
                && firstSymbol === boardArray[2][2].getValue())
                return true;
        }
        return false;
    }

    const _checkSecondDiagonal = function() {
        let boardArray = gameBoardModule.getBoardArray();
        let firstSymbol = boardArray[2][0];
        if(firstSymbol !== 'empty'){
            if(firstSymbol === boardArray[1][1].getValue()  
                && firstSymbol === boardArray[0][2].getValue())
                return true;
        }
        return false;
    }

    const _setVictoriousPlayer = function(row, column) {
        let boardArray = gameBoardModule.getBoardArray();
        let winningValue = boardArray[row][column].getValue();
        if(winningValue === player1.getSymbol())
            victoriousPlayer = player1;
        else if(winningValue === player2.getSymbol())
            victoriousPlayer = player2;
    }

    const switchTurns = function() {
        if(activePlayerTurn == player1)
            activePlayerTurn == player2;
        else
            activePlayerTurn == player1;
    };

    const playRound = function(row, column) {
        let activePlayerSymbol = activePlayerTurn.getValue();
        let isValidCell = board.setCellValue(row, column, activePlayerSymbol);        
        
        if(!isValidCell)
            return false;
        else{
            _checkWinCondition();
            switchTurns();
            numOfTurns++;
            return true;
        }
    };

    const isGameOver = function() {
        return isWinConditionMet;
    }

    const getVictoriousPlayer = function() {
        return victoriousPlayer;
    }

    return {switchTurns, playRound, isGameOver, getVictoriousPlayer};
};

const displayController = function() {
    let boardContainer = document.querySelector('.gameboard-container');

    const updateScreen = function() {
        boardContainer.replaceChildren();

        let boardArray = gameBoardModule.getBoardArray();
    }


}();