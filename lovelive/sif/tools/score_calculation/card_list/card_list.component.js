angular.module('unitScore')
  .component('cardList', {
    templateUrl: 'card_list/card_list.template.html',
    controller: function cardRegistrationController($scope, $rootScope, $mdDialog, $mdToast, $http) {
      var self = this;

      // show dialog for new card registration
      self.showCardRegistration = function(ev, card) {
        $mdDialog.show({
            locals: {
              selected_card: card
            },
            controller: CardRegistrationDialogController,
            templateUrl: 'card_registration/card_registration.template.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
          })
          .then(function(answer) {
            $mdToast.show(
              $mdToast.simple()
              .textContent($rootScope.card_data.card_list[answer.id - 1].chara_name + 'を登録しました')
              .position('bottom')
              .hideDelay(3000));
            $rootScope.user_data.own_card_list.push(answer);
          }, function() {});
      };

      function CardRegistrationDialogController($scope, $mdDialog, selected_card) {
        $scope.selected_card = selected_card;
        $scope.selected_card_params = {
          id: $scope.selected_card.id,
          level: $rootScope.card_data.normal_max_level_table[$scope.selected_card.rarity],
          slot: $rootScope.card_data.min_slot_table[$scope.selected_card.rarity],
          kizuna: $rootScope.card_data.normal_max_kizuna_table[$scope.selected_card.rarity],
          skill_level: 1,
          SIS: [],
        };
        $scope.normal_max_level = $rootScope.card_data.normal_max_level_table[$scope.selected_card.rarity];
        $scope.transformed_max_level = $rootScope.card_data.transformed_max_level_table[$scope.selected_card.rarity];
        $scope.normal_kizuna_level = $rootScope.card_data.normal_max_kizuna_table[$scope.selected_card.rarity];
        $scope.transformed_kizuna_level = $rootScope.card_data.transformed_max_kizuna_table[$scope.selected_card.rarity];
        $scope.min_slot = $rootScope.card_data.min_slot_table[$scope.selected_card.rarity];
        $scope.max_slot = $rootScope.card_data.max_slot_table[$scope.selected_card.rarity];
        $scope.slot_range = [];
        for (var i = $scope.min_slot; i <= $scope.max_slot; ++i) {
          $scope.slot_range.push(i);
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function() {
          $mdDialog.hide($scope.selected_card_params);
        };
      };
    }
  });
