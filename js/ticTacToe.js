var playerToken = 'X';
var computerToken = 'O';
var gameBoard = {};

function start() {
  generateBoard();  
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      $('#row'+i+' > .col'+j).on('click', select);
    }
  } 
  if (Math.floor(Math.random()*2) == 1) computerTurn();
}

function set(player, computer) {
  playerToken = player
  computerToken = computer;
  $('.resetBtn').css('display', 'inline-block');
  $('.selectBtn').css('display', 'none');
  $('#instruction').text('Player Gamepiece = ' + playerToken);
  $('.board').css('visibility', 'visible');
  start();
}

function generateBoard () {
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      var prop = 'row'+i+'col'+j
      gameBoard[prop] = {selected: false, occupied: undefined};
    }
  }  
}

function select(evt) {
  var row = evt.target.parentElement.id;
  var col = evt.target.classList[1];
  var square = row+col;
  if (gameBoard[square].selected == false){
    $('#'+row+' > .'+col).text(playerToken);
    gameBoard[square].selected = true; 
    gameBoard[square].occupied = 'Player';
    if (checkWin(gameBoard).win) {
      showWin();
      return;
    }
    if (!checkFull()) computerTurn();    
    else $('#status').text('Game Over');
  }  
}

function computerTurn(){
  if (checkFull()) $('#status').text('Game Over');
  else {
    var square;
    if (checkPossibles(gameBoard, 'Computer') !== undefined){
      square = checkPossibles(gameBoard, 'Computer');
    }
    else if (checkPossibles(gameBoard, 'Player') !== undefined){
      square = checkPossibles(gameBoard, 'Player');
    }
    else square = randomSelect();
    var row = square.substring(0,4);
    var col = square.substring(4);
    $('#'+row+' > .'+col).text(computerToken);
    gameBoard[square].selected = true; 
    gameBoard[square].occupied = 'Computer';    
    if (checkWin(gameBoard).win) showWin();
    else if (checkFull()) $('#status').text('Game Over');
  }
  
}

function checkWin(board) {
  for (var i=0; i<3;i++){
    if (checkSame(board['row'+i+'col0'],board['row'+i+'col1'],board['row'+i+'col2'])){
      return {win: true, 
              winner: board['row'+i+'col0'].occupied,
              selection: '#row'+i+' > .col-4'};
    }
    if (checkSame(board['row0col'+i],board['row1col'+i],board['row2col'+i])){
      return {win: true, 
              winner: board['row0col'+i].occupied,
              selection: '.col'+i};
    }
  }
  if (checkSame(board['row0col0'],board['row1col1'],board['row2col2'])){
      return {win: true, 
              winner: board['row0col0'].occupied,
              selection: '#row0 > .col0, #row1 > .col1, #row2 > .col2'};
    }
  if (checkSame(board['row2col0'],board['row1col1'],board['row0col2'])){    
      return {win: true, 
              winner: board['row2col0'].occupied,
              selection: '#row0 > .col2, #row1 > .col1, #row2 > .col0'};
    }
  return {win: false};
 }
  
function checkSame(one, two, three){
  if (one.occupied !== undefined){
    if (one.occupied == two.occupied && two.occupied == three.occupied) return true;
    else return false;
  }
  else return false;
  
}

function showWin() {
  var winDetails = checkWin(gameBoard);
   $('#status').text(winDetails.winner + ' Wins!!!');
   $(winDetails.selection).css('color', 'red');
}

function checkFull() {
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      var prop = 'row'+i+'col'+j
      if (gameBoard[prop].selected == false) return false;
    }
  }  
  return true;
}

function clearListeners () {
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      $('#row'+i+' > .col'+j).off();
    }
  }  
}

function reset() {
  clearListeners();
  $('.col-4').text('');
  $('#status').text('');
  $('#instruction').text('Select your Gamepiece');
  $('.resetBtn').css('display', 'none');
  $('.selectBtn').css('display', 'inline-block');
  $('.board').css('visibility', 'hidden');
  $('.col-4').css('color', 'black');
}

function checkPossibles(board, player){
  for (var i=0; i<3; i++){
    for (var j=0; j<3; j++){
      var prop = 'row'+i+'col'+j
      if (board[prop].selected == false){
        board[prop].occupied = player;
        if (checkWin(board).winner == player){
          board[prop].occupied = undefined;
          return prop;
        }
        board[prop].occupied = undefined;
      }        
    }
  }
  return undefined;
}

function randomSelect() {
  var row = 'row' + Math.floor(Math.random()*3);
  var col = 'col' + Math.floor(Math.random()*3);
  var square = row+col;
  if (gameBoard[square].selected == false){
    return square;
    /*$('#'+row+' > .'+col).text(computerToken);
    gameBoard[square].selected = true; 
    gameBoard[square].occupied = 'Computer';    
    if (checkWin(gameBoard).win) showWin();*/
  }
  else {
    return randomSelect();
  }  
}