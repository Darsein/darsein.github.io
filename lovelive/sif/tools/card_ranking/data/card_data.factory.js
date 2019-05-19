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
        {
          name: "スマイルウィンク",
          imageName: "smile_wink",
          slot: 5,
        },
        {
          name: "ピュアウィンク",
          imageName: "pure_wink",
          slot: 5,
        },
        {
          name: "クールウィンク",
          imageName: "cool_wink",
          slot: 5,
        },
        {
          name: "スマイルトリル1年生",
          imageName: "smile_trill1",
          slot: 5,
        },
        {
          name: "ピュアトリル1年生",
          imageName: "pure_trill1",
          slot: 5,
        },
        {
          name: "クールトリル1年生",
          imageName: "cool_trill1",
          slot: 5,
        },
        {
          name: "スマイルトリル2年生",
          imageName: "smile_trill2",
          slot: 5,
        },
        {
          name: "ピュアトリル2年生",
          imageName: "pure_trill2",
          slot: 5,
        },
        {
          name: "クールトリル2年生",
          imageName: "cool_trill2",
          slot: 5,
        },
        {
          name: "スマイルトリル3年生",
          imageName: "smile_trill3",
          slot: 5,
        },
        {
          name: "ピュアトリル3年生",
          imageName: "pure_trill3",
          slot: 5,
        },
        {
          name: "クールトリル3年生",
          imageName: "cool_trill3",
          slot: 5,
        },
        {
          name: "スマイルブルーム",
          imageName: "smile_bloom",
          slot: 6,
        },
        {
          name: "ピュアブルーム",
          imageName: "pure_bloom",
          slot: 6,
        },
        {
          name: "クールブルーム",
          imageName: "cool_bloom",
          slot: 6,
        },
        {
          name: "スマイルパワフル",
          imageName: "smile_powerful",
          slot: 4,
        },
        {
          name: "クールプリマ",
          imageName: "cool_prima",
          slot: 4,
        },
        {
          name: "ピュアチャープ",
          imageName: "pure_chirp",
          slot: 4,
        },
        {
          name: "クールシューター",
          imageName: "cool_shooter",
          slot: 4,
        },
        {
          name: "スマイルキティ",
          imageName: "smile_kitty",
          slot: 4,
        },
        {
          name: "クールディーバ",
          imageName: "cool_diva",
          slot: 4,
        },
        {
          name: "ピュアフォーチュン",
          imageName: "pure_fortune",
          slot: 4,
        },
        {
          name: "ピュアフラワー",
          imageName: "pure_flower",
          slot: 4,
        },
        {
          name: "スマイルギャラクシー",
          imageName: "smile_galaxy",
          slot: 4,
        },
        {
          name: "スマイルオレンジ",
          imageName: "smile_orange",
          slot: 4,
        },
        {
          name: "クールブロッサム",
          imageName: "cool_blossom",
          slot: 4,
        },
        {
          name: "ピュアドルフィン",
          imageName: "pure_dolphin",
          slot: 4,
        },
        {
          name: "クールプラム",
          imageName: "cool_plum",
          slot: 4,
        },
        {
          name: "ピュアボヤージュ",
          imageName: "pure_voyage",
          slot: 4,
        },
        {
          name: "クールリトルデーモン",
          imageName: "cool_little_demon",
          slot: 4,
        },
        {
          name: "スマイルフューチャー",
          imageName: "smile_future",
          slot: 4,
        },
        {
          name: "スマイルシャイニー",
          imageName: "smile_shiny",
          slot: 4,
        },
        {
          name: "ピュアロリポップ",
          imageName: "pure_lolipop",
          slot: 4,
        },
        {
          name: "スマイルノネットμ's",
          imageName: "smile_nonet_muse",
          slot: 4,
        },
        {
          name: "ピュアノネットμ's",
          imageName: "pure_nonet_muse",
          slot: 4,
        },
        {
          name: "クールノネットμ's",
          imageName: "cool_nonet_muse",
          slot: 4,
        },
        {
          name: "スマイルノネットAqours",
          imageName: "smile_nonet_aqours",
          slot: 4,
        },
        {
          name: "ピュアノネットAqours",
          imageName: "pure_nonet_aqours",
          slot: 4,
        },
        {
          name: "クールノネットAqours",
          imageName: "cool_nonet_aqours",
          slot: 4,
        },
      ];

      // load card data
      self.brief_card_list = [];
      self.card_load_promise
        = $http.get('https://darsein.github.io/lovelive/sif/tools/score_calculation/json/cards/brief_card_list.json').then(function(response) {
            self.brief_card_list = response.data;
          });

      // get function for card data
      self.card_list = {};
      self.getCard = function(id) {
        if (self.card_list[id - 1]) {
          return Promise.resolve(self.card_list[id - 1]);
        } else {
          return $http.get('https://darsein.github.io/lovelive/sif/tools/score_calculation/json/cards/' + id + '.json').then(function(response) {
            return self.card_list[id - 1] = response.data;
          });
        }
      }
    }
    return cardData;
  });
