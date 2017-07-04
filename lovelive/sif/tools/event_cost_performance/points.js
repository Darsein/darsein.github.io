angular.module('points', [])
  .service("ScoreMatch",
  function() {
    var scoreMatch = function() {
      this.required_LP = {};
      this.required_LP["easy"] = 5;
      this.required_LP["normal"] = 10;
      this.required_LP["hard"] = 15;
      this.required_LP["expert"] = 25;

      this.exp = {};
      this.exp["easy"] = 12;
      this.exp["normal"] = 26;
      this.exp["hard"] = 46;
      this.exp["expert"] = 83;

      this.base_points = {};
      this.base_points["easy"] = 42;
      this.base_points["normal"] = 100;
      this.base_points["hard"] = 177;
      this.base_points["expert"] = 357;

      this.score_bonus = {};
      this.score_bonus[0] = 1.20;
      this.score_bonus[1] = 1.15;
      this.score_bonus[2] = 1.10;
      this.score_bonus[3] = 1.05;
      this.score_bonus[4] = 1.00;

      this.ranking_bonus = {};
      this.ranking_bonus[1] = 1.25;
      this.ranking_bonus[2] = 1.15;
      this.ranking_bonus[3] = 1.05;
      this.ranking_bonus[4] = 1.00;
    }
    return scoreMatch;
  })
  .service("Macaron",
  function() {
    var macaron = function() {
      this.required_LP = {};
      this.required_LP["easy"] = 5;
      this.required_LP["normal"] = 10;
      this.required_LP["hard"] = 15;
      this.required_LP["expert"] = 25;

      this.required_macarons = {};
      this.required_macarons["easy"] = 15;
      this.required_macarons["normal"] = 30;
      this.required_macarons["hard"] = 45;
      this.required_macarons["expert"] = 75;

      this.exp = {};
      this.exp["easy"] = 12;
      this.exp["normal"] = 26;
      this.exp["hard"] = 46;
      this.exp["expert"] = 83;

      this.get_macarons = {};
      this.get_macarons["easy"] = 5;
      this.get_macarons["normal"] = 10;
      this.get_macarons["hard"] = 16;
      this.get_macarons["expert"] = 27;

      this.get_points = {};
      this.get_points["hard"] = [ [261, 254, 246, 241, 237],
                                  [249, 242, 235, 230, 226],
                                  [237, 231, 224, 220, 215],
                                  [226, 219, 213, 209, 204] ];
      this.get_points["expert"] = [ [565, 549, 518, 508, 498],
                                     [540, 525, 495, 485, 475],
                                     [509, 495, 467, 458, 448],
                                     [484, 470, 444, 435, 426] ];
    }
    return macaron;
  });
