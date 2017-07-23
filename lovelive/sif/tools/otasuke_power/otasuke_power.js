angular.module('darsein-hp', ['ngMaterial', 'ngCookies', 'otasukeTable'])
  .service('OtasukePower', function($cookies, OtasukeTable) {

    var otasukePower = function() {
      this.otasukeTable = new OtasukeTable();

      this.unit = new Array(9);
      for (var i=0; i<9; i++) {
        var member = new Object();
        member.rare = $cookies.get('rare' + i) ? Number($cookies.get('rare' + i)) : 0;
        member.skill = $cookies.get('skill' + i) ? Number($cookies.get('skill' + i)) : 0;
        this.unit[i] = member;
      }
      this.calcOtasukePower();
    }

    var p = otasukePower.prototype;

    p.calcOtasukePower = function() {
      this.otasuke_value = 0;
      for (var i=0; i<9; i++) {
        this.otasuke_value += this.unit[i].rare * this.unit[i].skill;
      }
      this.otasuke_power = 0;
      while (this.otasukeTable.otasuke_threshold[this.otasuke_power] <= this.otasuke_value) {
        this.otasuke_power++;
      }
      this.next_required = this.otasukeTable.otasuke_threshold[this.otasuke_power] - this.otasuke_value;
      this.required_R = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["R"]);
      this.required_SR = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["SR"]);
      this.required_SSR = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["SSR"]);
      this.required_UR = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["UR"]);
    }

    p.setCookies = function() {
      var expire = new Date();
      expire.setMonth(expire.getMonth() + 3);

      for (var i=0; i<9; i++) {
        $cookies.put('rare' + i, this.unit[i].rare, {expires: expire});
        $cookies.put('skill' + i, this.unit[i].skill, {expires: expire});
      }
    }

    return otasukePower;
  })
  .controller('otasukePowerController', function($scope, $timeout, OtasukePower) {
    $scope.otasukePower = new OtasukePower();

    $scope.$watch('otasukePower.unit', function(newVal, oldVal) {
      $scope.otasukePower.calcOtasukePower();
      $scope.otasukePower.setCookies();
    }, true);
  });
