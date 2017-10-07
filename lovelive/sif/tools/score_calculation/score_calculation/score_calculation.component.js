angular.module('unitScore')
  .component('scoreCalc', {
    templateUrl: 'score_calculation/score_calculation.template.html',
    controller: function scoreCalculationController($rootScope, $cookies, cardData, userData) {
      $rootScope.card_data = new cardData();
      $rootScope.user_data =
        $cookies.get('user_data') ? JSON.parse($cookies.get('user_data')) : new userData();

      // for filtering
      $rootScope.card_filter = function(card, index) {
        if (card.role === "サポート") return false;
        for (var type of $rootScope.user_data.filtering_condition.type) {
          if (card.type === type) return false;
        }
        for (var rarity of $rootScope.user_data.filtering_condition.rarity) {
          if (card.rarity === rarity) return false;
        }
        return true;
      };

      $rootScope.setTypeCondition = function(ev, type) {
        var type_ja = (type === "smile") ? "スマイル" : (type === "pure") ? "ピュア" : "クール";
        var index = $rootScope.user_data.filtering_condition.type.indexOf(type_ja);
        if (index >= 0) {
          $rootScope.user_data.filtering_condition.type.splice(index, 1);
        } else {
          $rootScope.user_data.filtering_condition.type.push(type_ja);
        }
      };

      $rootScope.hasTypeCondition = function(type) {
        var type_ja = (type === "smile") ? "スマイル" : (type === "pure") ? "ピュア" : "クール";
        return $rootScope.user_data.filtering_condition.type.indexOf(type_ja) >= 0;
      };

      $rootScope.setRarityCondition = function(ev, rarity) {
        var index = $rootScope.user_data.filtering_condition.rarity.indexOf(rarity);
        if (index >= 0) {
          $rootScope.user_data.filtering_condition.rarity.splice(index, 1);
        } else {
          $rootScope.user_data.filtering_condition.rarity.push(rarity);
        }
      };

      $rootScope.hasRarityCondition = function(rarity) {
        return $rootScope.user_data.filtering_condition.rarity.indexOf(rarity) >= 0;
      };
    }
  });
