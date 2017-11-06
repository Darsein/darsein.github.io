angular.module('unitScore')
  .component('scoreDistribution', {
    templateUrl: 'score_distribution/score_distribution.template.html',
    controller: function scoreDistributionController($scope, $rootScope, $cookies, $localStorage) {
      var self = this;
      self.music = $cookies.get('music') ? JSON.parse($cookies.get('music')) : {
        "type": "smile",
        "notes": 500,
        "group": "μ's",
        "time": 120,
        "perfect": 90,
      };

      // TODO: make bonus as user input
      self.bonus = $cookies.get('bonus') ? JSON.parse($cookies.get('bonus')) : {
        "LS_pre": null,
        "LS_suf": "smile",
        "LS_sub": null,
        "arrange_tap": 1.0,
        "arrange_skill": 1.0,
        "friend_tap": 1.0,
        "friend_skill": 1.0,
        "student_tap": 1.0,
        "student_skill": 1.0,
        "nakayoshi_tap": 1.0,
        "arbitrary_tap": 1.0,
        "arbitrary_skill": 1.0,
      };

      self.calcFLS = function() {
        if (self.bonus.LS_pre !== null && self.bonus.LS_suf !== null) {
          var fLS = new Object();
          fLS.name = self.bonus.LS_pre + self.bonus.LS_suf;
          fLS.type = self.bonus.LS_pre;
          fLS.base_type = self.bonus.LS_suf;
          fLS.ratio = (self.bonus.LS_pre === self.bonus.LS_suf) ? 9 : 12;
          if (self.bonus.LS_sub !== null) {
            fLS.sub_type = self.bonus.LS_pre;
            fLS.sub_condition = self.bonus.LS_sub;
            fLS.sub_ratio = (self.bonus.LS_sub === "μ's" || self.bonus.LS_sub === "Aqours") ? 3 : 6;
          }
          return fLS;
        }
        return null;
      };

      // TODO: stop to call self function each calculation to speed up
      self.calcComboRatio = function(x) {
        if (x <= 50) return 1.00;
        if (x <= 100) return 1.10;
        if (x <= 200) return 1.15;
        if (x <= 400) return 1.20;
        if (x <= 600) return 1.25;
        if (x <= 800) return 1.30;
        return 1.35;
      };

      self.success = function(prob) {
        return Math.random() * 100 < prob;
      };

      self.deck = [];

      self.updateDeck = function() {
        self.deck = [];
        for (var index of $rootScope.user_data.unit_members) {
          if (index < 0) continue;
          var card_params = $rootScope.user_data.own_card_list[index];
          Promise.resolve(card_params).then(function(card_params) {
            $rootScope.card_data.getCard(card_params.id).then(function(card_info) {
              var card = {};
              card["chara_name"] = card_info.chara_name;
              card["type"] = card_info.type;
              if ($rootScope.card_data.chara_info[card_info.chara_name]) {
                card["group"] = $rootScope.card_data.chara_info[card_info.chara_name].group;
                card["unit"] = $rootScope.card_data.chara_info[card_info.chara_name].unit;
                card["grade"] = $rootScope.card_data.chara_info[card_info.chara_name].grade;
              }
              for (var type of $rootScope.card_data.types) {
                card[type] = card_info[type][card_params.level - 1];
              }
              card["kizuna"] = card_params.kizuna;

              card["center_skill"] = Object.assign({}, card_info.center_skill);
              if (card_info.skill) {
                card["skill"] = Object.assign({}, card_info.skill);
                card["skill"]["prob"] = card_info.skill.stats_list[card_params.skill_level - 1][0];
                card["skill"]["value"] = card_info.skill.stats_list[card_params.skill_level - 1][1];
                card["skill"]["term"] = card_info.skill.stats_list[card_params.skill_level - 1][2];
              } else {
                card["skill"] = {
                  "type": null,
                }
              }

              card["SIS"] = [];
              for (var SIS of card_params.SIS) {
                card["SIS"].push(SIS.name);
              }
              self.deck.push(card);

              if (self.deck.length == 9) {
                self.drawGraph();
              }
            });
          });
        }
      }

      self.centerSkillUp = function(val, card, LS) {
        var up = {
          "smile": 0,
          "pure": 0,
          "cool": 0
        };
        if (LS) {
          up[LS.type] += Math.ceil(0.01 * LS.ratio * val[LS.base_type]);
          if (LS.sub_type) {
            if (card.group === LS.sub_condition ||
              card.grade === LS.sub_condition ||
              card.unit === LS.sub_condition) {
              up[LS.sub_type] += Math.ceil(0.01 * LS.sub_ratio * val[LS.sub_type]);
            }
          }
        }
        return up;
      };

      self.cardStatus = function(card, music_type, LS, FLS, aura_num, veil_num, deck) {
        var Sa = {};
        for (var type of $rootScope.card_data.types) Sa[type] = card[type];
        Sa[card.type] += card.kizuna;

        var Su = {};
        for (var type of $rootScope.card_data.types) {
          Su[type] = Sa[type];
        }
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

        var LS_up = self.centerSkillUp(Su, card, LS);
        var FLS_up = self.centerSkillUp(Su, card, FLS);
        for (var valid_type of $rootScope.card_data.types) {
          Su[valid_type] += LS_up[valid_type] + FLS_up[valid_type];
        }

        var skill_status = new Array(deck.length);
        for (var i = 0; i < deck.length; ++i) {
          skill_status[i] = 0;
          if (deck[i].skill.type === "パラアップ") {
            var target = deck[i].skill.target.split(' ');
            var target_grade = target[0], target_group = target[1];
            console.log(target_grade, target_group);
            // TODO: handle unit
            if (card.grade === target_grade && card.group === target_group) {
              skill_status[i] = Su[music_type] * 0.01 * deck[i].skill.value;
            }
          } else if (deck[i].skill.type === "判定") {
            skill_status[i] = trick[music_type];
          }
        }

        return {
          "status": Su[music_type],
          "skill_status": skill_status,
        };
      };

      self.status = 0;
      self.calcDeckStatus = function(deck, music, bonus) {
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
        var FLS = self.calcFLS();

        var status = 0;
        var skill_status = new Array(deck.length);
        for (var i = 0; i < deck.length; ++i) {
          skill_status[i] = 0;
        }
        for (var card of deck) {
          var card_status = self.cardStatus(card, music.type, LS, FLS, aura_num, veil_num, deck);
          status += card_status.status;
          for (var i = 0; i < deck.length; ++i) {
            skill_status[i] += card_status.skill_status[i];
          }
        }

        self.status = status;
        return {
          "status": status,
          "skill_status": skill_status,
        };
      };

      // TODO: improve performance
      self.simulatePlay = function(deck, music, bonus, status) {
        var trick_status_up = 0;
        for (var i = 0; i < deck.length; ++i) {
          if (deck[i].skill.type === "判定") {
            trick_status_up = status.skill_status[i];
          }
        }

        var tap_bonus = 1 * bonus.arrange_tap * bonus.friend_tap * bonus.student_tap * bonus.arbitrary_tap;
        var prob_bonus = 1 * bonus.arrange_skill * bonus.friend_skill * bonus.student_skill * bonus.arbitrary_skill;

        var events = [];
        for (var card of deck) {
          if (card.skill.condition === "秒") {
            for (var sec = card.skill.required; sec <= music.time; sec += card.skill.required) {
              events.push(sec);
            }
          }
        }

        var score = 0;
        var skill_score = 0;
        var perfect_num = 0;
        var event_id = 0;
        var end_trick = [];

        var skill_prob_queue = [];
        var perfect_tap_end_time = new Array(deck.length);
        var param_up_end_time = new Array(deck.length);

        for (var x = 1; x <= music.notes; ++x) {
          var current_time = x / music.notes * music.time;
          while (event_id < events.length && events[event_id] < current_time) {
            var event_time = events[event_id];
            for (var card of deck) {
              if (card.skill.condition === "秒" && event_time % card.skill.required === 0) {
                // TODO: handle new skill per time (not implemented as is 2017/10/09)
                var prob = card.skill.prob * prob_bonus;
                if (skill_prob_queue.length > 0) {
                  prob *= skill_prob_queue[0].value;
                }
                if (self.success(prob)) {
                  if (card.skill.type === "スコア") {
                    var ratio = 1;
                    for (var SIS of card.SIS) {
                      if (/チャーム/.test(SIS)) ratio = 2.5;
                    }
                    score += card.skill.value * ratio;
                    skill_score += card.skill.value * ratio;
                  } else if (card.skill.type === "回復") {
                    var ratio = 0;
                    for (var SIS of card.SIS) {
                      if (/ヒール/.test(SIS)) ratio = 480;
                    }
                    score += card.skill.value * ratio;
                    skill_score += card.skill.value * ratio;
                  } else if (card.skill.type === "判定") {
                    end_trick.push(event_time + card.skill.term);
                    end_trick.sort(function(a, b) {
                      return b - a;
                    });
                  }
                }
              }
            }
            event_id++;
          }
          while (end_trick.length > 0 && end_trick[end_trick.length - 1] < current_time) {
            end_trick.pop();
          }
          while (skill_prob_queue.length > 0 && skill_prob_queue[0].end_time < current_time) {
            skill_prob_queue.shift();
          }
          for (var i = 0; i < deck.length; ++i) {
            if (perfect_tap_end_time[i] !== undefined && perfect_tap_end_time[i] < current_time) {
              perfect_tap_end_time[i] = undefined;
            }
            if (param_up_end_time[i] !== undefined && param_up_end_time[i] < current_time) {
              param_up_end_time[i] = undefined;
            }
          }

          // TODO: long note
          var combo_ratio = self.calcComboRatio(x);
          var long_note_ratio = (x % 10 === 0) ? 1.25 : 1.0;

          // TODO: note position
          var position = x % 9;
          var position_ratio = (deck[position].group === music.group) ? 1.1 : 1.0;
          position_ratio *= (deck[position].type === music.type) ? 1.1 : 1.0;

          var perfect_ratio = 0.88;
          var is_perfect_tap = false;
          if (end_trick.length > 0 || self.success(music.perfect)) {
            perfect_ratio = 1.0;
            perfect_num++;
            is_perfect_tap = true;
            for (var i = 0; i < deck.length; ++i) {
              if (perfect_tap_end_time[i] !== undefined)
              score += deck[i].skill.value;
            }
          }

          var tap_score = status.status;
          if (end_trick.length > 0) {
            tap_score += trick_status_up;
          }
          {
            var max_param_up = 0;
            for (var i = 0; i < deck.length; ++i) {
              if (param_up_end_time[i] !== undefined)
              max_param_up = Math.max(max_param_up, status.skill_status[i]);
            }
            tap_score += max_param_up;
          }
          tap_score *= 0.0125 * tap_bonus * perfect_ratio * long_note_ratio * position_ratio * combo_ratio;
          score += Math.floor(tap_score);

          for (var i = 0; i < deck.length; ++i) {
            var card = deck[i];
            // TODO: handle skills invoked by star icons and score
            var is_skill_invoked = false;
            if (card.skill.condition === "リズムアイコン" || card.skill.condition === "コンボ") {
              is_skill_invoked = (x % card.skill.required === 0);
            } else if (card.skill.condition === "PERFECT") {
              is_skill_invoked = is_perfect_tap && (perfect_num % card.skill.required === 0);
            }

            // TODO: handle new skill
            if (is_skill_invoked) {
              var prob = card.skill.prob * prob_bonus;
              if (card.skill.type === "特技") {
                if (self.success(prob)) {
                  var end_time = (skill_prob_queue.length > 0 ? skill_prob_queue[skill_prob_queue.length - 1].end_time : current_time) + card.skill.term;
                  skill_prob_queue.push({
                    "end_time": end_time,
                    "value": (1 + 0.01 * card.skill.value),
                  })
                }
              } else {
                if (skill_prob_queue.length > 0) {
                  prob *= skill_prob_queue[0].value;
                }
                if (self.success(prob)) {
                  if (card.skill.type === "スコア") {
                    var ratio = 1;
                    for (var SIS of card.SIS) {
                      if (/チャーム/.test(SIS)) ratio = 2.5;
                    }
                    score += card.skill.value * ratio;
                    skill_score += card.skill.value * ratio;
                  } else if (card.skill.type === "回復") {
                    var ratio = 0;
                    for (var SIS of card.SIS) {
                      if (/ヒール/.test(SIS)) ratio = 480;
                    }
                    score += card.skill.value * ratio;
                    skill_score += card.skill.value * ratio;
                  } else if (card.skill.type === "判定") {
                    end_trick.push(current_time + card.skill.term);
                    end_trick.sort(function(a, b) {
                      return b - a;
                    });
                  } else if (card.skill.type === "パーフェクト") {
                    perfect_tap_end_time[i] = (perfect_tap_end_time[i] === undefined ? current_time : perfect_tap_end_time[i]) + card.skill.term;
                  } else if (card.skill.type === "パラアップ") {
                    param_up_end_time[i] = (param_up_end_time[i] === undefined ? current_time : param_up_end_time[i]) + card.skill.term;
                  }
                }
              }
            }
          }
        }

        return {
          "total_score": score,
          "skill_score": skill_score
        };
      };

      self.average = 0;
      self.deviation = 0;
      self.lower = 0;
      self.upper = 0;
      self.getStatistics = function(deck, music, bonus, times) {
        // TODO: ajust the number of simulations
        var scores = [];
        var status = self.calcDeckStatus(deck, music, bonus);
        for (var i = 0; i < times; ++i) {
          scores.push(self.simulatePlay(deck, music, bonus, status));
        }
        scores.sort(function(a, b) {
          return a.total_score - b.total_score;
        });
        self.lower = scores[times*2.5/100].total_score;
        self.upper = scores[times*97.5/100].total_score;

        // calculate average
        var total_sum = 0;
        var skill_sum = 0;
        for (var i = 0; i < times; ++i) {
          total_sum += scores[i].total_score;
          skill_sum += scores[i].skill_score;
        }
        self.average = (total_sum / times).toFixed(2);
        // TODO: expose this data in UI
        var skill_avarage = skill_sum / times;

        // calculate variance
        var total_squared_sum = 0;
        var skill_squared_sum = 0;
        for (var i = 0; i < times; ++i) {
          total_squared_sum += (scores[i].total_score - self.average) * (scores[i].total_score - self.average);
          skill_squared_sum += (scores[i].skill_score - self.average) * (scores[i].skill_score - self.average);
        }
        self.deviation = Math.sqrt(total_squared_sum / times).toFixed(2);
        // TODO: expose this data in UI
        var skill_variance = skill_squared_sum / times;

        return scores;
      };

      self.scores = [];
      self.drawGraph = function() {
        var times = 1000;
        self.scores = self.getStatistics(self.deck, self.music, self.bonus, times);
        var min = self.scores[0].total_score;
        var max = self.scores[0].total_score;
        for (var score of self.scores) {
          min = Math.min(min, score.total_score);
          max = Math.max(max, score.total_score);
        }

        var width = max - min;
        var bucket_num = 30;
        var bucket_size = Math.ceil(width / bucket_num);

        var buckets = [];
        var labels = [];
        for (var i = 0; i < bucket_num; ++i) {
          buckets.push(0);
          labels.push(min + bucket_size * i);
        }
        for (var score of self.scores) {
          buckets[Math.floor((score.total_score - min) / bucket_size)]++;
        }
        for (var i = 0; i < bucket_num; ++i) {
          buckets[i] /= times;
        }

        // TODO: add regular distribution
        $scope.plot_labels = labels;
        $scope.plot_data = buckets;
        self.calcTargetProb();
      }

      self.detail = $cookies.get('detail') ? JSON.parse($cookies.get('detail')) : {
        "try_num": 10,
        "target_score": 300000,
      };
      self.over_prob = 0;
      self.calcTargetProb = function() {
        var times = self.scores.length;
        var border = times;
        for (var i = 0; i < times; ++i) {
          if (self.detail.target_score <= self.scores[i].total_score) {
            border = i;
            break;
          }
        }

        var success_prob_per_play = (times - border) / times;
        var fail_prob = 1;
        for (var i = 0; i < self.detail.try_num; ++i) {
          fail_prob *= (1 - success_prob_per_play);
        }
        self.over_prob = (100 - fail_prob * 100).toFixed(2);
      };

      // watch change by user input
      $rootScope.$watch("user_data", function(newVal, oldVal) {
        // store in local storage
        $localStorage.user_data = $rootScope.user_data;

        self.updateDeck();
      }, true);

      $scope.$watch(function() {
        return self.music;
      }, function(newVal, oldVal) {
        // TODO: move it to local storage
        // store in cookies
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('music', JSON.stringify(self.music), {
          expires: expire
        });

        if (self.deck.length == 9) {
          self.drawGraph();
        }
      }, true);


      $scope.$watch(function() {
        return self.bonus;
      }, function(newVal, oldVal) {
        // TODO: move it to local storage
        // store in cookies
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('bonus', JSON.stringify(self.bonus), {
          expires: expire
        });

        if (self.deck.length == 9) {
          self.drawGraph();
        }
      }, true);

      $scope.$watch(function() {
        return self.detail;
      }, function(newVal, oldVal) {
        // TODO: move it to local storage
        // store in cookies
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('detail', JSON.stringify(self.detail), {
          expires: expire
        });

        self.calcTargetProb();
      }, true);
    }
  });
