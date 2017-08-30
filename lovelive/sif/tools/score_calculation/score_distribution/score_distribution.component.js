angular.module('unitScore')
  .component('scoreDistribution', {
    templateUrl: 'score_distribution/score_distribution.template.html',
    controller: function scoreDistributionController($scope, $rootScope) {
      // TODO: make music and bonus as user input
      this.music = {
        "type": "スマイル",
        "notes": 500,
        "group": "μ's",
        "time": 120
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

      this.getDeck = function() {
        var deck = new Array();
        for (var index of $rootScope.user_data.unit_members) {
          if (index<0) continue;
          var card_params = $rootScope.user_data.own_card_list[index];
          var card_info = $rootScope.card_data.card_list[card_params.id-1];

          var card = {};
          card["chara_name"] = card_info.chara_name;
          card["type"] = card_info.type;
          for (var type of $rootScope.card_data.types) {
            card[type] = card_info[type][card_params.level-1];
          }
          card["kizuna"] = card_params.kizuna;

          card["center_skill"] = card_info.center_skill;
          card["skill"] = card_info.skill;

          card["SIS"] = [];
          for (var SIS of card_params.SIS) {
            card["SIS"].push(SIS.name);
          }

          deck.push(card);
        }
        return deck;
      }

      this.centerSkillUp = function (val, card, LS) {
        var up = {"smile": 0, "pure": 0, "cool": 0};
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

        var trick = {"smile": 0, "pure": 0, "cool": 0};
        for (SIS of card.SIS) {
          var type = "all";
          if (/スマイル/.test(SIS)) type = "smile";
          if (/ピュア/.test(SIS)) type = "pure";
          if (/クール/.test(SIS)) type = "cool";

          if (/トリック/.test(SIS)) trick[type] = Math.ceil(Su[type] * 0.33);
        }

        for (var type of $rootScope.card_data.types) {
          Su[type] += Math.ceil(Sa[type] * 0.018) * aura_num[type];
          Su[type] += Math.ceil(Sa[type] * 0.024) * veil_num[type];
        }

        var LS_up = this.centerSkillUp(Su, card, LS);
        var FLS_up = this.centerSkillUp(Su, card, FLS);
        for (var type of $rootScope.card_data.types) {
          Su[type] += LS_up[type] + FLS_up[type];
        }

        return {
          "status": Su[card.type],
          "trick_status": trick[card.type],
        };
      };

      this.calcDeckStatus = function(deck, music, bonus) {
        if (deck.length != 9) return {
          "status": 0,
          "trick" : 0,
        };
        var aura_num = {"smile": 0, "pure": 0, "cool": 0};
        var veil_num = {"smile": 0, "pure": 0, "cool": 0};
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
          console.log(card_status)
          console.log(status, trick_status)
        }
        return {
          "status": status,
          "trick_status": trick_status,
        };
      };
    }
  });
