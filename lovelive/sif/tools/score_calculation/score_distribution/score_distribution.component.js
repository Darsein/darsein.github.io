angular.module('unitScore')
  .component('scoreDistribution', {
    templateUrl: 'score_distribution/score_distribution.template.html',
    controller: function scoreDistributionController($scope, $rootScope) {
      // TODO: make music and bonus as user input
      this.music = {
        "type": "cool",
        "notes": 500,
        "group": "μ's",
        "time": 120,
        "perfect": 90,
      };

      this.bonus = {
        "LS": null,
        "arrange_tap": 1.0,
        "arrange_skill": 1.0,
        "friend_tap": 1.0,
        "friend_skill": 1.0,
        "student_tap": 1.0,
        "student_skill": 1.0,
        "nakayoshi_tap": 1.0,
      };

      this.calcComboRatio = function(x) {
        if (x <= 50) return 1.00;
        if (x <= 100) return 1.10;
        if (x <= 200) return 1.15;
        if (x <= 400) return 1.20;
        if (x <= 600) return 1.25;
        if (x <= 800) return 1.30;
        return 1.35;
      };

      this.success = function(prob) {
        return Math.random() * 100 < prob;
      };

      this.deck = [];

      this.getDeck = function() {
        this.deck.length = 0;
        for (var index of $rootScope.user_data.unit_members) {
          if (index < 0) continue;
          var card_params = $rootScope.user_data.own_card_list[index];
          var card_info = $rootScope.card_data.card_list[card_params.id - 1];

          var card = {};
          card["chara_name"] = card_info.chara_name;
          card["type"] = card_info.type;
          card["group"] = $rootScope.card_data.chara_info[card_info.chara_name].group;
          for (var type of $rootScope.card_data.types) {
            card[type] = card_info[type][card_params.level - 1];
          }
          card["kizuna"] = card_params.kizuna;

          card["center_skill"] = card_info.center_skill;
          card["skill"] = card_info.skill;
          card["skill"]["prob"] = card_info.skill.stats_list[card_params.skill_level - 1][0];
          card["skill"]["value"] = card_info.skill.stats_list[card_params.skill_level - 1][1];

          card["SIS"] = [];
          for (var SIS of card_params.SIS) {
            card["SIS"].push(SIS.name);
          }

          this.deck.push(card);
        }
        return this.deck;
      }

      this.centerSkillUp = function(val, card, LS) {
        var up = {
          "smile": 0,
          "pure": 0,
          "cool": 0
        };
        if (LS) {
          up[LS.type] += Math.ceil(0.01 * LS.ratio * val[LS.base_type]);
          if (LS.sub_type) {
            if ($rootScope.card_data.chara_info[card.chara_name].group === LS.sub_condition ||
              $rootScope.card_data.chara_info[card.chara_name].grade === LS.sub_condition ||
              $rootScope.card_data.chara_info[card.chara_name].unit === LS.sub_condition) {

              up[LS.sub_type] += Math.ceil(0.01 * LS.sub_ratio * val[LS.sub_type]);
            }
          }
        }
        return up;
      };

      this.cardStatus = function(card, type, LS, FLS, aura_num, veil_num) {
        var Sa = {};
        for (var type of $rootScope.card_data.types) Sa[type] = card[type];
        Sa[card.type] += card.kizuna;

        var Su = new Object(Sa);
        for (SIS of card.SIS) {
          var type = "all";
          if (/スマイル/.test(SIS)) type = "smile";
          if (/ピュア/.test(SIS)) type = "pure";
          if (/クール/.test(SIS)) type = "cool";

          if (/キッス/.test(SIS)) Su[type] += 200;
          if (/パフューム/.test(SIS)) Su[type] += 450;
          if (/リング/.test(SIS)) Su[type] += Math.ceil(Sa[type] * 0.10);
          if (/クロス/.test(SIS)) Su[type] += Math.ceil(Sa[type] * 0.16);
        }

        var trick = {
          "smile": 0,
          "pure": 0,
          "cool": 0
        };
        for (SIS of card.SIS) {
          var type = "all";
          if (/プリンセス/.test(SIS)) type = "smile";
          if (/エンジェル/.test(SIS)) type = "pure";
          if (/エンプレス/.test(SIS)) type = "cool";

          if (/トリック/.test(SIS)) trick[type] = Math.ceil(Su[type] * 0.33);
        }

        for (var type of $rootScope.card_data.types) {
          Su[type] += Math.ceil(Sa[type] * 0.018) * aura_num[type];
          Su[type] += Math.ceil(Sa[type] * 0.024) * veil_num[type];
        }

        var LS_up = this.centerSkillUp(Su, card, LS);
        var FLS_up = this.centerSkillUp(Su, card, FLS);
        for (var valid_type of $rootScope.card_data.types) {
          Su[valid_type] += LS_up[valid_type] + FLS_up[valid_type];
        }

        return {
          "status": Su[type],
          "trick_status": trick[type],
        };
      };

      this.calcDeckStatus = function(deck, music, bonus) {
        if (deck.length != 9) return {
          "status": 0,
          "trick": 0,
        };
        var aura_num = {
          "smile": 0,
          "pure": 0,
          "cool": 0
        };
        var veil_num = {
          "smile": 0,
          "pure": 0,
          "cool": 0
        };
        for (var card of deck) {
          for (var SIS of card.SIS) {
            var type = "all";
            if (/スマイル/.test(SIS)) type = "smile";
            if (/ピュア/.test(SIS)) type = "pure";
            if (/クール/.test(SIS)) type = "cool";

            if (/オーラ/.test(SIS)) ++aura_num[type];
            if (/ヴェール/.test(SIS)) ++veil_num[type];
          }
        }

        var LS = deck[4].center_skill;

        var status = 0;
        var trick_status = 0;
        for (var card of deck) {
          var card_status = this.cardStatus(card, music.type, LS, bonus.LS, aura_num, veil_num);
          status += card_status.status;
          trick_status += card_status.status + card_status.trick_status;
        }
        return {
          "status": status,
          "trick_status": trick_status,
        };
      };

      // TODO: improve performance
      this.simulatePlay = function(deck, music, bonus) {
        var status = this.calcDeckStatus(deck, music, bonus);
        var tap_bonus = 1 * bonus.arrange_tap * bonus.friend_tap * bonus.student_tap;
        var prob_bonus = 1 * bonus.arrange_skill * bonus.friend_skill * bonus.student_skill;
        var events = [];
        for (var card of deck) {
          if (card.skill.condition === "秒") {
            for (var sec = card.skill.required; sec <= music.time; sec += card.skill.required) {
              events.push(sec);
            }
          }
        }

        var score = 0;
        var trick_num = 0;
        var event_id = 0;
        var end_trick = [];
        var perfect_num = 0;
        for (var x = 1; x <= music.notes; ++x) {
          var current_time = x / music.notes * music.time;
          while (event_id < events.length && events[event_id] < current_time) {
            var event_time = events[event_id];
            for (var card of deck) {
              if (card.skill.condition === "秒" && event_time % card.skill.required === 0) {
                var prob = card.skill.prob * prob_bonus;
                if (this.success(prob)) {
                  if (card.skill.type === "スコア") {
                    var ratio = 1;
                    for (var SIS of card.SIS) {
                      if (/チャーム/.test(SIS)) ratio = 2.5;
                    }
                    score += card.skill.value * ratio;
                  } else if (card.skill.type === "回復") {
                    var ratio = 0;
                    for (var SIS of card.SIS) {
                      if (/ヒール/.test(SIS)) ratio = 480;
                    }
                    score += card.skill.value * ratio;
                  } else if (card.skill.type === "判定") {
                    trick_num++;
                    end_trick.push(event_time + card.skill.value);
                  }
                }
              }
            }
            event_id++;
          }
          while (end_trick.length > 0 && end_trick[end_trick.length - 1] < current_time) {
            trick_num--;
            end_trick.pop();
          }

          // TODO: long note
          var combo_ratio = this.calcComboRatio(x);
          var long_note_ratio = (x % 10 === 0) ? 1.25 : 1.0;

          // TODO: note position
          var position = x % 9;
          var position_ratio = (deck[position].group === music.group) ? 1.1 : 1.0;
          position_ratio *= (deck[position].type === music.type) ? 1.1 : 1.0;

          var perfect_ratio = 0.88;
          if (trick_num > 0 || this.success(music.perfect)) {
            perfect_ratio = 1.0;
            perfect_num++;
          }

          var tap_score = trick_num > 0 ? status.trick_status : status.status;
          tap_score *= 0.0125 * tap_bonus * perfect_ratio * long_note_ratio * position_ratio * combo_ratio;
          score += Math.floor(tap_score);

          for (var card of deck) {
            if (card.skill.type === "判定") {
              var is_skill_invoked = false;
              if (card.skill.condition === "リズムアイコン" || card.skill.condition === "コンボ") {
                is_skill_invoked = x % card.skill.required === 0;
              } else if (card.skill.condition === "PERFECT") {
                is_skill_invoked = perfect_num % card.skill.required === 0;
              }

              if (is_skill_invoked) {
                var prob = card.skill.prob * prob_bonus;
                if (this.success(prob)) {
                  trick_num++;
                  end_trick.push(current_time + card.skill.value);
                }
              }
            }
          }
        }

        // calc skill score
        // TODO: handle skills invoked by star icons and score
        for (var card of deck) {
          var chance_num = 0;
          if (card.skill.condition === "リズムアイコン" || card.skill.condition === "コンボ") {
            chance_num = Math.floor(music.notes / card.skill.required);
          } else if (card.skill.condition === "PERFECT") {
            chance_num = Math.floor(perfect_num / card.skill.required);
          }

          for (var i = 0; i < chance_num; ++i) {
            var prob = card.skill.prob * prob_bonus;
            if (this.success(prob)) {
              if (card.skill.type === "スコア") {
                var ratio = 1;
                for (var SIS of card.SIS) {
                  if (/チャーム/.test(SIS)) ratio = 2.5;
                }
                score += card.skill.value * ratio;
              } else if (card.skill.type === "回復") {
                var ratio = 0;
                for (var SIS of card.SIS) {
                  if (/ヒール/.test(SIS)) ratio = 480;
                }
                score += card.skill.value * ratio;
              }
            }
          }
        }

        return score;
      };

      this.average = 0;
      this.variance = 0;
      this.getStatistics = function(deck, music, bonus) {
        // TODO: ajust the number of simulations
        var times = 1000;
        var scores = [];
        for (var i = 0; i < times; ++i) {
          scores.push(this.simulatePlay(deck, music, bonus));
        }

        // calculate average
        var sum = 0;
        for (var i = 0; i < times; ++i) {
          sum += scores[i];
        }
        this.average = sum / times;

        // calculate variance
        var squared_sum = 0;
        for (var i = 0; i < times; ++i) {
          squared_sum += (scores[i] - this.average) * (scores[i] - this.average);
        }
        this.variance = squared_sum / times;
      };

      this.getStatistics(this.getDeck(), this.music, this.bonus);

      var self = this;
      $rootScope.$watch("user_data", function(newVal, oldVal) {
        self.getStatistics(self.getDeck(), self.music, self.bonus);
      }, true);
    }
  });
