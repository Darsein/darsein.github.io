angular.module('data')
  .service('userData', function() {
    var userData = function() {
      // initialize ordering and filtering
      this.orderKey = "id";
      this.orderDirection = "+";

      this.filtering_condition = {
        type: [],
        rarity: ["N", "R"],
      }

      // initialize user's card list
      this.own_card_list = [];

      // temporal
      for (var i=0; i<9; ++i) {
        this.own_card_list.push(
         { id: 94, kizuna: 500, level: 80, slot: 4, skill_level: 1, SIS: [],}
        );
      }
      this.unit_members = [];
      for (var i=0; i<9; ++i) {
        // this.unit_members.push(-1);
        // temporal
        this.unit_members.push(i);
      }
    };
    return userData;
  });
