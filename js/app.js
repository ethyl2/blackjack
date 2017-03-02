function Card(myName, mySuit, myValue) {
  this.name = myName;
  this.suit = mySuit;
  this.value = myValue;
}

// Setting up the deck.
var cardDeck = {
  allCards: [],
  suits: ["Hearts", "Diamonds", "Spades", "Clubs"],
  names: ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Jack", "Queen", "King"],
  usedCards: [],
  populateDeck: function() {
    for (var i = 0; i < this.suits.length; i++) {
      for (var j = 0; j < this.names.length; j++) {
        this.allCards.push(new Card(this.names[j], this.suits[i], j+1));
      }
    }
    // The specifications indicate that aces should be always worth 11 instead
    // of 1 in this version of the game. To change those values:
    for (var i = 0; i < this.allCards.length; i++) {
      if (this.allCards[i].name == "Ace") {
        this.allCards[i].value += 10;
      }
    }
  }
};

function Hand() {
  this.cards = [];
  this.currentTotal = 0;

  this.sumCardTotal = function() {
    this.currentTotal = 0;
    for (var i = 0; i < this.cards.length; i++) {
      this.currentTotal += this.cards[i].value;
    }
  }

  this.displayCardTotal = function() {
    $("#hdrTotal").html("Total value: " + this.currentTotal);
  }

  this.scoreHand = function() {
    if (this.currentTotal > 21) {
      $("#hdrResult").html("BUST!");
    } else if (this.currentTotal == 21) {
      $("#hdrResult").html("Blackjack! Winner!");
    } else if (this.currentTotal < 21 && this.cards.length == 5){
      $("#hdrResult").html("5 card trick! Winner!");
    } else {
      //keep playing
    }
  }
};

// Initiating a game

function Game() {
  this.usersHand = new Hand();
  this.dealersHand = new Hand();
  this.init = function() {
    cardDeck.populateDeck();
  }
  this.hit = function(player) {
    var goodCard = false;
    do {
      var index = getRandom(cardDeck.allCards.length);
      if (!($.inArray(index, cardDeck.usedCards) > -1)) {
        goodCard = true;
        var card = cardDeck.allCards[index];
        cardDeck.usedCards.push(index);
        // If player is user, add to users' hand
        if (player === "user") {
          this.usersHand.cards.push(card);
          var $myHandContent = $("<div>");
          $myHandContent.addClass("current_hand").appendTo("#my_hand");
          var imageUrl = "img/cards/" + card.suit + "/" + card.name + ".jpg";
          $("<img>").appendTo($myHandContent).attr("src", imageUrl).fadeOut("slow")
            .fadeIn("slow");
        // If player is dealer, add to dealer's hand.
        } else if (player == "dealer") {
          this.dealersHand.cards.push(card);
          this.dealersHand.sumCardTotal();
        }
      }
    } while (!goodCard);
    goodCard = false;
    this.usersHand.sumCardTotal();
    this.usersHand.displayCardTotal();
    this.usersHand.scoreHand();
  };
  this.deal = function() {
    this.hit('user');
    this.hit('dealer');
  };
  this.stick = function() {
    if (this.dealersHand.currentTotal > 21) {
      $("#hdrResult").html("You win! The dealer went over with a score of " +
        this.dealersHand.currentTotal + ".");
    } else if (this.usersHand.currentTotal > 21) {
      $("#hdrResult").html("You lose since you went over 21. Try again.");
    } else if (this.usersHand.currentTotal > this.dealersHand.currentTotal) {
      $("#hdrResult").html("Stick! Dealer's score is only " +
        this.dealersHand.currentTotal +  ".So you are a winner!");
    } else if (this.dealersHand.currentTotal === this.usersHand.currentTotal) {
      $("#hdrResult").html("Tie!");
    } else {
      $("#hdrResult").html("You lose since the dealer got a higher score than you -- a " +
      this.dealersHand.currentTotal + ".");
    }
  }
};

var game = new Game();
game.init();

function getRandom(num) {
  return Math.floor(Math.random() * num);
}
