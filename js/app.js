function Card(myName, mySuit, myValue) {
  this.name = myName;
  this.suit = mySuit;
  this.value = myValue;
}

// Setting up the deck.
var deck = [];
var suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
var names = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Jack", "Queen", "King"];

for (var i = 0; i < suits.length; i++) {
  for (var j = 0; j < names.length; j++) {
    deck.push(new Card(names[j], suits[i], j+1));
  }
}

var usedCards = [];

var hand = {
  cards: [],
  currentTotal: 0,
  sumCardTotal: function() {
    this.currentTotal = 0;
    for (var i = 0; i < this.cards.length; i++) {
      this.currentTotal += this.cards[i].value;
    }
    $("#hdrTotal").html("Total value: " + this.currentTotal);
    console.log("Total value of hand: " + this.currentTotal);
    if (this.currentTotal > 21) {
      $("#btnStick").trigger("click");
      $("#hdrResult").html("BUST!");
    } else if (this.currentTotal == 21) {
      $("#btnStick").trigger("click");
      $("#hdrResult").html("Blackjack!");
    } else if (this.currentTotal < 21 && this.cards.length == 5){
      $("#btnStick").trigger("click");
      $("#hdrResult").html("5 card trick! Winner!");
    } else {
      //keep playing
    }
  }
};

// Dealing cards
function dealCards(num) {
  for (var i = 0; i < num; i++) {
    console.log("Time to deal a card");
    hit();
  }
}

function getRandom(num) {
  return Math.floor(Math.random() * num);
}

function hit() {
  var goodCard = false;
  do {
    var index = getRandom(deck.length);
    if (!($.inArray(index, usedCards) > -1)) {
      goodCard = true;
      var card = deck[index];
      usedCards.push(index);
      hand.cards.push(card);
      console.log("usedCards = ", usedCards);
      var $myHandContent = $("<div>");
      $myHandContent.addClass("current_hand").appendTo("#my_hand");
      var imageUrl = "img/cards/" + card.suit + "/" + card.name + ".jpg";
      $("<img>").appendTo($myHandContent).attr("src", imageUrl).fadeOut("slow")
        .fadeIn("slow");
      hand.sumCardTotal();
    }
  } while (!goodCard);
  goodCard = false;
}

function dealTwo() {
  console.log("Time to deal");
  dealCards(2);
  $("#btnDeal").toggle();
  $("#btnHit").toggle();
  $("#btnStick").toggle();
}

function stick() {
  $("#hdrResult").html("Stick!");
}
