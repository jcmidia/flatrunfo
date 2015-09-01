var socket = io();
var player;
var turn = false;

$('#formJoin').submit(function() {
  var username = $('#username').val();
  socket.emit('join', username);
  return false;
});


socket.on('new player', function(data){

  if (data.players.length==2) {
    $('.player1 strong').text(data.players[0].name);
    $('.player2 strong').text(data.players[1].name);
  }else{
    $('.player1 strong').text(data.players[0].name);
    $('.player2 strong').text("Aguardando jogador...");
  }

  $('#game').addClass('active');
  $('#login').removeClass('active');
});


socket.on('left game', function(data){
  alert("O jogador "+data.player.name+" saiu do jogo!");
});

socket.on('game over', function(data){
  if (data.winner==player) {
    $('#gameover').text('Parabéns, você venceu o jogo!');
    $('#gameover').addClass('success');
  }else{
    $('#gameover').text('Você perdeu o jogo!');
    $('#gameover').addClass('failure');
  }

  $('#gameover').fadeIn();
});


function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


socket.on('start game', function(data){
  $('.player1 span').text(" / "+data.cardsqty.deck1+" cartas ");
  $('.player2 span').text(" / "+data.cardsqty.deck2+" cartas ");

  $('#timer').show();

  var time=300000;
  var timer = setInterval(function(){
    time=time-100;
    $('#timer').text( millisToMinutesAndSeconds(time) );
    if (time==0) {
      clearInterval(timer);
    };
  }, 100);
  

  player = parseInt(data.pindex)+1;

  $.each(data.deck, function(index, val) {
    if (index=='img') {
      $('#cards-player'+player+' img').attr("src", val);
    }else{
      $('#cards-player'+player+' ul li span[rel="'+index+'"]').text(val);
    }
  });

  setTimeout(function() {
    $('#cards-player'+player+' .cardinactive').addClass('cardoff');
    setTimeout(function(){
      $('#cards-player'+player+' .carddefault').removeClass('cardoff');

      if (player==1) {
        $('#msg').text('Sua vez!');
        $('#msg').removeClass('failure success info').addClass('info');
        turn = true;
      }else{
        $('#msg').text('Vez do adversário!');
        $('#msg').removeClass('failure success info').addClass('info');
      }
      $('#msg').show();

    }, 600);
  }, 500);

});


socket.on('new play', function(data){

  $('.cardactive ul li span[rel="'+data.key+'"]').parent().addClass('active');

  if (player==1) {
    $.each(data.card2, function(index, val) {
      if (index=='img') {
        $('#cards-player2 img').attr("src", val);
      }else{
        $('#cards-player2 ul li span[rel="'+index+'"]').text(val);
      }
    });

    $('#cards-player2 .cardactive').removeClass('cardoff');
  }else{
    $.each(data.card1, function(index, val) {
        if (index=='img') {
          $('#cards-player1 img').attr("src", val);
        }else{
          $('#cards-player1 ul li span[rel="'+index+'"]').text(val);
        }
    });

    $('#cards-player1 .cardactive').removeClass('cardoff');
  }

  


});


socket.on('new turn', function(data){

  $('.player1 span').text(" / "+data.cardsqty.deck1+" cartas ");
  $('.player2 span').text(" / "+data.cardsqty.deck2+" cartas ");

  if (data.winner==player) {
    $('#msg').text('Você venceu!');
    $('#msg').removeClass('failure success info').addClass('success');
  }else{
    $('#msg').text('Você perdeu!');
    $('#msg').removeClass('failure success info').addClass('failure');
  }

  $('#msg').addClass('active');

  setTimeout(function() {

    $('#msg').removeClass('active');

    $('.cardactive').addClass('cardoff');

    setTimeout(function() {

        $.each(data.deck, function(index, val) {
            if (index=='img') {
              $('#cards-player'+player+' img').attr("src", val);
            }else{
              $('#cards-player'+player+' ul li span[rel="'+index+'"]').text(val);
            }
        });

        $('.cardactive li').removeClass('active');

        setTimeout(function() {
          $('#cards-player'+player+' .cardinactive').addClass('cardoff');
          setTimeout(function(){
            $('#cards-player'+player+' .carddefault').removeClass('cardoff');
            if (data.turn == player) {
              $('#msg').text('Sua vez!');
              $('#msg').removeClass('failure success info').addClass('info');
              turn = true;
            }else{
              $('#msg').text('Vez do adversário!');
              $('#msg').removeClass('failure success info').addClass('info');
            }
            $('#msg').show();
          }, 600);
        }, 500);


    }, 500);

    
  }, 2000);


});


$('.cardactive').on('click', 'li.clickable', function(event) {
  if (turn) {

    $(this).addClass('active');
    var key = $(this).children('.value').attr("rel");

    $('.cardactive ul li span[rel="'+key+'"]').parent().addClass('active');

    socket.emit('play', {key: key, player: player});
    turn = false;

  }else{
    alert("Aguarde a jogada do adversário!");
  }
});
