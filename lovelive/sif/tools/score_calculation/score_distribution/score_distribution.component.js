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

      // TODO: move these ceil and floor functions into a util file.
      self.ceil = function(val) {
        return Math.ceil(val - 0.000001);
      }

      self.floor = function(val) {
        return Math.floor(val + 0.000001);
      }

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

      self.getTargetMembers = function(card) {
        var required_members = new Set();
        for (var name in $rootScope.card_data.chara_info) {
          affiliation = $rootScope.card_data.chara_info[name];
          var in_group = false;
          if (card.skill.target.indexOf(affiliation.group) !== -1) {
            in_group = true;
          }
          var in_grade = false;
          if (card.skill.target.indexOf(affiliation.grade) !== -1) {
            in_grade = true;
          }
          var in_unit = false;
          if (card.skill.target.indexOf(affiliation.unit) !== -1) {
            in_unit = true;
          }
          if ( (in_group && in_grade) || (in_unit) ) {
            required_members.add(name);
          }
        }
        required_members.delete(card.chara_name);
        return required_members;
      };

      self.success = function(prob) {
        return Math.random() * 100 < prob;
      };

      self.deck = [];

      self.updateDeck = function() {
        self.deck = new Array(9);
        for (var i in $rootScope.user_data.unit_members) {
          Promise.resolve(i).then(function(i) {
            var index = $rootScope.user_data.unit_members[i];
            if (index < 0) return;
            var card_params = $rootScope.user_data.own_card_list[index];
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

              card["skill_level"] = card_params.skill_level;
              card["center_skill"] = Object.assign({}, card_info.center_skill);
              if (card_info.skill) {
                card["skill"] = Object.assign({}, card_info.skill);
              } else {
                card["skill"] = {
                  "type": null,
                }
              }
              if (card.skill.condition === "チェイン") {
                card["skill"]["required_members"] = self.getTargetMembers(card);
              }

              card["SIS"] = [];
              for (var SIS of card_params.SIS) {
                card["SIS"].push(SIS.name);
              }
              self.deck[i] = card;

              self.drawGraph();
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
          up[LS.type] += self.ceil(0.01 * LS.ratio * val[LS.base_type]);
          if (LS.sub_type) {
            if (card.group === LS.sub_condition ||
              card.grade === LS.sub_condition ||
              card.unit === LS.sub_condition) {
              up[LS.sub_type] += self.ceil(0.01 * LS.sub_ratio * val[LS.sub_type]);
            }
          }
        }
        return up;
      };

      self.cardStatus = function(card, music_type, LS, FLS, aura_num, veil_num, bloom_num, nonet_num, deck) {
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
          if (/リング/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.10);
          if (/クロス/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.16);
          if (/ウィンク/.test(SIS)) Su[type] += 1400;
          if (/トリル/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.28 - 0.000001);

          if (/パワフル/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/プリマ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/チャープ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/シューター/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/キティ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/ディーバ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/フォーチュン/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/フラワー/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/ギャラクシー/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);

          if (/オレンジ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/ブロッサム/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/ドルフィン/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/プラム/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/ボヤージュ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/リトルデーモン/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/フューチャー/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/シャイニー/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
          if (/ロリポップ/.test(SIS)) Su[type] += self.ceil(Sa[type] * 0.29);
        }

        for (var type of $rootScope.card_data.types) {
          Su[type] += self.ceil(Sa[type] * 0.018) * aura_num[type];
          Su[type] += self.ceil(Sa[type] * 0.024) * veil_num[type];
          Su[type] += self.ceil(Sa[type] * 0.040) * bloom_num[type];
          Su[type] += self.ceil(Sa[type] * 0.042) * nonet_num[type];
        }

        var LS_up = self.centerSkillUp(Su, card, LS);
        var FLS_up = self.centerSkillUp(Su, card, FLS);
        for (var valid_type of $rootScope.card_data.types) {
          Su[valid_type] += LS_up[valid_type] + FLS_up[valid_type];
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

          if (/トリック/.test(SIS)) trick[type] = self.ceil(Su[type] * 0.33);
        }

        var skill_status = new Array(deck.length);
        for (var i = 0; i < deck.length; ++i) {
          skill_status[i] = 0;
          if (deck[i].skill.type === "パラアップ") {
            // TODO: handle unit
            var target = deck[i].skill.target.split(' ');
            var target_grade = target[0], target_group = target[1];
            if (card.grade === target_grade && card.group === target_group) {
              skill_status[i] = Su[music_type] * 0.01;
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
        var bloom_num = {
          "smile": 0,
          "pure": 0,
          "cool": 0
        };
        var nonet_num = {
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
            if (/ブルーム/.test(SIS)) ++bloom_num[type];
            if (/ノネット/.test(SIS)) {
              ok = true;
              if (/Aqours/.test(SIS)) {
                for (var card of deck) {
                  ok &= (card.group == "Aqours");
                }
              } else {
                for (var card of deck) {
                  ok &= (card.group == "μ's");
                }
              }
              if (ok) {
                ++nonet_num[type];
              }
            }
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
          var card_status = self.cardStatus(card, music.type, LS, FLS, aura_num, veil_num, bloom_num, nonet_num, deck);
          status += card_status.status;
          for (var i = 0; i < deck.length; ++i) {
            // TODO: this doesn't round float to integer and thus yield error.
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
            var skill_required = card.skill.stats_list[card.skill_level - 1][3];
            for (var sec = skill_required; sec <= music.time; sec += skill_required) {
              events.push(sec);
            }
          }
        }
        events.sort();

        var score = 0;
        var skill_score = 0;
        var perfect_num = 0;
        var event_id = 0;
        var end_trick = [];
        var triggered_members = Array.from(new Array(deck.length), () => new Set());

        var skill_boost = 0;
        var skill_prob_queue = [];
        var score_consumed = new Array(deck.length);
        for (var i = 0; i < deck.length; ++i) {
          score_consumed[i] = 0;
        }
        var perfect_tap_queues = Array.from(new Array(deck.length), () => new Array());
        var param_up_queues = Array.from(new Array(deck.length), () => new Array());
        var combo_fever_queues = Array.from(new Array(deck.length), () => new Array());
        var last_skill = undefined;
        var last_SIS = undefined;

        for (var x = 1; x <= music.notes; ++x) {
          var current_time = x / music.notes * music.time;
          while (event_id < events.length && events[event_id] < current_time) {
            var event_time = events[event_id];
            while (skill_prob_queue.length > 0 && skill_prob_queue[0].end_time < event_time) {
              skill_prob_queue.shift();
            }

            for (var i = 0; i < deck.length; ++i) {
              var card = deck[i];
              var skill_required = card.skill.stats_list[card.skill_level - 1][3];
              if (card.skill.condition === "秒" && event_time % skill_required === 0) {
                // TODO: handle new skill per time (not implemented as is 2017/11/05)
                var skill = {};
                skill.type = card.skill.type;
                skill.prob = card.skill.stats_list[card.skill_level - 1][0];
                var max_skill_level = card.skill.stats_list.length;
                var current_skill_level = Math.min(max_skill_level, card.skill_level + skill_boost);
                skill.value = card.skill.stats_list[current_skill_level - 1][1];
                skill.term = card.skill.stats_list[current_skill_level - 1][2];
                skill.required = card.skill.stats_list[card.skill_level - 1][3];

                var prob = skill.prob * prob_bonus;
                if (skill_prob_queue.length > 0) {
                  prob *= skill_prob_queue[0].value;
                }
                if (self.success(prob)) {
                  skill_boost = 0;
                  for (var j = 0; j < deck.length; ++j) {
                    triggered_members[j].add(card.chara_name);
                  }
                  if (skill.type === "スコア") {
                    var ratio = 1;
                    for (var SIS of card.SIS) {
                      if (/チャーム/.test(SIS)) ratio = 2.5;
                    }
                    score += skill.value * ratio;
                    skill_score += skill.value * ratio;
                  } else if (skill.type === "回復") {
                    var ratio = 0;
                    for (var SIS of card.SIS) {
                      if (/ヒール/.test(SIS)) ratio = 480;
                    }
                    score += skill.value * ratio;
                    skill_score += skill.value * ratio;
                  } else if (skill.type === "判定") {
                    end_trick.push(event_time + skill.term);
                    end_trick.sort(function(a, b) {
                      return b - a;
                    });
                  }
                  last_skill = skill;
                  last_SIS = card.SIS;
                }
              }
            }

            var is_updated = true;
            while (is_updated) {
              is_updated = false;
              for (var i = 0; i < deck.length; ++i) {
                var card = deck[i];
                var skill_required = card.skill.stats_list[card.skill_level - 1][3];
                if (card.skill.condition === "スコア" && score - score_consumed[i] >= skill_required) {
                  score_consumed[i] += skill_required;
                  // TODO: handle new skill per time (not implemented as is 2017/11/05)
                  var skill = {};
                  skill.type = card.skill.type;
                  skill.prob = card.skill.stats_list[card.skill_level - 1][0];
                  var max_skill_level = card.skill.stats_list.length;
                  var current_skill_level = Math.min(max_skill_level, card.skill_level + skill_boost);
                  skill.value = card.skill.stats_list[current_skill_level - 1][1];
                  skill.term = card.skill.stats_list[current_skill_level - 1][2];
                  skill.required = card.skill.stats_list[card.skill_level - 1][3];

                  var prob = skill.prob * prob_bonus;
                  if (skill_prob_queue.length > 0) {
                    prob *= skill_prob_queue[0].value;
                  }
                  if (self.success(prob)) {
                    skill_boost = 0;
                    for (var j = 0; j < deck.length; ++j) {
                      triggered_members[j].add(card.chara_name);
                    }
                    if (skill.type === "スコア") {
                      var ratio = 1;
                      for (var SIS of card.SIS) {
                        if (/チャーム/.test(SIS)) ratio = 2.5;
                      }
                      score += skill.value * ratio;
                      skill_score += skill.value * ratio;
                      is_updated = true;
                    }
                    last_skill = skill;
                    last_SIS = card.SIS;
                  }
                }
              }
            }

            event_id++;
          }
          while (end_trick.length > 0 && end_trick[end_trick.length - 1] < current_time) {
            end_trick.pop();
          }
          // TODO: move it in the above loop, which is for clock count
          while (skill_prob_queue.length > 0 && skill_prob_queue[0].end_time < current_time) {
            skill_prob_queue.shift();
          }
          for (var i = 0; i < deck.length; ++i) {
            while (perfect_tap_queues[i].length > 0 && perfect_tap_queues[i][0].end_time < current_time) {
              perfect_tap_queues[i].shift();
            }
            while (param_up_queues[i].length > 0 && param_up_queues[i][0].end_time < current_time) {
              param_up_queues[i].shift();
            }
            while (combo_fever_queues[i].length > 0 && combo_fever_queues[i][0].end_time < current_time) {
              combo_fever_queues[i].shift();
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
          var is_perfect_tap = self.success(music.perfect);
          if (end_trick.length > 0 || is_perfect_tap) {
            perfect_ratio = 1.0;
            if (end_trick.length > 0 && is_perfect_tap) {
              perfect_ratio = 1.08;
            }
            perfect_num++;
            is_perfect_tap = true;
            for (var i = 0; i < deck.length; ++i) {
              if (perfect_tap_queues[i].length > 0)
              score += perfect_tap_queues[i][0].value * tap_bonus;
            }
          }

          var tap_score = status.status;
          if (end_trick.length > 0) {
            tap_score += trick_status_up;
          }
          {
            var max_param_up = 0;
            for (var i = 0; i < deck.length; ++i) {
              if (param_up_queues[i].length > 0)
              max_param_up = Math.max(max_param_up, self.ceil(status.skill_status[i] * param_up_queues[i][0].value));
            }
            tap_score += max_param_up;
          }
          {
            var combo_fever_up = 0;
            var ratio = Math.min(self.floor((x - 1) / 10), 30);
            for (var i = 0; i < deck.length; ++i) {
              if (combo_fever_queues[i].length > 0) {
                combo_fever_up += self.ceil(combo_fever_queues[i][0].value + ratio * ratio * combo_fever_queues[i][0].value / 100);
              }
            }
            score += Math.min(combo_fever_up, 1000) * tap_bonus;
          }
          tap_score *= 0.0125 * tap_bonus * perfect_ratio * long_note_ratio * position_ratio * combo_ratio;
          score += self.floor(tap_score);

          for (var i = 0; i < deck.length; ++i) {
            var card = deck[i];
            // TODO: handle skills invoked by star icons and score
            var is_skill_invoked = false;
            var skill_required = card.skill.stats_list[card.skill_level - 1][3];
            if (card.skill.condition === "リズムアイコン" || card.skill.condition === "コンボ") {
              is_skill_invoked = (x % skill_required === 0);
            } else if (card.skill.condition === "PERFECT") {
              is_skill_invoked = is_perfect_tap && (perfect_num % skill_required === 0);
            } else if (card.skill.condition === "チェイン") {
              required_members = card.skill.required_members;
              is_skill_invoked = true;
              for (var required_member of required_members) {
                is_skill_invoked &= triggered_members[i].has(required_member);
              }
              if (is_skill_invoked) {
                for (var required_member of required_members) {
                  triggered_members[i].delete(required_member);
                }
              }
            }

            // TODO: handle new skills (syncro)
            if (is_skill_invoked) {
              var skill = {};
              skill.type = card.skill.type;
              skill.prob = card.skill.stats_list[card.skill_level - 1][0];
              var max_skill_level = card.skill.stats_list.length;
              var current_skill_level = Math.min(max_skill_level, card.skill_level + skill_boost);
              skill.value = card.skill.stats_list[current_skill_level - 1][1];
              skill.term = card.skill.stats_list[current_skill_level - 1][2];
              skill.required = card.skill.stats_list[card.skill_level - 1][3];

              var activated_skill = skill;
              var activated_SIS = card.SIS;
              var prob = activated_skill.prob * prob_bonus;
              if (activated_skill.type !== "特技" && skill_prob_queue.length > 0) {
                prob *= skill_prob_queue[0].value;
              }

              if (self.success(prob)) {
                skill_boost = 0;
                for (var j = 0; j < deck.length; ++j) {
                  triggered_members[j].add(card.chara_name);
                }
                if (activated_skill.type === "リピート") {
                  if (last_skill !== undefined && last_skill.type !== "リピート") {
                    activated_skill = last_skill;
                    activated_SIS = last_SIS;
                  }
                }

                if (activated_skill.type === "スコア") {
                  var ratio = 1;
                  for (var SIS of activated_SIS) {
                    if (/チャーム/.test(SIS)) ratio = 2.5;
                  }
                  score += activated_skill.value * ratio;
                  skill_score += activated_skill.value * ratio;
                } else if (activated_skill.type === "回復") {
                  var ratio = 0;
                  for (var SIS of activated_SIS) {
                    if (/ヒール/.test(SIS)) ratio = 480;
                  }
                  score += activated_skill.value * ratio;
                  skill_score += activated_skill.value * ratio;
                } else if (activated_skill.type === "判定") {
                  end_trick.push(current_time + activated_skill.term);
                  end_trick.sort(function(a, b) {
                    return b - a;
                  });
                } else if (activated_skill.type === "パーフェクト") {
                  var end_time = (perfect_tap_queues[i].length > 0 ? perfect_tap_queues[i][0].end_time : current_time) + activated_skill.term;
                  perfect_tap_queues[i].push({
                    "end_time": end_time,
                    "value": activated_skill.value,
                  });
                } else if (activated_skill.type === "パラアップ") {
                  var end_time = (param_up_queues[i].length > 0 ? param_up_queues[i][0].end_time : current_time) + activated_skill.term;
                  param_up_queues[i].push({
                    "end_time": end_time,
                    "value": activated_skill.value,
                  });
                } else if (activated_skill.type === "FEVER") {
                  var end_time = (combo_fever_queues[i].length > 0 ? combo_fever_queues[i][0].end_time : current_time) + activated_skill.term;
                  combo_fever_queues[i].push({
                    "end_time": end_time,
                    "value": activated_skill.value,
                  });
                } else if (activated_skill.type === "特技") {
                  var end_time = (skill_prob_queue.length > 0 ? skill_prob_queue[skill_prob_queue.length - 1].end_time : current_time) + activated_skill.term;
                  skill_prob_queue.push({
                    "end_time": end_time,
                    "value": (1 + 0.01 * activated_skill.value),
                  });
                } else if (activated_skill.type === "ブースト") {
                  skill_boost = activated_skill.value;
                }

                last_skill = activated_skill;
                last_SIS = activated_SIS;
              }
            }
          }

          var is_updated = true;
          while (is_updated) {
            is_updated = false;
            for (var i = 0; i < deck.length; ++i) {
              var card = deck[i];
              var skill_required = card.skill.stats_list[card.skill_level - 1][3];
              if (card.skill.condition === "スコア" && score - score_consumed[i] >= skill_required) {
                score_consumed[i] += skill_required;
                // TODO: handle new skill per time (not implemented as is 2017/11/05)
                var skill = {};
                skill.type = card.skill.type;
                skill.prob = card.skill.stats_list[card.skill_level - 1][0];
                var max_skill_level = card.skill.stats_list.length;
                var current_skill_level = Math.min(max_skill_level, card.skill_level + skill_boost);
                skill.value = card.skill.stats_list[current_skill_level - 1][1];
                skill.term = card.skill.stats_list[current_skill_level - 1][2];
                skill.required = card.skill.stats_list[card.skill_level - 1][3];

                var prob = skill.prob * prob_bonus;
                if (skill_prob_queue.length > 0) {
                  prob *= skill_prob_queue[0].value;
                }
                if (self.success(prob)) {
                  skill_boost = 0;
                  for (var j = 0; j < deck.length; ++j) {
                    triggered_members[j].add(card.chara_name);
                  }
                  if (skill.type === "スコア") {
                    var ratio = 1;
                    for (var SIS of card.SIS) {
                      if (/チャーム/.test(SIS)) ratio = 2.5;
                    }
                    score += skill.value * ratio;
                    skill_score += skill.value * ratio;
                    is_updated = true;
                  }
                  last_skill = skill;
                  last_SIS = card.SIS;
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
        for (var card of self.deck) {
          if (card === undefined) return;
        }
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
        var bucket_size = self.ceil(width / bucket_num);

        var buckets = [];
        var labels = [];
        for (var i = 0; i < bucket_num; ++i) {
          buckets.push(0);
          labels.push(min + bucket_size * i);
        }
        for (var score of self.scores) {
          buckets[self.floor((score.total_score - min) / bucket_size)]++;
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

        self.drawGraph();
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

        self.drawGraph();
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
