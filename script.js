const playerFactory = function(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;

    const setName = function(name) {
        playerName = name;
    }

    const setSymbol = function(symbol) {
        playerSymbol = symbol;
    }

    const getName = function() {
        return playerName;
    }

    const getSymbol = function() {
        return playerSymbol;
    }

    return {setName, setSymbol, getName, getSymbol};
}

const gameBoard = function() {
    let gameGraph = [];

    for(let i = 0; i < 3; i++){
        gameGraph[i] = [];
        for(let j = 0; j < 3; j++)
            gameGraph[i].push(Cell());
    }
    
    const getBoard = function() {
        return gameGraph;
    }

    const markSquare = function(row, column, symbol){
        if(gameGraph[row][column] === 'empty')
            gameGraph[row][column].setValue(symbol);
        else{
            console.log("Already in use or sumthn");
        }
    }

    return {getBoard, markSquare};
}

const Cell = function() {
    let value = 'empty';

    let setValue = function(newValue) {
        value = newValue;
    }

    let getValue = function() {
        return value;
    }

    return {setValue, getValue};
}