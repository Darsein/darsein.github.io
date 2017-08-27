angular.module('unitScore')
  .component('slotView', {
    templateUrl: 'slot_view/slot_view.template.html',
    bindings: { member : '=' },
    controller: function slotController($scope, $rootScope, rangeFilter) {
      this.empty_slot = function() {
        var slot = $rootScope.user_data.own_card_list[this.member].slot;
        for (var SIS of $rootScope.user_data.own_card_list[this.member].SIS) {
          slot -= SIS.slot;
        }
        return slot;
      }
    },
  });
