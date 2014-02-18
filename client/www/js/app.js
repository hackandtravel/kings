/** @jsx React.DOM */

var KeyCodes = {
  ENTER: 13,
  SPACE: 32,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39
}

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
  10: "Category",
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
  10: "Come up with a category, and the person to your right must name something that falls within that category. This continues until someone can't.",
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

Math.sign = function (x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
};

var AppView = React.createClass({
  getInitialState: function () {
    var cards = createCardDeck();

    return {
      i: 0,
      kings: 0,
      cards: cards,
      nextCard: {
        title: "Kings",
        text: "Swipe to draw the next card.",
        text2: "Remember to drink in moderation.",
        type: "",
        name: "",
        color: "red",
        percent: 100,
        kings: 4
      },
      card: {}
    };
  },

  componentWillMount: function () {
    this.nextCard();
  },

  componentDidMount: function () {
    $(document).on("keyup", this.onKeyUp);
  },

  modelToCard: function (model) {
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

  nextCard: function () {
    var card = this.state.nextCard;

    var nextModel = getNextCard(this.state.cards);

    this.state.i++;
    if (nextModel.name == "K") this.state.kings++;

    var nextCard = this.modelToCard(nextModel);

    if (this.state.kings == 4) {
      nextCard.text = kingText;
      nextCard.text2 = "";
      nextCard.percent = 100;

      this.state.cards = createCardDeck();
      this.state.i = 0;
      this.state.kings = 0;
    }

    this.setState({
      nextCard: nextCard,
      card: card
    });
  },

  saturate: function (v) {
    return Math.min(1, Math.max(0, v));
  },

  updateDOM: function (diff) {
    var percentage = diff / this.width;
    var sign = Math.sign(percentage);
    percentage = Math.abs(percentage / 2);

    var tilt = sign * this.saturate(percentage - 0.25);

    this.app.css("transform", "translateX(" + diff + "px) rotateY(" + (90 * tilt) + "deg)");
    this.opacityNext.css("opacity", 0.75 + percentage);
    this.opacity.css("opacity", 1.25 - percentage);
  },

  alpha: 0.9,

  // moveLoopNum: 1,

  magicNumber: screen.availWidth,

  move: function () {
    var _this = this;
    // var moveLoopNum = _this.moveLoopNum++;

    var moveLoop = function (time) {

      // console.log("moveLoop " + moveLoopNum);
      // console.log("moveLoop touching = " + _this.touching);

      var timeDiff = time - _this.lastTime;
      if (timeDiff > 0) {
        _this.velocity = (1 - _this.alpha) * _this.velocity + _this.alpha * (_this.pageX - _this.lastPageX) / timeDiff;
      }

      _this.lastPageX = _this.pageX;
      _this.lastTime = time;

      // console.log(_this.velocity);

      _this.updateDOM(_this.diff);

      if (_this.touching === true) {
        requestAnimationFrame(moveLoop);
      }
    };

    requestAnimationFrame(moveLoop);
  },

  /**
   * @param b start value
   * @param c change in value
   * @param d duration
   * @param callback function to call after animation finished
   */
  animate: function (b, c, d, callback) {
    var _this = this;
    var start = null;

    var animationLoop = function (time) {
      if (start === null) start = time;

      var diff = _this.linearTween(time - start, b, c, d);
      _this.updateDOM(diff);

      if (time < start + d) {
        requestAnimationFrame(animationLoop);
      } else if (callback) {
        callback.call(_this);
      }
    };

    requestAnimationFrame(animationLoop);
  },

  saveDOMElements: function () {
    this.app = $("#app");
    this.appNext = $("#app-next");
    this.opacity = this.app.find(".opacity");
    this.opacityNext = this.appNext.find(".opacity");
  },

  touchStart: function (e) {
    e.preventDefault();
    if (e.targetTouches.length == 1 && !this.animating) {

      var touch = e.targetTouches[0];

      this.startX = touch.pageX;
      this.diff = 0;

      this.touching = true;
      this.saveDOMElements();
      this.width = screen.availWidth;

      this.velocity = 0;
      this.lastTime = 0;
      this.lastPageX = this.startX;
      this.pageX = this.startX;

      this.move()
    }
  },

  touchMove: function (e) {
    e.preventDefault();
    if (e.targetTouches.length >= 1 && this.touching) {
      var touch = e.targetTouches[0];

      this.pageX = touch.pageX;
      this.diff = this.pageX - this.startX;
    }
  },

  reset: function () {
    this.updateDOM(0);
    this.animating = false;
  },

  success: function () {
    this.nextCard();
    this.reset();
  },

  touchEnd: function (e) {
    e.preventDefault();
    if (e.targetTouches.length == 0 && this.touching) {

      this.touching = false;

      var direction = Math.sign(this.pageX - this.startX);
      var futureDiff = this.diff + Math.floor(this.magicNumber * this.velocity);
      // console.log(direction + " " + futureDiff);

      var startValue, changeInValue, duration, callback;

      if (direction > 0) {
        this.animating = true;
        if (futureDiff > this.width / 2) {
          startValue = this.diff;
          changeInValue = this.width - this.diff;
          callback = this.success;
        } else {
          startValue = this.diff;
          changeInValue = -this.diff;
          callback = this.reset;
        }
      } else if (direction < 0) {
        this.animating = true;
        if (-futureDiff > this.width / 2) {
          startValue = this.diff;
          changeInValue = -(this.width + this.diff);
          callback = this.success;
        } else {
          startValue = this.diff;
          changeInValue = -this.diff;
          callback = this.reset;
        }
      }

      if (this.animating) {
        if (callback == this.success) {
          duration = Math.min(333, Math.abs(changeInValue) / Math.abs(this.velocity));
        } else {
          duration = 100;
        }
        this.animate.call(this, startValue, changeInValue, duration, callback);
      }
    }
  },

  /**
   * @param t current time
   * @param b start value
   * @param c change in value
   * @param d duration
   * @returns {number}
   */
  linearTween: function (t, b, c, d) {
    return c * t / d + b;
  },

  onKeyUp: function (e) {
    this.saveDOMElements();
    this.width = screen.availWidth;
    if (e.keyCode == KeyCodes.RIGHT_ARROW || e.keyCode == KeyCodes.ENTER || e.keyCode == KeyCodes.SPACE) {
      this.animate(0, this.width, 300, this.success);
    } else if (e.keyCode == KeyCodes.LEFT_ARROW) {
      this.animate(0, -this.width, 300, this.success);
    }
  },

  render: function () {
    var card = this.state.card;
    var nextCard = this.state.nextCard;

    return (
      <div id="perspective" onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd} onTouchCancel={this.touchEnd} onTouchLeave={this.touchEnd}>
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

  beerify: function (text) {
    text = _.escape(text);
    text = text
      .replace(/[dD]rinking/g, this.beerIcon)
      .replace(/[dD]rinks/g, this.beerIcon)
      .replace(/[dD]rink/g, this.beerIcon);
    return <span dangerouslySetInnerHTML={{__html: text}} />
  },

  render: function () {
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
