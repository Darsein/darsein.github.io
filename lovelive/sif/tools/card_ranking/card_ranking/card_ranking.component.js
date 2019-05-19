angular.module('darsein-hp')
  .component('cardRanking', {
    templateUrl: 'card_ranking/card_ranking.template.html',
    controller: function cardRankingController($scope, $rootScope, $cookies, cardData) {
      var self = this;

      self.card_data = new cardData();

      // TODO: store it in cookies.
      self.filtering_condition = {};
      self.filtering_condition["type"] = ["pure", "cool"];
      self.filtering_condition["rarity"] = ["N", "R", "SR", "SSR"];
      self.filtering_condition["skill_type"] = "スコア";

      self.available_skill_type = ["スコア", "回復"];
      self.skill_level = 0;

      // for filtering
      self.card_filter = function(card, index) {
        for (var type of self.filtering_condition.type) {
          if (card.type === type) return false;
        }
        for (var rarity of self.filtering_condition.rarity) {
          if (card.rarity === rarity) return false;
        }
        return true;
      };

      // for skill filtering
      self.skill_filter = function(card) {
        return card.skill && card.skill.type === self.filtering_condition.skill_type;
      }

      self.setTypeCondition = function(ev, type) {
        var index = self.filtering_condition.type.indexOf(type);
        if (index >= 0) {
          self.filtering_condition.type.splice(index, 1);
        } else {
          self.filtering_condition.type.push(type);
        }
      };

      self.hasTypeCondition = function(type) {
        return self.filtering_condition.type.indexOf(type) >= 0;
      };

      self.setRarityCondition = function(ev, rarity) {
        var index = self.filtering_condition.rarity.indexOf(rarity);
        if (index >= 0) {
          self.filtering_condition.rarity.splice(index, 1);
        } else {
          self.filtering_condition.rarity.push(rarity);
        }
      };

      self.hasRarityCondition = function(rarity) {
        return self.filtering_condition.rarity.indexOf(rarity) >= 0;
      };

      self.music = $cookies.get('music') ? JSON.parse($cookies.get('music')) : {
        "type": "smile",
        "notes": 500,
        "group": "μ's",
        "time": 120,
        "perfect": 90,
      };

      self.level_range = [...Array(16).keys()];

      self.query = {
        order: 'id',
        limit: 10,
        page: 1,
        limit_options: [10, 30, 50, 100, 200, 500, 1000],
      };

      self.calcNumOfChances = function(condition, count) {
        if (condition === "リズムアイコン") {
          return Math.floor(self.music.notes / count);
        } else if (condition === "スターアイコン") {
          // TODO: implement properly.
          return 0;
        } else if (condition === "コンボ") {
          return Math.floor(self.music.notes / count);
        } else if (condition === "秒") {
          return Math.floor(self.music.time / count);
        } else if (condition === "PERFECT") {
          return Math.floor(self.music.notes * self.music.perfect / 100 / count);
        } else if (condition === "スコア") {
          // TODO: implement properly.
          return 0;
        } else if (condition === "チェイン") {
          // TODO: implement properly.
          return 0;
        }
        return 0;
      }

      self.calcSkillExpForScore = function(skill) {
        var skill_exp = [];
        for (var level of self.level_range) {

          var stats = skill.stats_list[level];
          if (level >= skill.stats_list.length) {
            stats = skill.stats_list[skill.stats_list.length - 1];
          }
          var num = self.calcNumOfChances(skill.condition, stats[3]);
          var exp = num * stats[0] / 100 * stats[1];
          skill_exp.push(exp);
        }
        return skill_exp;
      }

      self.calcSkillExpForRecover = function(skill) {
        var skill_exp = [];
        for (var level of self.level_range) {

          var stats = skill.stats_list[level];
          if (level >= skill.stats_list.length) {
            stats = skill.stats_list[skill.stats_list.length - 1];
          }
          var num = self.calcNumOfChances(skill.condition, stats[3]);
          var exp = num * stats[0] / 100 * stats[1];
          skill_exp.push(exp);
        }
        return skill_exp;
      }

      self.calcSkillExp = function(skill) {
        if (skill.type === "スコア") {
          return self.calcSkillExpForScore(skill);
        } else if (skill.type === "回復") {
          return self.calcSkillExpForRecover(skill);
        }
        // TODO: implement expected value calculation for other skill types.
        return self.calcSkillExpForScore(skill);
      }

      self.getCards = function () {
        var cards = [];
        self.card_data.card_load_promise.then( function(unused) {
          for (var card of self.card_data.brief_card_list) {
            if (!self.card_filter(card, card.id)) {
              continue;
            }
            self.card_data.getCard(card.id).then(function(card_data) {
              if (!self.skill_filter(card_data)) {
                return;
              }
              var detailed_card = {};
              detailed_card["id"] = card_data.id;
              detailed_card["name"] = card_data.chara_name;
              if (card_data.chara_title.length > 0) {
                detailed_card["name"] += " [" + card_data.chara_title + "]";
              }
              detailed_card["skill_type"] = card_data.skill.type;
              detailed_card["skill_exp"] = self.calcSkillExp(card_data.skill);
              cards.push(detailed_card);
            });
          }
        });
        return cards;
      }

      self.cards = [];

      function success(cards) {
        self.cards = cards;
      }

      self.refreshCards = function () {
        self.promise = Promise.resolve(self.getCards()).then(success);
      }

      $scope.$watch(function() {
        return self.music;
      }, function(newVal, oldVal) {
          self.refreshCards();
      }, true);

      $scope.$watch(function() {
        return self.activated_skill_type;
      }, function(newVal, oldVal) {
          self.refreshCards();
      }, true);

      $scope.$watch(function() {
        return self.filtering_condition;
      }, function(newVal, oldVal) {
          self.refreshCards();
      }, true);
    }
  });
