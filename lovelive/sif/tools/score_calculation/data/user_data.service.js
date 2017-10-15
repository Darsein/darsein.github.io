angular.module('data')
  .service('userData', function() {
    var userData = function() {
      // initialize ordering and filtering
      this.orderKey = "id";
      this.orderDirection = "+";

      this.filtering_condition = {
        type: [],
        rarity: ["X", "N", "R"],
      }

      // initialize user's card list
      this.own_card_list = [];

      this.unit_members = [];
      for (var i = 0; i < 9; ++i) {
        this.unit_members.push(-1);
      }
    };
    return userData;
  });
