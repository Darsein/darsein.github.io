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

        // (required points, categories, amount)
        this.event_rewards = [
          {required_points: 20, category: "G", number: 5000},
          {required_points: 50, category: "友情pt", number: 50},
          {required_points: 100, category: "G", number: 5500},
          {required_points: 250, category: "友情pt", number: 100},
          {required_points: 500, category: "ラブカストーン", number: 1},
          {required_points: 750, category: "G", number: 6000},
          {required_points: 1000, category: "友情pt", number: 150},
          {required_points: 1200, category: "G", number: 6500},
          {required_points: 1500, category: "友情pt", number: 200},
          {required_points: 2000, category: "G", number: 7000},
          {required_points: 2500, category: "ラブカストーン", number: 1},
          {required_points: 3000, category: "友情pt", number: 250},
          {required_points: 3500, category: "G", number: 7500},
          {required_points: 4000, category: "友情pt", number: 300},
          {required_points: 4500, category: "N部員", number: 1},
          {required_points: 5000, category: "ラブカストーン", number: 1},
          {required_points: 5750, category: "友情pt", number: 350},
          {required_points: 6500, category: "G", number: 10000},
          {required_points: 7250, category: "友情pt", number: 400},
          {required_points: 8000, category: "G", number: 12500},
          {required_points: 8750, category: "友情pt", number: 450},
          {required_points: 9500, category: "G", number: 15000},
          {required_points: 11000, category: "ラブカストーン", number: 1},
          {required_points: 12500, category: "Rアニマル", number: 1},
          {required_points: 15000, category: "友情pt", number: 500},
          {required_points: 17500, category: "R先生", number: 1},
          {required_points: 20000, category: "ラブカストーン", number: 1},
          {required_points: 22500, category: "友情pt", number: 550},
          {required_points: 25000, category: "SR部員", number: 1},
          {required_points: 27500, category: "友情pt", number: 600},
          {required_points: 30000, category: "G", number: 20000},
          {required_points: 32500, category: "ラブカストーン", number: 2},
          {required_points: 35000, category: "友情pt", number: 700},
          {required_points: 37500, category: "G", number: 25000},
          {required_points: 40000, category: "友情pt", number: 800},
          {required_points: 42500, category: "R先生", number: 1},
          {required_points: 45000, category: "G", number: 30000},
          {required_points: 47500, category: "ラブカストーン", number: 2},
          {required_points: 50000, category: "友情pt", number: 900},
          {required_points: 52500, category: "G", number: 40000},
          {required_points: 55000, category: "友情pt", number: 1000},
          {required_points: 57500, category: "G", number: 50000},
          {required_points: 60000, category: "SR部員", number: 1},
          {required_points: 62500, category: "ラブカストーン", number: 2},
          {required_points: 65000, category: "友情pt", number: 1100},
          {required_points: 67500, category: "G", number: 75000},
          {required_points: 70000, category: "友情pt", number: 1200},
          {required_points: 75000, category: "勧誘チケット", number: 1},
          {required_points: 80000, category: "ラブカストーン", number: 2},
          {required_points: 90000, category: "友情pt", number: 1300},
          {required_points: 100000, category: "SR部員", number: 1},
          {required_points: 110000, category: "ラブカストーン", number: 3},
          {required_points: 120000, category: "友情pt", number: 1400},
          {required_points: 130000, category: "勧誘チケット", number: 1},
          {required_points: 140000, category: "友情pt", number: 1500},
          {required_points: 150000, category: "G", number: 100000},
          {required_points: 160000, category: "ラブカストーン", number: 4},
        ]
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
        this.get_points["hard"] = [
          [261, 254, 246, 241, 237],
          [249, 242, 235, 230, 226],
          [237, 231, 224, 220, 215],
          [226, 219, 213, 209, 204]
        ];
        this.get_points["expert"] = [
          [565, 549, 518, 508, 498],
          [540, 525, 495, 485, 475],
          [509, 495, 467, 458, 448],
          [484, 470, 444, 435, 426]
        ];

        // (required points, categories, amount)
        this.event_rewards = [
          {required_points: 10, category: "G", number: 5000},
          {required_points: 50, category: "友情pt", number: 50},
          {required_points: 100, category: "G", number: 5500},
          {required_points: 150, category: "友情pt", number: 100},
          {required_points: 200, category: "ラブカストーン", number: 1},
          {required_points: 300, category: "G", number: 6000},
          {required_points: 450, category: "友情pt", number: 150},
          {required_points: 600, category: "G", number: 6500},
          {required_points: 850, category: "友情pt", number: 200},
          {required_points: 1000, category: "G", number: 7000},
          {required_points: 1200, category: "ラブカストーン", number: 1},
          {required_points: 1400, category: "友情pt", number: 250},
          {required_points: 1600, category: "G", number: 7500},
          {required_points: 1800, category: "友情pt", number: 300},
          {required_points: 2000, category: "N部員", number: 1},
          {required_points: 2250, category: "ラブカストーン", number: 1},
          {required_points: 2500, category: "友情pt", number: 350},
          {required_points: 2750, category: "G", number: 10000},
          {required_points: 3000, category: "友情pt", number: 400},
          {required_points: 3500, category: "G", number: 12500},
          {required_points: 4000, category: "友情pt", number: 450},
          {required_points: 4500, category: "G", number: 15000},
          {required_points: 5000, category: "ラブカストーン", number: 1},
          {required_points: 6000, category: "Rアニマル", number: 1},
          {required_points: 7000, category: "友情pt", number: 500},
          {required_points: 8000, category: "R先生", number: 1},
          {required_points: 9000, category: "ラブカストーン", number: 1},
          {required_points: 10000, category: "友情pt", number: 550},
          {required_points: 11000, category: "SR部員", number: 1},
          {required_points: 12000, category: "友情pt", number: 600},
          {required_points: 13000, category: "G", number: 20000},
          {required_points: 14000, category: "ラブカストーン", number: 2},
          {required_points: 15000, category: "友情pt", number: 700},
          {required_points: 16000, category: "G", number: 25000},
          {required_points: 17000, category: "友情pt", number: 800},
          {required_points: 18000, category: "R先生", number: 1},
          {required_points: 19000, category: "G", number: 30000},
          {required_points: 20000, category: "ラブカストーン", number: 2},
          {required_points: 21000, category: "友情pt", number: 900},
          {required_points: 22000, category: "G", number: 40000},
          {required_points: 23000, category: "友情pt", number: 1000},
          {required_points: 24000, category: "G", number: 50000},
          {required_points: 25000, category: "SR部員", number: 1},
          {required_points: 26500, category: "ラブカストーン", number: 2},
          {required_points: 28000, category: "友情pt", number: 1100},
          {required_points: 30000, category: "G", number: 75000},
          {required_points: 32000, category: "友情pt", number: 1200},
          {required_points: 34000, category: "勧誘チケット", number: 1},
          {required_points: 36000, category: "ラブカストーン", number: 2},
          {required_points: 38000, category: "友情pt", number: 1300},
          {required_points: 40000, category: "SR部員", number: 1},
          {required_points: 42500, category: "ラブカストーン", number: 3},
          {required_points: 45000, category: "友情pt", number: 1400},
          {required_points: 50000, category: "勧誘チケット", number: 1},
          {required_points: 55000, category: "友情pt", number: 1500},
          {required_points: 60000, category: "G", number: 100000},
          {required_points: 65000, category: "ラブカストーン", number: 4},        ]
      }
      return macaron;
    });
