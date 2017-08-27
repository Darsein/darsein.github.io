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

      self.muse = ["高坂穂乃果", "絢瀬絵里", "南ことり", "園田海未", "星空凛", "西木野真姫", "東條希", "小泉花陽", "矢澤にこ"];
      self.muse_1st = ["星空凛", "西木野真姫", "小泉花陽"];
      self.muse_2nd = ["高坂穂乃果", "南ことり", "園田海未"];
      self.muse_3rd = ["絢瀬絵里", "東條希", "矢澤にこ"];
      self.printemps = ["高坂穂乃果", "南ことり", "小泉花陽"];
      self.lilywhite = ["園田海未", "星空凛", "東條希"];
      self.bibi = ["絢瀬絵里", "西木野真姫", "矢澤にこ"];

      self.aqours = ["高海千歌", "桜内梨子", "松浦果南", "黒澤ダイヤ", "渡辺曜", "津島善子", "国木田花丸", "小原鞠莉", "黒澤ルビィ"];
      self.aqours_1st = ["津島善子", "国木田花丸", "黒澤ルビィ"];
      self.aqours_2nd = ["高海千歌", "桜内梨子", "渡辺曜"];
      self.aqours_3rd = ["松浦果南", "黒澤ダイヤ", "小原鞠莉"];
      self.cyaron = ["高海千歌", "渡辺曜", "黒澤ルビィ"];
      self.azalea = ["松浦果南", "黒澤ダイヤ", "国木田花丸"];
      self.guiltykiss = ["桜内梨子", "津島善子", "小原鞠莉"];

      self.card_list = [];
      for (var i = 1; i <= 100; ++i) {
        $http.get('json/cards/' + i + '.json').then(function(response) {
          var card = response.data;
          self.card_list.push(card);
        });
      }
    }
    return cardData;
  });
