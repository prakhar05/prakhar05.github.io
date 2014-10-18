'use strict';

angular.module('myApp',[])
  .controller('Ctrl', function (
      $window, $scope, $log, $timeout,
      gameService, scaleBodyService, gameLogic) {
    
    
    //Globals to detect 2 clicks then make move
    var pawnPosition = {row:'',col:''};
    var pawnDelta = {row:'',col:''};
    var lastSelected = {row:'', col:''};
    var movCtr = 2;
      
    var sound = new Audio("audio/move.wav");
    sound.load();
    
    function sendComputerMove() {
      gameService.makeMove(
          gameLogic.createComputerMove($scope.jsonState,$scope.turnIndex));
    }
    
   	$scope.isPawn = function(row,col,pawn){
    	if($scope.board[row][col]===pawn){
    		return true;
    	}
    }
    
    $scope.isWTurn = function(){
    	if($scope.turnIndex===0){
    	return true;
    	}
    	else{
    	return false;
    	}
    }
    
    $scope.isSelected = function(row,col){
    	if(row===lastSelected.row && col===lastSelected.col){
//     		console.log('Found true');
    		return true;
    	}
    	else{
//     		console.log('Found false');
    		return false;
    	}
    }
    
    $scope.isBTurn = function(){
    	if($scope.turnIndex===1){
    	return true;
    	}
    	else{
    	return false;
    	}
    }
     
    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }
      else
      {
      	sound.play();
      }
      
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;
     
     // Is it the computer's turn?
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        $timeout(sendComputerMove, 500);
      }
    } 
      
    //initialise the game using this function call to updateUI
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    
    
    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!$scope.isYourTurn) {
        return;
      }
      
      if ((($scope.board[row][col]==='A' && $scope.turnIndex===0) ||
      	  	($scope.board[row][col]==='B' && $scope.turnIndex===1)) &&
      	  	(movCtr===2)){	
      	pawnPosition.row = row;
      	pawnPosition.col = col;
      	movCtr-=1;
      }
      
      else if ($scope.board[row][col]==='' && pawnPosition.row !== '' ){	
      	pawnDelta.row = row;
      	pawnDelta.col = col;
      	
      	if(gameLogic.horizontalMoveCheck(pawnPosition,pawnDelta,$scope.board)||
          	gameLogic.verticalMoveCheck(pawnPosition,pawnDelta,$scope.board)  ||
          	gameLogic.diagonalMoveCheck(pawnPosition,pawnDelta,$scope.board)){
          	movCtr-=1;
           }
        else
        	{pawnDelta.row = '';pawnDelta.col = '';}
      }
      
      
      if(movCtr===0)
      {
		try 
       	{
			var move = gameLogic.createMove(pawnPosition, pawnDelta, $scope.turnIndex,
			$scope.jsonState);
        	
        	$scope.isYourTurn = false; // to prevent making another move
        	lastSelected = {row:pawnDelta.row,col:pawnDelta.col};
        	pawnPosition = {row:'',col:''}; //reset pawnPosition,pawnDelta and movCtr
        	pawnDelta = {row:'',col:''};
        	movCtr=2;						
        	gameService.makeMove(move);
		} 
      	catch (e) 
      	{
        	$log.info(["False move", row, col]);
        	return;
      	}
      }
    };
    
    scaleBodyService.scaleBody({width: 152, height: 152});   
    
    gameService.setGame({
      gameDeveloperEmail: "prakhar05@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.getExampleGame(),
      riddles: gameLogic.getRiddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  });