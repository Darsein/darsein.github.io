angular.module('unitScore')
  .component('slotView', {
    templateUrl: 'slot_view/slot_view.template.html',
    bindings: { member : '=' },
    controller: function slotController($scope, $rootScope, rangeFilter) {
      this.emptySlot = function() {
        var slot = $rootScope.user_data.own_card_list[this.member].slot;
        for (var SIS of $rootScope.user_data.own_card_list[this.member].SIS) {
          slot -= SIS.slot;
        }
        return slot;
      }

      this.availableSIS = function() {
        var available_SIS = [];
        var card_params = $rootScope.user_data.own_card_list[this.member];
        var card = $rootScope.card_data.card_list[card_params.id-1];
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
          } else if (SIS.name.slice(0, 5) === "プリンセス") {
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
          } else if (this.emptySlot() < SIS.slot) {
            continue;
          }
          available_SIS.push(SIS);
        }
        return available_SIS;
      }
    },
  });
