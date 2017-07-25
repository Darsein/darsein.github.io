angular.module('darsein-hp', ['ngMaterial', 'ngCookies', 'otasukeTable'])
  .service('OtasukePower', function($cookies, OtasukeTable, SkillLevelTable) {

    var otasukePower = function() {
      this.otasukeTable = new OtasukeTable();
      this.skillLevelTable = new SkillLevelTable();

      this.unit = new Array(9);
      for (var i=0; i<9; i++) {
        var member = new Object();
        member.name = $cookies.get('name' + i) ? $cookies.get('name' + i) : "部員" + (i+1);
        member.rare = $cookies.get('rare' + i) ? Number($cookies.get('rare' + i)) : 200;
        member.skill = $cookies.get('skill' + i) ? Number($cookies.get('skill' + i)) : 1;
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
      while (this.otasuke_power < 10 &&
             this.otasukeTable.otasuke_threshold[this.otasuke_power] <= this.otasuke_value) {
        this.otasuke_power++;
      }

      this.next_required = this.otasukeTable.otasuke_threshold[this.otasuke_power] - this.otasuke_value;
      this.required_R = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["R"]);
      this.required_SR = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["SR"]);
      this.required_SSR = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["SSR"]);
      this.required_UR = Math.ceil(this.next_required / this.otasukeTable.rare_ratio["UR"]);

      if (this.otasuke_power !== 10) {
        this.calcRequiredSkillExp(this.next_required);
      }
    }

    p.calcRequiredSkillExp = function(required_otasuke_value) {
      var cur = Array(required_otasuke_value+1);
      cur[0] = [0];
      for (var i = 0; i < 9; ++i) {
        this.unit[i].next_level = this.unit[i].skill;
        this.unit[i].next_exp = 0;

        for (var lev = this.unit[i].skill; lev <= 7; ++lev) {
          var required_exp = this.skillLevelTable.skill_level_table[this.unit[i].rare][lev];
          var gain_value = this.unit[i].rare;
          if (gain_value == 0) continue;

          for (var j = required_otasuke_value; j >= 0; --j) {
            if (!cur[j]) continue;
            var nxt_value = Math.min(j+gain_value, required_otasuke_value);

            if (!cur[nxt_value] ||
                cur[nxt_value][0] > cur[j][0] + required_exp) {
                  cur[nxt_value] = [];
                  for (var x = 0, len = cur[j].length; x < len; ++x) {
                    cur[nxt_value].push(cur[j][x]);
                  }
                  cur[nxt_value][0] += required_exp;
                  cur[nxt_value].push(i);
                }
          }
        }
      }

      if (cur[required_otasuke_value]) {
        this.required_skill_exp = cur[required_otasuke_value][0];
        for (var i = 1, len = cur[required_otasuke_value].length; i < len; ++i) {
          var id = cur[required_otasuke_value][i];
          this.unit[id].next_exp += this.skillLevelTable.skill_level_table[this.unit[id].rare][this.unit[id].next_level];
          this.unit[id].next_level++;
        }
      } else {
        this.required_skill_exp = undefined;
      }
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
      for (var i = 0; i < 9; ++i) {
        if (oldVal[i].rare == 0) $scope.otasukePower.unit[i].skill = 1;
        if (newVal[i].rare == 0) $scope.otasukePower.unit[i].skill = 0;
      }
      $scope.otasukePower.calcOtasukePower();
      $scope.otasukePower.setCookies();
    }, true);

  });
