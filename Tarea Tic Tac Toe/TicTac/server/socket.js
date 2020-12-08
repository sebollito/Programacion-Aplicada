var tictactoe, playerO, playerX;
const TicTacToe = require("./computer").TicTacToe;

module.exports = function(io) {
    io.on('connection', function (socket) {
        console.log('new user connected: ' + socket.id);
    
        // Sesion
        initPlayers(socket);
    
        // Comienzo del juego
        socket.on('start game', function (data) {
            // Instaciar el nuevo juego
            tictactoe = new TicTacToe();
    
            // Iniciar la sesion
            socket.emit('game', { event: 'init' });
    
            // Enviar el comienzo de la partidaa
            io.sockets.emit('game', { event: 'start', message: 'Esta comenzando el juego' });
    
            // Turno de jugar X
            socket.emit('game', { event: 'play', message: 'Es tu turno' });
    
            console.log('Nuevo juego');
        });
    
        // A user made a move
        socket.on('move', function (data) {
            console.log('player ' + socket.id);
            console.log(data);
    
            
            const sign = socket.id == playerO ? 'O' : 'X';
    
            // Llama la funcion a ver si el movimiento es valido
            if (tictactoe.isValid(data.x, data.y, sign)) {
    
                // Enviar el movimiento
                io.sockets.emit('game', { event: 'move', message: 'Jugador hizo su jugada', x: data.x, y: data.y, sign: sign });
    
                // Espere su turno
                socket.emit('game', { event: 'wait', message: 'No es su turno, espere' });
    
                // Llama la funcion a ver si el juego temrino
                if (!isTerminalGame(io)) {
                    const opponent = socket.id == playerO ? playerX : playerO;
    
                    // Humano
                    if (opponent) {
                        socket.to(opponent).emit('game', { event: 'play', message: 'Tu turno' });
                    } else {
                        turnAI(socket, io);
                    }
                }
            } else {
                // Movimiento invalido
                socket.emit('game', { event: 'error', message: 'Esta jugada no es valida, intente de nuevo' });
                console.log('invalid move');
                console.log(data);
            }
            
        });
    
        // Si algun jugador se desconecta
        socket.on('disconnect', function () { 
            if (socket.id == playerO) {
                playerO = null;
            } else if (socket.id == playerX) {
                playerX = null;
            }
        });
    
    });
}

// Inicia la partida
function initPlayers(socket) {

	playerX = playerX ? playerX : socket.id;
	playerO = playerO ? playerO : (playerX == socket.id ? null : socket.id);
	console.log(`playerX ${playerX}`)
	console.log(`playerO ${playerO}`)

	console.log('pX: ' + playerX);
	if (playerO) {
		console.log('pO: ' + playerO);
	} else {
		console.log('pO: AI');
	}
}

// Chequea si ha terminado la partida
function isTerminalGame(io) {
	if (tictactoe.isTerminal()) {
		const score = tictactoe.getScore();
		var message = '';

		switch(score) {
			case -1:
				message = 'Jugador O gano!';
				if (!playerO)
					message = 'Te ha ganado el AI!';
				break;
			case 0:
				message = 'Empate!!';
				break;
			case 1:
				message = 'Jugador X gano!';
				break;
		}

		console.log('game is finished');
		io.sockets.emit('game', { event: 'finish', message: message });

		return true;
	}
	return false;
}

// AI minimax algoritmo
function turnAI(socket, io) {
    const aiMove = tictactoe.move();
	console.log('AI player:');
	console.log(aiMove);

	io.sockets.emit('game', { event: 'move', message: 'AI acaba de jugar', x: aiMove.x, y: aiMove.y, sign: 'O' });
	
	if (!isTerminalGame(io)) {
		socket.emit('game', { event: 'play', message: 'Tu turno!' });
	}
}