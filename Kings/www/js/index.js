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
  7: "RYHTH",
  8: "Mate",
  9: "Rhyme Time",
  10:	"Categories",
  J: "Guys Drink",
  Q: "Girls Drink",
  K: "King's Cup"
}

var texts = {
  A: "Each player starts drinking their beverage at the same time as the person to their left.",
  2: "Point at two people and tell them to drink.",
  3: "Take three drinks.",
  4: "Give out two drinks, and take two yourself.",
  5: "Set a rule to be followed.",
  6: "Place your thumb on the table, and try to do this without anyone noticing.",
  7: "Last person to raise their hand will drink.",
  8: "Choose a person to be your mate and they drink when you drink for the rest of the game.",
  9: "Say a word, and the person to your right has to say a word that rhymes. This continues around the table until someone can't think of a word.",
  10:	"Come up with a category of things, and the person to your right must come up with something that falls within that category. This goes on around the table until someone can't come up with anything.",
  J: "All the guys at the table must take a drink",
  Q: "All the girls at the table must take a drink",
  K: "Put some of your drink into the King's Cup."
}

var kingText = "Drink the contents of the King's Cup."

var texts2 = {
  A: "No player can stop drinking until the player before them stops.",
  2: "You can also tell one person to take two drinks.",
  3: "",
  4: "",
  5: "E.g. drink with your left hand. Tap your head before you drink. Don't use Christian names.",
  6: "The last person to place their thumb on the table must drink.",
  7: "",
  8: "",
  9: "This person must drink.",
  10: "This person must drink.",
  J: "",
  Q: "",
  K: "When the 4th King is drawn, the person who drew the 4th King must drink the contents of the King's Cup."

}

var app = {
    initialize: function() {
        createCardDeck();
        shuffle();
        this.bindEvents();
    },

    template: _.template($("#app-template").html()),

    bindEvents: function() {
        document.addEventListener('deviceready', function() {
          app.nextCard();
        }, false);

        document.addEventListener("click", function() {
          app.nextCard();
        }, false);
    },

    i: 0,

    kings: 0,

    nextCard: function() {
        var model = getNextCard();

        if (model != null) {
          app.i++;

          if(model.name == "K") app.kings++;

          var card = {
            title: titles[model.name],
            text: texts[model.name],
            text2: texts2[model.name],
            type: "&" + model.type + ";",
            name: model.name,
            color: model.color,
            percent: (app.i / 52) * 100,
          };

          if (app.kings == 4) {
            console.log("KING");
            card.text = kingText;
            card.text2 = "";
          }

          $("#app").html(this.template(card));

          if (app.kings == 4) {
            $("#app .app").addClass("king")
            app.kings++;
          }
        } 
        else {
          // HACK
          var card = {
            title: "Game Over",
            text: "",
            text2: "",
            type: "",
            name: "",
            color: "black",
            percent: 100,
          };

          $("#app").html(this.template(card));
        }
    },

    onDeviceReady: function() {
      // TODO
    }
};
