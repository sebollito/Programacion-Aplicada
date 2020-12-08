$(document).ready(function() {

    const api = new API();

    $('#start-game-btn').on('click', function() {
        api.start();
    });

    // Detecto que celda fue clickeada
    $('#board td').on('click', function(e) {
        let y = $(this).parent().children().index($(this));
        let x = $(this).parent().parent().children().index($(this).parent());

        api.move(x, y);
    });

});