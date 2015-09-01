var express = require('express');
var app = require('express')();
var http1 = require("http");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use("/assets", express.static(__dirname + '/assets'));


app.set('port', (process.env.PORT || 3000));

http.listen(app.get('port'), function(){
  console.log('Node app is running on port', app.get('port'));
});

var shortid = require('shortid');
var Room = require("./requires/Rooms.js");
var Cards = require("./requires/Cards.js");


var people = {};
var rooms = [];
var cards = {};


app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});


io.sockets.on('connection', function (socket){
  	people[socket.id] = {"name" : "undefined", "inroom": null};

  	socket.on('join', function(username){
	  	var room = getAvaliableRoomId();
	  	room.addPerson(socket.id);

	  	people[socket.id] = {"name" : username, "inroom": room.id};


	  	var players = [];
	  	for (var index in room.people) {
			players.push(people[room.people[index]]);
		}


	    socket.join(room.id);
	  	io.sockets.in(room.id).emit("new player", {room: room, players: players, playerid: socket.id});
	  	

	  	if (room.people.length==2) {

	  		var request = http1.get( "http://flatrunfo.herokuapp.com/assets/cards.json", function(response) {
	  	
			  	var body = '';

			    response.on('data', function(chunk) {
			        body += chunk;
			    });

			    response.on('end', function() {
			        var data = JSON.parse(body);
			        
			        cards[room.id] = new Cards();
			        cards[room.id].setCards(room.people, data);


			        var deck1 = cards[room.id].getNumCards(0);
			        var deck2 = cards[room.id].getNumCards(1);
			        cardsqty = {deck1: deck1, deck2: deck2 };


			        var roomid=room.id;

			        for (var index in room.people) {
						io.to(room.people[index]).emit("start game", {pindex: index, deck: cards[room.id].getCards(index), cardsqty: cardsqty });

						

						setTimeout(function() {
							deck1 = cards[room.id].getNumCards(0);
			        		deck2 = cards[room.id].getNumCards(1);

			        		var winner=0
			        		if (deck1>deck2) {
			        			winner=1;
			        		}else{
			        			winner=2;
			        		}
							io.sockets.in(roomid).emit("game over", {winner: winner});
						}, 300000);
					}
			        
			    });


			}).on('error', function(e) {
			    console.log("Got error: ", e);
			});

	  	};
  	});

	socket.on('play', function(data){

		var room;
		for (var index in rooms) {
			if (rooms[index].id == people[socket.id].inroom) {
				room = rooms[index];
			};
		}
		io.sockets.in(room.id).emit("new play", {key: data.key, card1: cards[room.id].getCards(0), card2: cards[room.id].getCards(1)});
		var winner = cards[room.id].play(data.key);

        if (cards[room.id].getCards(0)===undefined || cards[room.id].getCards(1)===undefined) {
        	
        	var winner=0;
        	if (cards[room.id].getCards(0)===undefined) {
        		winner=2;
        	}else{
        		winner=1;
        	}

        	io.sockets.in(room.id).emit("game over", {winner: winner});

        }else{
        	var deck1 = cards[room.id].getNumCards(0);
        	var deck2 = cards[room.id].getNumCards(1);

        	cardsqty = {deck1: deck1, deck2: deck2 };

        	if (winner==1) {
        		room.turno=1;
        	}else{
        		room.turno=2;
        	}

			for (var index in room.people) {
				io.to(room.people[index]).emit("new turn", {pindex: index, deck: cards[room.id].getCards(index), cardsqty: cardsqty, winner: winner, turn: room.turno });
			}
        }

  	});


  	socket.on('disconnect', function(){

	  	var roomid = people[socket.id].inroom;
	  	var playerleft = people[socket.id];

	  	if(people[socket.id].inroom != null){
	  		for (var index in rooms) {
			  if (rooms[index].id==roomid) {
			  	rooms[ index ].removePerson(socket.id);
			  	if (rooms[index].people.length==0) {
			  		rooms.splice(index, 1);
			  	}
			  }
			}
	  	}
	    delete people[socket.id];

	    io.sockets.in(roomid).emit("left game", {player: playerleft});
  	});

});


function getAvaliableRoomId(){

	var roomindex;

	for (var index in rooms) {
	  if (rooms[index].people.length<2) {
	  	roomindex = rooms[index];
	  	return roomindex;
	  }
	}

	var room = new Room(shortid.generate());

	rooms.push(room);

	for (var index in rooms) {
	  if (rooms[index].people.length<2) {
	  	roomindex = rooms[index];
	  	return roomindex;
	  }
	}

}


// app.get('/play/:id', function(req, res){
//   // req.params.name
//   res.sendFile(__dirname + '/room.html');
// });

