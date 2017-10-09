angular.module('unitScore')
  .component('slotView', {
    templateUrl: 'slot_view/slot_view.template.html',
    bindings: {
      index: '='
    },
    controller: function slotController($scope, $rootScope, rangeFilter) {
      this.member = $rootScope.user_data.unit_members[this.index];
      this.card_params = undefined;
      this.empty_slot = 0;

      this.updateCardParams = function() {
        this.member = $rootScope.user_data.unit_members[this.index];
        this.card_params = $rootScope.user_data.own_card_list[this.member];
        this.empty_slot = this.card_params.slot;
        for (var SIS of this.card_params.SIS) {
          this.empty_slot -= SIS.slot;
        }
        this.updateAvailableSIS();
      };

      this.available_SIS = [];
      var self = this;
      this.updateAvailableSIS = function() {
        $rootScope.card_data.getCard(self.card_params.id).then(function(card) {
          self.available_SIS = [];
          for (var SIS of $rootScope.card_data.SIS_list) {
            if (self.empty_slot < SIS.slot) {
              continue;
            }
            if (self.card_params.SIS.indexOf(SIS) >= 0) {
              continue;
            }

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
              if (card.type !== "smile") {
                continue;
              }
            } else if (SIS.name.slice(0, 5) === "エンジェル") {
              if (card.type !== "pure") {
                continue;
              }
            } else if (SIS.name.slice(0, 5) === "エンプレス") {
              if (card.type !== "cool") {
                continue;
              }
            }
            if (SIS.name.slice(-4) === "チャーム") {
              if (card.skill.type !== "スコア") {
                continue;
              }
            } else if (SIS.name.slice(-3) === "ヒール") {
              if (card.skill.type !== "回復") {
                continue;
              }
            }
            self.available_SIS.push(SIS);
          }
        });
      };

      this.setSIS = function(SIS) {
        this.card_params.SIS.push(SIS);
        this.empty_slot -= SIS.slot;
        this.updateAvailableSIS();
      };

      this.removeSIS = function(SIS) {
        var index = this.card_params.SIS.indexOf(SIS);
        if (index >= 0) {
          this.card_params.SIS.splice(index, 1);
          this.empty_slot += SIS.slot;
          this.updateAvailableSIS();
        }
      };

      $rootScope.$watch('user_data.unit_members', function(newVal, oldVal) {
        self.updateCardParams();
      }, true);
    },
  });
