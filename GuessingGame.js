function generateWinningNumber () {
    return Math.floor(100*Math.random()) +1;
}


// from Fisher-Yates shuffle
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

// returns the absolute value of the difference between the playersGuess and the winningNumber
Game.prototype.difference = function () {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function () {
    if (this.playersGuess < this.winningNumber){
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function (num) {
    if (Number.isNaN(Number(num)) || num < 1 || num > 100){
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = num;
        return this.checkGuess(this.playersGuess);
    }
}

Game.prototype.checkGuess = function (num) {
    if (num == this.winningNumber){
        winOrLose();
        return 'You Win!';
    }
    for (var i = 0; i < this.pastGuesses.length; i++){
        if (this.pastGuesses[i] == num){
            return 'You have already guessed that number.';
        }
    }
    this.pastGuesses.push(num);
    if (this.pastGuesses.length === 5){
        winOrLose();
        return 'You Lose.';
    }
    if (this.difference() < 10){
        return "You're burning up!";
    } else if (this.difference() < 25) {
        return "You're lukewarm.";
    } else if (this.difference() < 50) {
        return "You're a bit chilly.";
    } else if (this.difference() < 100) {
        return "You're ice cold!";
    }
}

newGame = function () {
    return new Game();
}

Game.prototype.provideHint = function () {
    var threeNumbers = [];
    threeNumbers.push(this.winningNumber);
    threeNumbers.push(generateWinningNumber());
    threeNumbers.push(generateWinningNumber());

    threeNumbers = shuffle(threeNumbers);

    return threeNumbers;
}

function winOrLose() {
    $('#subtitle').text('Press Reset to play again!');
    $('#submit, #hint').prop('disabled', true);
}



// jQuery instance
$(document).ready(function(){
    var game = new Game();

    function makeGuess(game){
        $('#title').text(game.playersGuessSubmission($('#player-input').val()));
        $('#player-input').val('');
        for (var i = 0; i < game.pastGuesses.length; i++){
            $('.guess').eq(i).text(game.pastGuesses[i]);
        }
    }

    $('#submit').on('click', function() {
        makeGuess(game);
    });

    $('#player-input').on('keypress', function(){
        if ( event.which == 13 ) {
            makeGuess(game);
        }
    });

    $('#reset').on('click', function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);
    });

    $('#hint').on('click', function() {
        var hint = game.provideHint();
        $('#subtitle').text('The winning number is '+hint[0]+', '+hint[1]+', or '+hint[2]+'!');
    });

});