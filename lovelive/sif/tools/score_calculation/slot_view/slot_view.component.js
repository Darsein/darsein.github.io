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
              if ($rootScope.card_data.chara_info[card.chara_name] == undefined ||
                  $rootScope.card_data.chara_info[card.chara_name].grade !== "first-year") {
                continue;
              }
            } else if (SIS.imageName.slice(-1) === "2") {
              if ($rootScope.card_data.chara_info[card.chara_name] == undefined ||
                  $rootScope.card_data.chara_info[card.chara_name].grade !== "second-year") {
                continue;
              }
            } else if (SIS.imageName.slice(-1) === "3") {
              if ($rootScope.card_data.chara_info[card.chara_name] == undefined ||
                  $rootScope.card_data.chara_info[card.chara_name].grade !== "third-year") {
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
            if (SIS.name.slice(-4) === "パワフル") {
              if (card.chara_name !== "高坂穂乃果") {
                continue;
              }
            } else if (SIS.name.slice(-3) === "プリマ") {
              if (card.chara_name !== "絢瀬絵里") {
                continue;
              }
            } else if (SIS.name.slice(-4) === "チャープ") {
              if (card.chara_name !== "南ことり") {
                continue;
              }
            } else if (SIS.name.slice(-5) === "シューター") {
              if (card.chara_name !== "園田海未") {
                continue;
              }
            } else if (SIS.name.slice(-3) === "キティ") {
              if (card.chara_name !== "星空凛") {
                continue;
              }
            } else if (SIS.name.slice(-4) === "ディーバ") {
              if (card.chara_name !== "西木野真姫") {
                continue;
              }
            } else if (SIS.name.slice(-6) === "フォーチュン") {
              if (card.chara_name !== "東條希") {
                continue;
              }
            } else if (SIS.name.slice(-4) === "フラワー") {
              if (card.chara_name !== "小泉花陽") {
                continue;
              }
            } else if (SIS.name.slice(-6) === "ギャラクシー") {
              if (card.chara_name !== "矢澤にこ") {
                continue;
              }
            }
            if (SIS.name.slice(-4) === "オレンジ") {
              if (card.chara_name !== "高海千歌") {
                continue;
              }
            } else if (SIS.name.slice(-5) === "ブロッサム") {
              if (card.chara_name !== "桜内梨子") {
                continue;
              }
            } else if (SIS.name.slice(-5) === "ドルフィン") {
              if (card.chara_name !== "松浦果南") {
                continue;
              }
            } else if (SIS.name.slice(-3) === "プラム") {
              if (card.chara_name !== "黒澤ダイヤ") {
                continue;
              }
            } else if (SIS.name.slice(-5) === "ボヤージュ") {
              if (card.chara_name !== "渡辺曜") {
                continue;
              }
            } else if (SIS.name.slice(-7) === "リトルデーモン") {
              if (card.chara_name !== "津島善子") {
                continue;
              }
            } else if (SIS.name.slice(-6) === "フューチャー") {
              if (card.chara_name !== "国木田花丸") {
                continue;
              }
            } else if (SIS.name.slice(-5) === "シャイニー") {
              if (card.chara_name !== "小原鞠莉") {
                continue;
              }
            } else if (SIS.name.slice(-5) === "ロリポップ") {
              if (card.chara_name !== "黒澤ルビィ") {
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
      $rootScope.$watch('user_data.own_card_list', function(newVal, oldVal) {
        self.updateCardParams();
      }, true);
    },
  });
