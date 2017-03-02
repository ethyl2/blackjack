function Card(myName, mySuit, myValue) {
  this.name = myName;
  this.suit = mySuit;
  this.value = myValue;
};

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
    // of 1 in this version of the game. To correct those values:
    for (var i = 0; i < this.allCards.length; i++) {
      if (this.allCards[i].name == "Ace") {
        this.allCards[i].value += 10;
      }
    }
  }
}; // end cardDeck object

function Hand() {
  this.cards = [];
  this.currentTotal = 0;

  this.sumCardTotal = function() {
    this.currentTotal = 0;
    for (var i = 0; i < this.cards.length; i++) {
      this.currentTotal += this.cards[i].value;
    }
  };

  this.displayCardTotal = function() {
    $("#hdrTotal").html("Total value: " + this.currentTotal);
  };
}; //end Hand constructor

function Game() {
  this.usersHand = new Hand();
  this.dealersHand = new Hand();
  this.outcome = "";

  this.init = function() {
    $("#result").css("display", "none");
    cardDeck.populateDeck();
    this.deal();
    this.deal();
  };

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
    this.score();
  };

  this.deal = function() {
    this.hit('user');
    this.hit('dealer');
  };

  this.stick = function() {
    if (this.usersHand.currentTotal == 21) {
      $("#hdrResult").html("Blackjack! You win!");
      this.outcome = "win";
    } else if (this.dealersHand.currentTotal > 21 && this.usersHand.currentTotal <= 21) {
      $("#hdrResult").html("You win! The dealer went over with a score of " +
        this.dealersHand.currentTotal + ".");
      this.outcome = "win";
    } else if (this.usersHand.currentTotal > 21) {
      $("#hdrResult").html("You lose since you went over 21. Try again.");
      this.outcome = "lost";
    } else if (this.usersHand.currentTotal > this.dealersHand.currentTotal) {
      $("#hdrResult").html("Stick! Dealer's score is only " +
        this.dealersHand.currentTotal +  ". So you are a winner!");
      this.outcome = "win";
    } else if (this.dealersHand.currentTotal === this.usersHand.currentTotal) {
      $("#hdrResult").html("Tie!");
      this.outcome = "tie";
    } else {
      $("#hdrResult").html("You lose since the dealer got a higher score than you -- a " +
      this.dealersHand.currentTotal + ".");
      this.outcome = "lost";
    }
    this.displayEnd();
  };

  this.score = function() {
    if (this.usersHand.currentTotal > 21) {
      $("#hdrResult").html("BUST! Try again.");
      this.outcome = "lost";
      this.displayEnd();
    } else if (this.usersHand.currentTotal == 21) {
      $("#hdrResult").html("Blackjack! Winner!");
      this.outcome = "win";
      this.displayEnd();
    } else if (this.usersHand.currentTotal < 21 && this.usersHand.cards.length == 5){
      $("#hdrResult").html("5 card trick! Winner!");
      this.outcome = "win";
      this.displayEnd();
    } else {
      $("#hdrResult").html("Keep going?");
    }
  };

  this.restart = function() {
    this.usersHand = new Hand();
    this.dealersHand = new Hand();
    cardDeck.usedCards = [];
    $("#my_hand").empty();
    $("#hdrTotal").html("");
    $("#hdrResult").html("");
    $("#btnDeal").css("display", "inline");
    $("#btnStick").css("display", "inline");
    this.init();
  };

  this.displayEnd = function() {
    $("#btnDeal").css("display", "none");
    $("#btnStick").css("display", "none");
    $("#result").css("display", "inline");
    if (this.outcome === "win" || this.outcome === "tie") {
      $("#imgResult").attr("src", "img/check.png");
    } else {
      $("#imgResult").attr("src", "img/x2.png");
    }
  }

}; // end of Game constructor

var game;

$(document).ready(function() {
   game = new Game();
   game.init();
 }
)

function getRandom(num) {
  return Math.floor(Math.random() * num);
}
