angular.module('unitScore')
  .component('slotView', {
    templateUrl: 'slot_view/slot_view.template.html',
    bindings: { member : '=' },
    controller: function slotController($scope, $rootScope, rangeFilter) {
      this.card_params = $rootScope.user_data.own_card_list[this.member];

      this.emptySlot = function() {
        var slot = this.card_params.slot;
        for (var SIS of this.card_params.SIS) {
          slot -= SIS.slot;
        }
        return slot;
      };

      this.availableSIS = function() {
        var available_SIS = [];
        var card = $rootScope.card_data.card_list[this.card_params.id-1];
        for (var SIS of $rootScope.card_data.SIS_list) {
          if (SIS.imageName.slice(-1) === "1") {
            if ($rootScope.card_data.chara_info[card.chara_name].grade !== "first-year") {
              continue;
            }
          } else if (SIS.imageName.slice(-1) === "2") {
            if ($rootScope.card_data.chara_info[card.chara_name].grade !== "second-year") {
              continue;
            }
          } else if (SIS.imageName.slice(-1) === "3") {
            if ($rootScope.card_data.chara_info[card.chara_name].grade !== "third-year") {
              continue;
            }
          }
          if (SIS.name.slice(0, 5) === "プリンセス") {
            if (card.type !== "スマイル") {
              continue;
            }
          } else if (SIS.name.slice(0, 5) === "エンジェル") {
            if (card.type !== "ピュア") {
              continue;
            }
          } else if (SIS.name.slice(0, 5) === "エンプレス") {
            if (card.type !== "クール") {
              continue;
            }
          }
          if (SIS.name.slice(-4) === "チャーム") {
            if (card.skill_type !== "スコア") {
              continue;
            }
          } else if (SIS.name.slice(-3) === "ヒール") {
            if (card.skill_type !== "回復") {
              continue;
            }
          }
          if (this.emptySlot() < SIS.slot) {
            continue;
          }
          if (this.card_params.SIS.indexOf(SIS) >= 0) {
            continue;
          }
          available_SIS.push(SIS);
        }
        return available_SIS;
      };

      this.setSIS = function(SIS) {
        this.card_params.SIS.push(SIS);
      };

      this.removeSIS = function(SIS) {
        var index = this.card_params.SIS.indexOf(SIS);
        if (index >= 0) this.card_params.SIS.splice(index, 1);
      };
    },
  });
