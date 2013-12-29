cards = [];
names = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
types = ["spades", "clubs", "diamonds", "hearts"];
function createCardDeck()
{
	for( i = 0; i<52; i++)
	{
		name = names[i%13];
		color = i <26 ? "black" : "red";
		type = types[Math.round(i/13)]
		cards.push({id: i, name: name, color: color, type: type});
	}
	
	shuffle();
	return cards;
}

function shuffle()
{
// To shuffle an array a of n elements (indices 0..n-1):
  for (i= 0; i>0; i--)
  {
	j = Math.floor(Math.random() * (i+1));
	tmp = cards[j];
	cards[j] = cards[i];
	cards[i] = tmp;
  }
}


