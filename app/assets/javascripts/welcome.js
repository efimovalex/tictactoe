var GameID = null;
var Player = null;
var Name = null;
var Interval = null;
$( document ).ready(function() {
	ShowForm();
	var params = QueryString();
	if (typeof(params.game) === 'undefined') {
		$('#name_submit').click(function(){
			var playerName = $('#player').val();	
			if (playerName !== '') {
					Player = 'x';
					Name = playerName;
					NewGame(playerName);
			} else {
					ShowError('Please choose a name');
			}
		});
	} else {
		$('#name_submit').click(function(){
			var playerName = $('#player').val();	
			if (playerName !== '') {
					Player = 'o';
					GameID = params.game;
					Name = playerName;
					AddSecondPlayer(params.game,playerName);
			} else {
					ShowError('Please choose a name');
			}
		});
	}
});

var MoveListener = function(){
	$('td').click(function(){
		if ($(this).html() === '') {
			MakeMove($(this))
		}
	});
};

var GetUpdate = function(){
	Interval = setInterval(function(){
    GetGame(GameID);
	}, 1000);
}

var MakeMove = function(cell){
	$('#error').remove();
	$.ajax({
		url: '/game/' + GameID +'/player_' + Player +'/' + Name + '/cell/' + cell.attr('id'),
		type: 'POST',
		success: function(data) {
			if (data.status == 'success') {
				cell.html(Player);
				ShowBoard(data.result.cell1, data.result.cell2, data.result.cell3, data.result.cell4, data.result.cell5, data.result.cell6, data.result.cell7, data.result.cell8, data.result.cell9);
			} else {
				ShowError(data.message)
			}
			console.log(data);
			if (data.winner === Name) {
				DisplayWinner(data.winner);
			}
			if (data.is_tie_game == true){
				DisplayTie();
			}
		}
	});
};

var DisplayWinner = function(name)
{
	clearInterval(Interval);
	$(body).prepend(name + ", has won the game")
}

var DisplayTie = function(name)
{
	clearInterval(Interval);
	$(body).prepend("Tie!")
}


var ShowForm = function() {
	$form = $("<form></form>");
	$form.append('<label for="player1">Name: </label>');
	$form.append('<input type="text" name="player1" id="player"/>');
	$form.append('<input type="button" id="name_submit" value="Start Game" />');
	$('body').append($form);
	$form.submit(function( event ) {
	  event.stopPropagation();
	});
};

var ShowError = function(message){
	$('#error').remove();
	$('body').prepend('<p id="error">' + message + '</p>');
};

var ShowGameForPlayerX = function(id){
	$('body').html("<p>Share with your friend to play: </p>")
	$('body').append('<input disabled size="30" value="http://' + window.location.host + '?game=' + id + '" />');
	GetGame(id);
	GetUpdate();
};
var ShowGameForPlayerO = function(id){
	$('body').html('')
	GetGame(id);
	GetUpdate();
};

var ShowBoard = function(cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9){
	$board = $('<table id="game_board" border=1 width="100px" height="100px"></table>');
	$board.append('<tr><td id="cell1" height="30px" width="30px">' + (cell1 == null ? '' : cell1) +'</td><td id="cell2" height="30px" width="30px">' + (cell2 == null ? '' : cell2) + '</td><td id="cell3" height="30px" width="30px">' + (cell3 == null ? '' : cell3) + '</td><tr>')

	$board.append('<tr><td id="cell4" height="30px" width="30px">' + (cell4 == null ? '' : cell4) +'</td><td id="cell5" height="30px" width="30px">' + (cell5 == null ? '' : cell5) + '</td><td id="cell6" height="30px" width="30px">' + (cell6 == null ? '' : cell6) + '</td><tr>')

	$board.append('<tr><td id="cell7" height="30px" width="30px">' + (cell7 == null ? '' : cell7) +'</td><td id="cell8" height="30px" width="30px">' + (cell8 == null ? '' : cell8) + '</td><td id="cell9" height="30px" width="30px"	>' + (cell9 == null ? '' : cell9) + '</td><tr>')

	if (document.getElementById('game_board') === null) {
		$('body').append($board)
	} else {
		$('#game_board').replaceWith($board)
	}
	MoveListener();
};

var GetGame = function(id){
	$.ajax({
		url: '/game/' + id,
		type: 'GET',
		success: function(data) {
			if (data.status == 'success') {
				ShowBoard(data.result.cell1, data.result.cell2, data.result.cell3, data.result.cell4, data.result.cell5, data.result.cell6, data.result.cell7, data.result.cell8, data.result.cell9);
			} else {
				ShowError(data.message)
			}
			if (data.winner != null) {
					DisplayWinner(data.winner);
			}
			if (data.is_tie_game == true){
				DisplayTie();
			}
		}
	});
};

// get url parameters
var QueryString = function(){
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	} 

	return query_string;
};

var AddSecondPlayer = function (id, name){
	$.ajax({
		url: '/game/' + id + '/player_o/' + name,
		type: 'PUT',
		success: function(data) {
			if (data.status == 'success') {
				ShowGameForPlayerO(data.result)
			} else {
				ShowError(data.message)
			}
		}
	});
};

var NewGame = function (name){
	$.ajax({
		url: '/game/player_x/' + name,
		type: 'PUT',
		success: function(data) {
			if (data.status == 'success') {
				GameID = data.result
				ShowGameForPlayerX(data.result)
			} else {
				ShowError(data.message)
			}
		}
	});
};