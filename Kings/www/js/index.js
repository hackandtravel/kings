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

var app = {
    initialize: function() {
        createCardDeck();
        shuffle();
        this.bindEvents();
    },

    template: _.template($("#app-template").html()),

    locked: false,

    clicked: function() {
      if (!app.locked) {
        app.locked = true;

        app.i++;
        var next = getNextCard();
        app.renderCard(next, "#app-next");

        $("#app").addClass("page-left");
        setTimeout(function() {
          app.locked = false;
          $("#app").html($("#app-next").clone()).removeClass("page-left");
        }, 300);
      }
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
        document.addEventListener("click", app.clicked, false);
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
            title: app.beerify(titles[model.name]),
            text: app.beerify(texts[model.name]),
            text2: app.beerify(texts2[model.name]),
            type: "&" + model.type + ";",
            name: model.name,
            color: model.color,
            percent: (app.i / 52) * 100,
            kings: app.kings
          };

          if (app.kings == 4) {
            console.log("KING");
            card.text = app.beerify(kingText);
            card.text2 = "";
            card.percent = 100;
          }

          $(sel).html(this.template(card));

          if (app.kings == 4) {
            $(sel).find(".app").addClass("last-king");
            createCardDeck();
            shuffle();
            app.i = 0;
            app.kings = 0;
          }
        }
    },

    onDeviceReady: function() {
      // TODO
    }
};
