angular.module('darsein-hp', ['ngMaterial'])
  .controller('topPageController', function() {
    this.category = [{
        name: 'Profile',
        url: 'profile/index-ja.html'
      },
      {
        name: 'LoveLive',
        url: 'lovelive/'
      },
    ];
  });
