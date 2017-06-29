angular.module('points', [])
  .service("ScoreMatch",
  function() {
    var scoreMatch = function() {
      this.required_LP = {};
      this.required_LP["easy"] = 5;
      this.required_LP["normal"] = 10;
      this.required_LP["hard"] = 15;
      this.required_LP["expert"] = 25;
      this.required_LP["technical"] = 25;

      this.exp = {};
      this.exp["easy"] = 12;
      this.exp["normal"] = 26;
      this.exp["hard"] = 46;
      this.exp["expert"] = 83;
      this.exp["technical"] = 83;

      this.base_points = {};
      this.base_points["easy"] = 42;
      this.base_points["normal"] = 100;
      this.base_points["hard"] = 177;
      this.base_points["expert"] = 357;
      this.base_points["technical"] = 357;
    }
    return scoreMatch;
  });
