angular.module('darsein-hp', ['ngMaterial', 'rank'])
  .service("ScoreMatch", function(Rank) {

    var scoreMatch = function() {
      this.rank = new Rank();
      this.current_rank = 100;
      this.current_exp = 0;
      this.current_LP = 0;
      this.current_points = 0;
      this.average_points = 500.00;
      this.target_points = 50000;
    }
    var p = scoreMatch.prototype;

    // unverified
    p.consumeLP = function() {
      var LP_per_play = 25; // TODO
      var exp_per_play = 83; // TODO
      while (true) {
        var play_num = Math.floor(this.final_LP / LP_per_play);
        if (play_num === 0) break;

        this.final_points += this.average_points * play_num;
        this.final_LP -= LP_per_play * play_num;
        this.final_exp += exp_per_play * play_num;
        this.final_play_num += play_num;
        while (this.next_exp <= this.final_exp) {
          this.final_exp -= this.next_exp;
          this.final_rank++;
          this.next_exp = this.rank.rankTable[this.final_rank];
          if (this.final_rank <= 300 && this.final_rank % 2 === 0) this.max_LP++;
          if (this.final_rank > 300 && this.final_rank % 3 === 0) this.max_LP++;
          this.final_LP += this.max_LP;
        }
      }
    }

    p.calc = function() {
      // unverified
      this.max_LP = 25;
      this.max_LP += Math.floor(Math.min(this.current_rank, 300) / 2);
      this.max_LP += Math.floor(Math.max(this.current_rank - 300, 0) / 3);
      console.log(this.current_rank, this.max_LP);

      this.final_rank = this.current_rank;
      this.final_exp = this.current_exp;
      this.final_LP = this.current_LP;
      this.final_points = this.current_points;
      this.final_play_num = 0;
      this.used_stone = 0;
      this.next_exp = this.rank.rankTable[this.final_rank];

      // TODO: alert when current date is out of event term
      this.now = new Date();
      if (this.now.getDate() <= 15) {
        this.event_start = new Date(this.now.getFullYear(), this.now.getMonth(), 5, 16);
        this.event_end = new Date(this.now.getFullYear(), this.now.getMonth(), 15, 15);
      } else {
        this.event_start = new Date(this.now.getFullYear(), this.now.getMonth(), 20, 16);
        this.event_end = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0, 15);
      }
      this.remain_date = new Date(1970, 0, 0).setSeconds((this.event_end - this.now)/1000);
      this.final_LP += Math.floor((this.event_end-this.now)/1000/60/6);

      this.consumeLP();
      while (this.final_points < this.target_points) {
        this.final_LP += this.max_LP;
        this.used_stone++;
        this.consumeLP();
      }
    }

    return scoreMatch;
  })
  .controller('eventPointsController', function($scope, $timeout, ScoreMatch) {
    $scope.scoreMatch = new ScoreMatch();

    $scope.$watchGroup([
      'scoreMatch.current_rank',
      'scoreMatch.current_exp',
      'scoreMatch.current_LP',
      'scoreMatch.current_points',
      'scoreMatch.average_points',
      'scoreMatch.target_points',
    ], function(newVal, oldVal) {
      $scope.scoreMatch.calc();
    });
  });
