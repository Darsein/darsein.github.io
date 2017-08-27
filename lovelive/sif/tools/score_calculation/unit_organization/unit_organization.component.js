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
            console.log(answer);
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
    }
  });
