angular.module('otasukeTable', [])
  .service("OtasukeTable",
  function() {
    var otasukeTable = function() {
      this.rare_ratio = { N: 0, R: 25, SR: 55, SSR: 120, UR: 200 };
      this.otasuke_threshold = [0, 450, 900, 1350, 2250, 3150, 4650, 6900, 10050, 14250, 15000];
    }
    return otasukeTable;
  })
