class TicTacToe{
    constructor(){
        this.board = new Array();
        for (let i = 0; i < 3; i++) {
            this.board[i] = new Array();
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = '-';
            }
        }
    }

    getBoard() {
        return this.board;
    }

    isValid(i, j, sign) {
        if (!(0 <= i && i <= 2 && 0 <= j && j <= 2) ||
		this.board[i][j] != '-') {
		return false;
	}

	this.board[i][j] = sign.toLowerCase();
	return true;
    }

    move() {
        const bestMove = this.alphaBeta(this);
	    this.board[bestMove[0]][bestMove[1]] = 'o';
	    return { x: bestMove[0], y: bestMove[1] };
    }

    getMoves(player) {
        let moves = new Array();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] == '-') {
                    moves.push([i, j]);
                }
            }
        }
        return moves;
    }

    isTerminal() {
        let noSpaces = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] == '-') {
                    noSpaces = false;
                }
            }
        }

        return noSpaces || this.getScore() != 0;
    }

    getScore() {
        var lines = new Array();
        var board = this.board;
        
        lines.push(board[0]);
        lines.push(board[1]);
        lines.push(board[2]);
        lines.push([board[0][0],board[1][0],board[2][0]]);
        lines.push([board[0][1],board[1][1],board[2][1]]);
        lines.push([board[0][2],board[1][2],board[2][2]]);
        lines.push([board[0][0],board[1][1],board[2][2]]);
        lines.push([board[2][0],board[1][1],board[0][2]]);
    
        for (var i = 0; i < lines.length; i++) {
            if (lines[i][0] == lines[i][1] &&
                lines[i][1] == lines[i][2] &&
                lines[i][0] == 'x') {
                return 1;
            }
            if (lines[i][0] == lines[i][1] &&
                lines[i][1] == lines[i][2] &&
                lines[i][0] == 'o') {
                return -1;
            }
        }
    
        return 0;
    }

    getNext(move, player) {
        if (player == "max") {
            player = 'x';
        } else {
            player = 'o';
        }
    
        var nextState = new TicTacToe();
    
        nextState.board = this.copyBoard(this.board);
        nextState.board[move[0]][move[1]] = player;
    
        return nextState;
    }

    alphaBeta(state) {
        return this.minValue(state, -100000, 100000, true);
    }

    maxValue(state, alpha, beta, isFirst) {
        var isFirst = isFirst || false;

        if (state.isTerminal()) {
            return state.getScore();
        }
    
        var v = -100000, moves = state.getMoves("max"), min, bestMove = moves[0];
    
        for (var i = 0; i < moves.length; i++) {
            min = this.minValue(state.getNext(moves[i], "max"), alpha, beta, false);
            if (min > v) {
                v = min;
                bestMove = moves[i];
            }
            if (v >= beta) {
                if (isFirst)
                    return moves[i];
                return v;
            }
            if (v > alpha)
                alpha = v;
        }
    
        if (isFirst) {
            return bestMove;
        } else {
            return v;
        }
    }

    minValue(state, alpha, beta, isFirst) {
        var isFirst = isFirst || false;

        if (state.isTerminal()) {
            return state.getScore();
        }
    
        var v = 100000, moves = state.getMoves("min"), max, bestMove = moves[0];
    
        for (var i = 0; i < moves.length; i++) {
            max = this.maxValue(state.getNext(moves[i], "min"), alpha, beta, false);
            if (max < v) v = max, bestMove = moves[i];
            if (v <= alpha) {
                if (isFirst)
                    return moves[i];
                return v;
            }
            if (v < beta)
                beta = v;
        }
    
        if (isFirst) {
            return bestMove;
        } else {
            return v;
        }
    }

    copyBoard(board) {
        var newBoard = Array();
        for (var i = 0; i < board.length; i++) {
            newBoard[i] = board[i].slice(0);
        }
        return newBoard;
    }
}

module.exports.TicTacToe = TicTacToe;