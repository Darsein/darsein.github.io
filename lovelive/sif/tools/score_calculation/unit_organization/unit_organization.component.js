angular.module('unitScore')
  .component('unitMake', {
    templateUrl: 'unit_organization/unit_organization.template.html',
    controller: function unitOrganizationController($scope, $rootScope, $mdDialog, $mdToast, $http, cardData, userData) {
      var self = this;
      // show dialog for member selection
      self.showMemberSelection = function(ev, position) {
        $mdDialog.show({
            locals: {},
            controller: MemberSelectionDialogController,
            templateUrl: 'member_selection/member_selection.template.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
          })
          .then(function(answer) {
            var index = $rootScope.user_data.unit_members.indexOf(answer);
            if (index >= 0) {
              $rootScope.user_data.unit_members[index] = $rootScope.user_data.unit_members[position];
            }
            $rootScope.user_data.unit_members[position] = answer;
          }, function() {});
      };

      function MemberSelectionDialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      };

      // show dialog for card modification
      self.showCardModification = function(ev, member) {
        $mdDialog.show({
          locals: {
            selected_member: member,
          },
          controller: CardModificationDialogController,
          templateUrl: 'card_registration/card_registration.template.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
        }).then(function(answer) {
          console.log(answer);
          answer.empty_slot = answer.slot;
          for (var SIS of answer.SIS) {
            answer.empty_slot -= SIS.slot;
          }
          while (answer.empty_slot < 0) {
            answer.empty_slot += answer.SIS[answer.SIS.length - 1].slot;
            answer.SIS.pop();
          }
          console.log(answer);
          $rootScope.user_data.own_card_list[member] = answer;
        });
      };

      function CardModificationDialogController($scope, $mdDialog, selected_member) {
        $scope.selected_card_params = Object.assign({}, $rootScope.user_data.own_card_list[selected_member]);
        if ($scope.selected_card_params.trans) {
          $scope.imageNormalStyle = {
            'filter': 'grayscale(100%)'
          };
          $scope.imageTransStyle = {
            'filter': 'grayscale(0%)'
          };
        } else {
          $scope.imageNormalStyle = {
            'filter': 'grayscale(0%)'
          };
          $scope.imageTransStyle = {
            'filter': 'grayscale(100%)'
          };
        }

        $rootScope.card_data.getCard($scope.selected_card_params.id).then(function(selected_card) {
          $scope.selected_card = selected_card;

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
        });

        $scope.onTransClick = function(isTrans) {
          $scope.selected_card_params.trans = isTrans;
          if ($scope.selected_card_params.trans) {
            $scope.selected_card_params.level = $scope.transformed_max_level;
            $scope.selected_card_params.kizuna = $scope.transformed_kizuna_level;
            $scope.imageNormalStyle = {
              'filter': 'grayscale(100%)'
            };
            $scope.imageTransStyle = {
              'filter': 'grayscale(0%)'
            };
          } else {
            $scope.selected_card_params.level = $scope.normal_max_level;
            $scope.selected_card_params.kizuna = $scope.normal_kizuna_level;
            $scope.imageNormalStyle = {
              'filter': 'grayscale(0%)'
            };
            $scope.imageTransStyle = {
              'filter': 'grayscale(100%)'
            };
          }
        };

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
