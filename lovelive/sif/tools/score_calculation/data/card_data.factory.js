angular.module('data')
  .factory('cardData', function($http) {
    var cardData = function() {
      var self = this;
      // card params
      self.normal_max_level_table = {
        "N": 30,
        "R": 40,
        "SR": 60,
        "SSR": 70,
        "UR": 80,
      };
      self.transformed_max_level_table = {
        "N": 40,
        "R": 60,
        "SR": 80,
        "SSR": 90,
        "UR": 100,
      };
      self.normal_max_kizuna_table = {
        "N": 25,
        "R": 100,
        "SR": 250,
        "SSR": 375,
        "UR": 500,
      };
      self.transformed_max_kizuna_table = {
        "N": 50,
        "R": 200,
        "SR": 500,
        "SSR": 750,
        "UR": 1000,
      };
      self.min_slot_table = {
        "N": 0,
        "R": 1,
        "SR": 2,
        "SSR": 3,
        "UR": 4,
      };
      self.max_slot_table = {
        "N": 1,
        "R": 2,
        "SR": 4,
        "SSR": 6,
        "UR": 8,
      };

      self.types = ["smile", "pure", "cool"];
      self.rarities = ["N", "R", "SR", "SSR", "UR"];

      self.chara_info = {};
      self.chara_info["高坂穂乃果"] = {
        group: "μ's",
        grade: "second-year",
        unit: "Printemps",
      };
      self.chara_info["絢瀬絵里"] = {
        group: "μ's",
        grade: "third-year",
        unit: "BiBi",
      };
      self.chara_info["南ことり"] = {
        group: "μ's",
        grade: "second-year",
        unit: "Printemps",
      };
      self.chara_info["園田海未"] = {
        group: "μ's",
        grade: "second-year",
        unit: "lily white",
      };
      self.chara_info["星空凛"] = {
        group: "μ's",
        grade: "first-year",
        unit: "lily white",
      };
      self.chara_info["西木野真姫"] = {
        group: "μ's",
        grade: "first-year",
        unit: "BiBi",
      };
      self.chara_info["東條希"] = {
        group: "μ's",
        grade: "third-year",
        unit: "lily white",
      };
      self.chara_info["小泉花陽"] = {
        group: "μ's",
        grade: "first-year",
        unit: "Printemps",
      };
      self.chara_info["矢澤にこ"] = {
        group: "μ's",
        grade: "third-year",
        unit: "BiBi",
      };

      self.chara_info["高海千歌"] = {
        group: "Aqours",
        grade: "second-year",
        unit: "CYaRon！",
      };
      self.chara_info["桜内梨子"] = {
        group: "Aqours",
        grade: "second-year",
        unit: "Guilty Kiss",
      };
      self.chara_info["松浦果南"] = {
        group: "Aqours",
        grade: "third-year",
        unit: "AZALEA",
      };
      self.chara_info["黒澤ダイヤ"] = {
        group: "Aqours",
        grade: "third-year",
        unit: "AZALEA",
      };
      self.chara_info["渡辺曜"] = {
        group: "Aqours",
        grade: "second-year",
        unit: "CYaRon！",
      };
      self.chara_info["津島善子"] = {
        group: "Aqours",
        grade: "first-year",
        unit: "Guilty Kiss",
      };
      self.chara_info["国木田花丸"] = {
        group: "Aqours",
        grade: "first-year",
        unit: "AZALEA",
      };
      self.chara_info["小原鞠莉"] = {
        group: "Aqours",
        grade: "third-year",
        unit: "Guilty Kiss",
      };
      self.chara_info["黒澤ルビィ"] = {
        group: "Aqours",
        grade: "first-year",
        unit: "CYaRon！",
      };

      // load card data
      self.card_list = [];
      for (var i = 1; i <= 100; ++i) {
        $http.get('json/cards/' + i + '.json').then(function(response) {
          var card = response.data;
          self.card_list.push(card);
        });
      }

      // set SIS info
      self.SIS_list = [{
          name: "スマイルキッス",
          imageName: "smile_kiss",
          slot: 1,
        },
        {
          name: "スマイルパフューム",
          imageName: "smile_perfume",
          slot: 2,
        },
        {
          name: "スマイルリング1年生",
          imageName: "smile_ring1",
          slot: 2,
        },
        {
          name: "スマイルリング2年生",
          imageName: "smile_ring2",
          slot: 2,
        },
        {
          name: "スマイルリング3年生",
          imageName: "smile_ring3",
          slot: 2,
        },
        {
          name: "スマイルクロス1年生",
          imageName: "smile_cross1",
          slot: 3,
        },
        {
          name: "スマイルクロス2年生",
          imageName: "smile_cross2",
          slot: 3,
        },
        {
          name: "スマイルクロス3年生",
          imageName: "smile_cross3",
          slot: 3,
        },
        {
          name: "スマイルオーラ",
          imageName: "smile_aura",
          slot: 3,
        },
        {
          name: "スマイルヴェール",
          imageName: "smile_veil",
          slot: 4,
        },
        {
          name: "プリンセスチャーム",
          imageName: "smile_score",
          slot: 4,
        },
        {
          name: "プリンセスヒール",
          imageName: "smile_heal",
          slot: 4,
        },
        {
          name: "プリンセストリック",
          imageName: "smile_trick",
          slot: 4,
        },
        {
          name: "ピュアキッス",
          imageName: "pure_kiss",
          slot: 1,
        },
        {
          name: "ピュアパフューム",
          imageName: "pure_perfume",
          slot: 2,
        },
        {
          name: "ピュアリング1年生",
          imageName: "pure_ring1",
          slot: 2,
        },
        {
          name: "ピュアリング2年生",
          imageName: "pure_ring2",
          slot: 2,
        },
        {
          name: "ピュアリング3年生",
          imageName: "pure_ring3",
          slot: 2,
        },
        {
          name: "ピュアクロス1年生",
          imageName: "pure_cross1",
          slot: 3,
        },
        {
          name: "ピュアクロス2年生",
          imageName: "pure_cross2",
          slot: 3,
        },
        {
          name: "ピュアクロス3年生",
          imageName: "pure_cross3",
          slot: 3,
        },
        {
          name: "ピュアオーラ",
          imageName: "pure_aura",
          slot: 3,
        },
        {
          name: "ピュアヴェール",
          imageName: "pure_veil",
          slot: 4,
        },
        {
          name: "エンジェルチャーム",
          imageName: "pure_score",
          slot: 4,
        },
        {
          name: "エンジェルヒール",
          imageName: "pure_heal",
          slot: 4,
        },
        {
          name: "エンジェルトリック",
          imageName: "pure_trick",
          slot: 4,
        },
        {
          name: "クールキッス",
          imageName: "cool_kiss",
          slot: 1,
        },
        {
          name: "クールパフューム",
          imageName: "cool_perfume",
          slot: 2,
        },
        {
          name: "クールリング1年生",
          imageName: "cool_ring1",
          slot: 2,
        },
        {
          name: "クールリング2年生",
          imageName: "cool_ring2",
          slot: 2,
        },
        {
          name: "クールリング3年生",
          imageName: "cool_ring3",
          slot: 2,
        },
        {
          name: "クールクロス1年生",
          imageName: "cool_cross1",
          slot: 3,
        },
        {
          name: "クールクロス2年生",
          imageName: "cool_cross2",
          slot: 3,
        },
        {
          name: "クールクロス3年生",
          imageName: "cool_cross3",
          slot: 3,
        },
        {
          name: "クールオーラ",
          imageName: "cool_aura",
          slot: 3,
        },
        {
          name: "クールヴェール",
          imageName: "cool_veil",
          slot: 4,
        },
        {
          name: "エンプレスチャーム",
          imageName: "cool_score",
          slot: 4,
        },
        {
          name: "エンプレスヒール",
          imageName: "cool_heal",
          slot: 4,
        },
        {
          name: "エンプレストリック",
          imageName: "cool_trick",
          slot: 4,
        },
      ];
    }
    return cardData;
  });
