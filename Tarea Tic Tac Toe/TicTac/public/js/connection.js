// const { port, host} = require('../../config/index');


function API() {
	const game = new Game();

	this.socket = io.connect('localhost' + ':' + 3000);

	// Todas las llamada
	this.socket.on('game', function (data) {
		console.log(data)
		if (data.message) {
			game.banner(data.message);
		}
		// Llamadas a las funciones
		game[data.event](data);
	});

	// Nuevo juego
	this.start = function() {
		this.socket.emit('start game');
	};

	// Jugada
	this.move = function(x, y) {
		if (!game.board.hasClass('disabled')) {
			this.socket.emit('move', { x: x, y: y });
		}
	};

};