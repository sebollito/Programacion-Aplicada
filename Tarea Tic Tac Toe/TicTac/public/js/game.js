class Game{
	constructor() {
		this.board = $('#board');
	}
	// Resetar los campos
	init() {
		this.board.find('td').empty();
	}
	// Aqui escondo el boton de start
	start() {
		this.init();
		$('#start-game-btn').hide();
	}
	// Pone X o Y donde el jugador juegue
	move(data) {
		this.board.find('tr').eq(data.x).find('td').eq(data.y).text(data.sign);
	}
	// Para mostrar el error
	error(message) {
		$('.alert-success').text(message).alert();
	}
	// Espera a que el otro jugador juegue
	wait() {
		this.board.addClass('disabled');
	}
	// Deja al jugador jugar
	play() {
		this.board.removeClass('disabled');
	}
	// Muestra los mensajes
	banner(message) {
		$('.alert-success').text(message).alert();
	}
	// Se termina el juego y muestra de nuevo el banner
	finish() {
		$('#start-game-btn').show();
	}
}