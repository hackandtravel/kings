/** @jsx React.DOM */

var titles = {
  A: "Waterfall",
  2: "Give 2",
  3: "Take 3",
  4: "Give 2 Take 2",
  5: "Rule",
  6: "Thumbs",
  7: "Hands Up",
  8: "Mate",
  9: "Rhyme Time",
  10:	"Category",
  J: "Guys Drink",
  Q: "Girls Drink",
  K: "King's Cup"
};

var texts = {
  A: "Each player starts to drink at the same time as the person to their left.",
  2: "Point at two people and tell them to drink.",
  3: "Take three drinks.",
  4: "Give out two drinks, and take two drinks yourself.",
  5: "Set a rule to be followed.",
  6: "Place your thumb on the table whenever you like.",
  7: "Last person to raise their hand must drink.",
  8: "Choose a person to be your mate and they drink when you drink for the rest of the game.",
  9: "Say a word, and the person to your right has to say a word that rhymes. This continues until someone can't.",
  10:	"Come up with a category, and the person to your right must name something that falls within that category. This continues until someone can't.",
  J: "All the guys at the table must take a drink.",
  Q: "All the girls at the table must take a drink.",
  K: "Put some of your drink into the King's Cup."
};

var kingText = "Drink the contents of the King's Cup.";

var texts2 = {
  A: "No player can stop drinking until the player before them stops.",
  2: "You can also tell one person to take two drinks.",
  3: "",
  4: "",
  5: "E.g.: drink with your left hand. Tap your head before you drink. Don't use Christian names.",
  6: "The last person to place their thumb on the table must drink.",
  7: "",
  8: "",
  9: "This person must drink.",
  10: "This person must drink.",
  J: "",
  Q: "",
  K: "When the 4th King is drawn, this person must drink the contents of the King's Cup."
};

Math.sign = function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };

var AppView = React.createClass({
  getInitialState: function() {
    createCardDeck();
    shuffle();

    return {
      i: 0,
      kings: 0,
      nextCard: {
        title: "Kings",
        text: "Tap anywhere to draw the next card.",
        text2: "Remember to drink in moderation.",
        type: "",
        name: "",
        color: "red",
        percent: 100,
        kings: 4
      },
      card: {},
    };
  },

  componentWillMount: function() {
    this.nextCard();
    this.animCount = 0;
  },

  modelToCard: function(model) {
    return {
      title: (titles[model.name]),
      text: (texts[model.name]),
      text2: (texts2[model.name]),
      type: "&" + model.type + ";",
      name: model.name,
      color: model.color,
      percent: (this.state.i / 52) * 100,
      kings: this.state.kings
    };
  },

  nextCard: function() {
    var card = this.state.nextCard;


    var nextModel = getNextCard();

    this.state.i++;
    if(nextModel.name == "K") this.state.kings++;

    var nextCard = this.modelToCard(nextModel);

    if (this.state.kings == 4) {
      nextCard.text = kingText;
      nextCard.text2 = "";
      nextCard.percent = 100;

      createCardDeck();
      shuffle();
      this.state.i = 0;
      this.state.kings = 0;
    }

    this.setState({
      nextCard: nextCard,
      card: card
    });
  },

  touchStart: function(e) {
    if (e.targetTouches.length == 1) {
      e.preventDefault();

      var touch = e.targetTouches[0];

      this.startX = touch.pageX;
      this.diff = 0;

      this.touching = true;
      this.animating = false;

      this.app = $("#app");
      this.appNext = $("#app-next");
      this.opacity = this.app.find(".opacity");
      this.opacityNext = this.appNext.find(".opacity");

      this.width = screen.availWidth;

      var _this = this;
      var alpha = 0.4;
	  var magicNumber = 50;
      var animCount = this.animCount++;
	  this.velocity = 0;
	  this.lastTime = 0;
	  this.lastPageX  = this.startX;
	  this.pageX = this.startX;
      (function animloop(time) {
       // console.log("animloop " + time);

        var s = _this.diff / _this.width;
        var sign = Math.sign(s);
        s = Math.abs(s / 2);

        var pan = s - 0.25;
        pan = sign * Math.min(1, Math.max(0, pan));
		
        _this.app.css("transform", "translateX("+_this.diff+"px) rotateY("+(90 * pan)+"deg)");
        _this.opacityNext.css("opacity", 0.75 + s);
        _this.opacity.css("opacity", 1.25 - s);
        if (_this.touching) {
         
		  	// if wrong normalize screen width		
			var timeDiff = time - _this.lastTime;	
			if(timeDiff > 0 )
			{
				_this.velocity = _this.velocity * (1-alpha) + alpha*( _this.pageX-_this.lastPageX ) / timeDiff;
			}
			_this.lastPageX = _this.pageX;
			_this.lastTime = time;		
			requestAnimationFrame(animloop);
			
        } else if (_this.animating) {
			var timeDiff = time - _this.lastTime;	
			//_this.velocity = _this.velocity * (1-alpha) + alpha*(_this.pageX-_this.lastPageX) / timeDiff;
			var direction = Math.sign(_this.pageX - _this.startX);
			var futureX = Math.abs(_this.diff) + Math.abs(magicNumber * _this.velocity);
			if(direction <0 )
			{
				if(futureX < _this.width / 2 ) 
				{
					console.log("finish swipe animation ", futureX, _this.width/2, magicNumber*_this.velocity );
				}
				else
				{
					console.log("DO nothing ", futureX, _this.width/2, magicNumber*_this.velocity );
				}
			}
			else
			{
				if(futureX > _this.width / 2 ) 
				{
					console.log("finish swipe animation ", futureX, _this.width/2, magicNumber*_this.velocity );
				}
				else
				{
						console.log("DO nothing ", futureX, _this.width/2, magicNumber*_this.velocity );
				}
			}

		
		/* var deltaT = time - _this.lastTime;
          console.log(deltaT, _this.velocity);
          _this.lastTime = time;

             if (sign > 0) {
            _this.diff -= 10;
            if (_this.diff <= 0) {
              _this.animating = false;
            }
          } else {
            _this.diff += 10;
            if (_this.diff >= _this.width) {
              _this.animating = false;
            }
          }

       
          _this.animating = false;

          if (Math.abs(_this.diff) > _this.width/2) {
            _this.nextCard();
          } 

          _this.app.css("transform", "translateX(0)");
          _this.opacityNext.css("opacity", 0);
          _this.opacity.css("opacity", 1);
         
*/
		_this.diff = _this.diff+ 5*_this.velocity;
		if(_this.diff < _this.width || _this.diff > 0)
		{
          requestAnimationFrame(animloop); 
		}
        }
      })();
    }
  },

  touchMove: function(e) {
    if (e.targetTouches.length == 1) {
      e.preventDefault();

      var touch = e.targetTouches[0];

      this.pageX = touch.pageX;
      this.diff = this.pageX - this.startX;

    }
  },

  touchEnd: function(e) {
    if (e.targetTouches.length == 1) {
      e.preventDefault();

      this.touchMove(e);

      this.touching = false;
      this.animating = true;
    }
  },

  render: function() {
    var card = this.state.card;
    var nextCard = this.state.nextCard;

    return (
      <div id="perspective" onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd}>
        <div id="app-next" className="page">
          <CardView card={nextCard} />
        </div>
        <div id="app" className="page">
          <CardView card={card} />
        </div>
      </div>
    );
  }
});

var CardView = React.createClass({
  beerIcon: '<i class="fa fa-beer"></i>',

  beerify: function(text) {
    text = _.escape(text);
    text = text
      .replace(/[dD]rinking/g, this.beerIcon)
      .replace(/[dD]rinks/g, this.beerIcon)
      .replace(/[dD]rink/g, this.beerIcon);
    return <span dangerouslySetInnerHTML={{__html: text}} />
  },

  render: function() {
    var card = this.props.card;

    var classes = "app " + card.color + " " + card.name;
    if (card.kings == 4) classes += " last-king";

    var kingsCount = [];
    for (var i = 0; i < card.kings; i++) {
      kingsCount.push(<div key={i} className="dot" />);
    }

    return (
      <div className={classes}>
        <div className="bg" />
        <div className="opacity">
          <div className="progress">
            <div className="progress-bar" role="progressbar" aria-valuenow={card.percent} aria-valuemin="0" aria-valuemax="100" style={{width: card.percent + "%"}} />
          </div>
          <h1>
            {this.beerify(card.title)}
            <span className="card">
              <span className="color" dangerouslySetInnerHTML={{__html: card.type}} />
              <span className="name">{card.name}</span>
            </span>
          </h1>
          <hr/>
          <p className="">{this.beerify(card.text)}</p>
          <p className="thin">{this.beerify(card.text2)}</p>
          <div className="rotate">
            <h1>
              {this.beerify(card.title)}
              <span className="card">
                <span className="color" dangerouslySetInnerHTML={{__html: card.type}} />
                <span className="name">{card.name}</span>
              </span>
            </h1>
            <hr/>
            <div className="king-count">
              {kingsCount}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

React.initializeTouchEvents(true);
React.renderComponent(<AppView />, document.body);
