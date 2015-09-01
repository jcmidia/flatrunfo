var http = require("http");

function Cards(name){
	this.player1 = [];	
	this.player2 = [];	
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Cards.prototype.setCards = function(players, cards)
{
	var cards = shuffle(cards);

	var i=1;
	for(key in cards){

		if ((i%2)==0) {
			this.player1.push(cards[key]);
		}else{
			this.player2.push(cards[key]);
		}
		i++;
	}

};


Cards.prototype.getCards = function(playerindex)
{

	if (playerindex==0) {
		return this.player1[0];		
	}else{
		return this.player2[0];	
	}

};

Cards.prototype.getNumCards = function(playerindex)
{

	if (playerindex==0) {
		return this.player1.length;		
	}else{
		return this.player2.length;	
	}

};

Cards.prototype.turn = function(winner)
{
	var temp_card1 = this.player1[0];
	var temp_card2 = this.player2[0];

	this.player1.splice(0, 1);
	this.player2.splice(0, 1);

	if (winner==1) {
		this.player1.push(temp_card1);
		this.player1.push(temp_card2);
	}else if(winner==2){
		this.player2.push(temp_card1);
		this.player2.push(temp_card2);
	}else{
		this.player1.push(temp_card1);
		this.player2.push(temp_card2);
	}

};

Cards.prototype.play = function(key)
{	
	var val1=0;
	var val2=0;
	var decks = this;


	if (key=="jogos") {
		val1 = decks.player1[0].jogos;
		val2 = decks.player2[0].jogos;
	}
	else if (key=="gols") {
		val1 = decks.player1[0].gols;
		val2 = decks.player2[0].gols;
	}
	else if (key=="titulos") {
		val1 = decks.player1[0].titulos;
		val2 = decks.player2[0].titulos;
	}


	if (val1 > val2) {
		decks.turn(1);
		return 1;
	}else if (val1 < val2) {
		decks.turn(2);
		return 2;
	}else{
		decks.turn(0);
		return 0;
	}

};

module.exports = Cards;



