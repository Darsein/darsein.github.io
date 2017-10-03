angular.module('darsein-hp', ['ngMaterial', "ngMessages"])
  .service('BoxExp', function() {
    var box_exp = function() {
      this.n = 200;
      this.k = 200;
      this.r = 2;
      this.K = 200;
      this.R = 2;
      this.calcExpectedValue();
    }

    var p = box_exp.prototype;

    p.calcExpectedValue = function() {
      var cur;
      var nxt = Array.from(new Array(this.R + 1), () => new Array(this.K + 1).fill(0))
      nxt[0][0] = 1;

      for (var i = 0; i < this.n; ++i) {
        cur = nxt;
        // TODO: reduce redundant memory usage: nxt[r][k] for k < r is not used.
        var nxt = Array.from(new Array(this.R + 1), () => new Array(this.K + 1).fill(0));
        for (var r = this.R; r >= 0; --r) {
          for (var k = this.K; k >= r; --k) {
            if (r != 0) {
              nxt[r][k] = (cur[r][k - 1] * (k - r) + (cur[r - 1][k - 1] + 1) * r) / k;
            }
            if (r < this.R) {
              nxt[r][k] = Math.max(nxt[r][k], nxt[this.R][this.K]);
            }
          }
        }
      }
      this.expected_value = nxt[this.r][this.k];
      this.reset_expected_value = nxt[this.R][this.K];
      this.draw_expected_value = (cur[this.r][this.k - 1] * (this.k - this.r) + (cur[this.r - 1][this.k - 1] + 1) * this.r) / this.k;
    }

    return box_exp;
  })
  .controller('boxExpectedValueController', function($scope, $timeout, BoxExp) {
    $scope.box_exp = new BoxExp();

    $scope.$watchGroup([
      'box_exp.n',
      'box_exp.k',
      'box_exp.r',
      'box_exp.K',
      'box_exp.R',
    ], function(newVal, oldVal) {
      $scope.box_exp.calcExpectedValue();
    });
  });
