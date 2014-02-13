/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
}

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
}

var kingText = "Drink the contents of the King's Cup."

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

}

Math.sign = function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };

var app = {
    initialize: function() {
        createCardDeck();
        shuffle();
        this.i++;
        this.renderCard(getNextCard(), "#app-next");
        this.bindEvents();
    },

    template: _.template($("#app-template").html()),

    locked: false,

    clicked: function() {
      if (!this.locked) {
        this.locked = true;

        //$("#app").addClass("page-left");

        setTimeout(function() {
          app.locked = false;
          app.fullyLoaded();
        }, 300);
      }
    },

    fullyLoaded: function() {
        $("#app").html($("#app-next .app").clone()); //.removeClass("page-left");
        this.i++;
        this.renderCard(getNextCard(), "#app-next");
    },

    bindEvents: function() {
        var card = {
          title: "Kings",
          text: "Tap anywhere to draw the next card.",
          text2: app.beerify("Remember to drink in moderation."),
          type: "",
          name: "",
          color: "red",
          percent: 100,
          kings: 4
        };

        $("#app").html(this.template(card)).find(".app").addClass("last-king");
        //document.addEventListener("click", app.clicked, false);

        var _this = app;

        document.addEventListener("touchstart", function(e) {
          if (e.targetTouches.length == 1) {
            var touch = e.targetTouches[0];

            // $("#board").removeClass("transition");
            _this.startX = touch.pageX;
            _this.diff = 0;
            _this.diffValue = "0";
            _this.touching = true;

            _this.app = $("#app");
            _this.appNext = $("#app-next");
            _this.opacity = _this.app.find(".opacity");
            _this.opacityNext = _this.appNext.find(".opacity");

            _this.width = screen.availWidth;

            (function animloop(time) {
              if (_this.touching) {
                var s = _this.diff / _this.width;
                var sign = Math.sign(s);
                s = Math.abs(s / 2);

                var pan = s;
                pan = sign * Math.min(1, Math.max(0, pan));

                _this.app.css("transform", "translateX("+_this.diffValue+") rotateY("+(90 * pan)+"deg)");

                _this.opacityNext.css("opacity", 0.75 + s);
                _this.opacity.css("opacity", 1.25 - s);

                requestAnimationFrame(animloop);
              }
            })();
          }
        });

        document.addEventListener("touchmove", function(e) {
          if (e.targetTouches.length == 1) {
            var pageXBefore = _this.pageX;
            _this.pageX = e.targetTouches[0].pageX;

            var timeBefore = _this.time;
            _this.time = new Date().getTime();

            var deltaT = _this.time - timeBefore;

            _this.diff = (_this.pageX - _this.startX);
            _this.diffValue = _this.diff + "px";

            _this.velocity = (pageXBefore - _this.pageX) / deltaT;
            //console.log(_this.velocity);
          }
        });

        document.addEventListener("touchend", function(e) {
          app.touching = false;
          if (Math.abs(_this.pageX - _this.startX) > _this.width/2) {
            _this.app.css("transform", "translateX(0)");
            _this.opacityNext.css("opacity", 1);
            _this.opacity.css("opacity", 0);
            _this.fullyLoaded();
          } else {
            _this.app.css("transform", "translateX(0)");
            _this.opacityNext.css("opacity", 0);
            _this.opacity.css("opacity", 1);
          }
        });
    },

    i: 0,

    kings: 0,

    beerIcon: '<i class="fa fa-beer"></i>',

    beerify: function(text) {
      return text
        .replace(/[dD]rinking/g, app.beerIcon)
        .replace(/[dD]rinks/g, app.beerIcon)
        .replace(/[dD]rink/g, app.beerIcon)
    },

    renderCard: function(model, sel) {
        if (model != null) {
          if(model.name == "K") app.kings++;

          var card = {
            title: this.beerify(titles[model.name]),
            text: this.beerify(texts[model.name]),
            text2: this.beerify(texts2[model.name]),
            type: "&" + model.type + ";",
            name: model.name,
            color: model.color,
            percent: (this.i / 52) * 100,
            kings: this.kings
          };

          if (this.kings == 4) {
            card.text = this.beerify(kingText);
            card.text2 = "";
            card.percent = 100;
          }

          $(sel).html(this.template(card));

          if (this.kings == 4) {
            $(sel).find(".app").addClass("last-king");
            createCardDeck();
            shuffle();
            this.i = 0;
            this.kings = 0;
          }
        }
    },

    onDeviceReady: function() {
      // TODO
    }
};
