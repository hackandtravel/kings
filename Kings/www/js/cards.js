var cards = [];
var names = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
var types = ["spades", "clubs", "diams", "hearts"];

// creates a new full card deck
function createCardDeck()
{
	cards = [];
	for( i = 0; i<52; i++)
	{
		var name = names[i%13];
		var color = i <26 ? "black" : "red";
		var type = types[Math.floor(i/13)]
		cards.push({id: i, name: name, color: color, type: type});
	}
	
	shuffle();
	return cards;
}

function shuffle()
{
// To shuffle an array a of n elements (indices 0..n-1):
  for (var i= cards.length-1; i>0; i--)
  {
	var j = Math.floor(Math.random() * (i+1));
	var tmp = cards[j];
	cards[j] = cards[i];
	cards[i] = tmp;
  }
}
// return undefined if there are no cards left
function getNextCard()
{
	return cards.pop();
}
