var socket = io();
var player;
var turn = false;

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1634055343507101',
    xfbml      : true,
    version    : 'v2.4'
  });

  function onLogin(response) {
    if (response.status == 'connected') {
      FB.api('/me?fields=picture{url},first_name', function(data) {
        console.log(data);
        socket.emit('login', data);
      });
    }
  }

  FB.getLoginStatus(function(response) {
    // Check login status on load, and if the user is
    // already logged in, go directly to the welcome message.
    if (response.status == 'connected') {
      onLogin(response);
    } else {
      // Otherwise, show Login dialog first.
      FB.login(function(response) {
        onLogin(response);
      }, {scope: 'user_friends, email'});
    }
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


$('#formJoin').submit(function() {
  var username = $('#username').val();
  if (username!="") {
    socket.emit('join', username);  
  }else{
    alert("Digite um nome para começar.");
  }
  
  return false;
});

$('.modal-close').click(function() {
  $('.overlay').hide();
  $(this).closest('.modal').removeClass('show')
});

$('.help-link').click(function() {
  $('.overlay').toggle();
  $('#modal-help').toggleClass('show');

  return false;
});

socket.on('rooms', function(data){
  console.log(data);
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
  console.log(data);
  turn = false;
  if (data.status!="game over") {
    $('#gameover').text("Você venceu! O jogador "+data.player.name+" saiu do jogo.");
    $('#gameover').addClass('success');

    $('#gameover').fadeIn();
  };
});

socket.on('game over', function(data){
  turn = false;
  if (data.winner==player) {
    $('#gameover').text('Parabéns, você venceu o jogo!');
    $('#gameover').addClass('success');
  }else if(data.winner==0){
    $('#gameover').text('Empatou!');
    $('#gameover').addClass('info');
  }else{
    $('#gameover').text('Você perdeu o jogo!');
    $('#gameover').addClass('failure');
  }

  $('#gameover').fadeIn();
});


socket.on('update time', function(data){
  $('#timer').text(data.time);
});


socket.on('start game', function(data){
  $('.player1 span').text(" / "+data.cardsqty.deck1+" cartas ");
  $('.player2 span').text(" / "+data.cardsqty.deck2+" cartas ");

  $('#timer').show();

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

  if (data.status!="game over") {

      $('.player1 span').text(" / "+data.cardsqty.deck1+" cartas ");
      $('.player2 span').text(" / "+data.cardsqty.deck2+" cartas ");

      if (data.winner==player) {
        $('#msg').text('Você venceu!');
        $('#msg').removeClass('failure success info').addClass('success');
      }else if(data.winner==0){
        $('#msg').text('Empate!');
        $('#msg').removeClass('failure success info').addClass('info');
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

  }


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
