angular.module('darsein-hp', ['ngMaterial', 'rank', 'points'])
  .service("Event", function(Rank, ScoreMatch, Macaron) {

    var event = function() {
      this.rank = new Rank();
      this.reward = {};
      this.reward["score_match"] = new ScoreMatch();
      this.reward["macaron"] = new Macaron();

      this.event_type = 'macaron';
      this.difficulty = 'expert';
      this.task_difficulty = "expert";
      this.score = 0;
      this.combo = 0;
      this.ranking = 1;
      this.current_rank = 100;
      this.current_exp = 0;
      this.current_LP = 0;
      this.current_points = 0;
      this.target_points = 25000;
      this.macaron = 0;
      if (this.event_type === "macaron") {
        this.average_points = this.reward[this.event_type].get_points[this.task_difficulty][this.score][this.combo];
      } else {
        this.average_points = Math.ceil(this.reward[this.event_type].base_points[this.difficulty] * this.reward[this.event_type].score_bonus[this.score] * this.reward[this.event_type].ranking_bonus[this.ranking]);
      }
    }
    var p = event.prototype;

    p.secToDateTuple = function(sec) {
      var min = Math.floor(sec / 60);
      var hour = Math.floor(min / 60);
      min -= hour * 60;
      var day = Math.floor(hour / 24);
      hour -= day * 24;
      return [day, hour ,min];
    }

    p.consumeLP = function() {
      var LP_per_play = this.reward[this.event_type].required_LP[this.difficulty];
      var exp_per_play = this.reward[this.event_type].exp[this.difficulty];
      while (true) {
        var play_num = Math.floor(this.final_LP / LP_per_play);
        if (play_num === 0) break;

        if (this.event_type === 'macaron') {
          this.final_points += this.reward[this.event_type].get_macarons[this.difficulty] * play_num;
          this.final_macaron += this.reward[this.event_type].get_macarons[this.difficulty] * play_num;
        } else {
          this.final_points += this.average_points * play_num;
        }
        this.final_LP -= LP_per_play * play_num;
        this.final_exp += exp_per_play * play_num;
        this.final_play_num += play_num;

        if (this.event_type === 'macaron') {
          var macaron_per_task_play = this.reward[this.event_type].required_macarons[this.task_difficulty];
          var exp_per_task_play = this.reward[this.event_type].exp[this.task_difficulty];
          var task_play_num = Math.floor(this.final_macaron / macaron_per_task_play);
          this.final_macaron -= macaron_per_task_play * task_play_num;
          this.final_exp += exp_per_task_play * task_play_num;
          this.final_task_play_num += task_play_num;
          this.final_points += this.average_points * task_play_num;
        }

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

      this.final_rank = this.current_rank;
      this.final_exp = this.current_exp;
      this.final_LP = this.current_LP;
      this.final_points = this.current_points;
      this.final_play_num = 0;
      this.final_task_play_num = 0;
      this.final_macaron = this.macaron;
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
      [this.remain_day, this.remain_hour, this.remain_min] =
          this.secToDateTuple( Math.floor((this.event_end - Math.max(this.now, this.event_start))/1000) );
      this.final_LP += Math.floor((this.event_end - Math.max(this.now, this.event_start)) / 1000 / 60 / 6);
      console.log(this.final_LP);

      this.consumeLP();
      while (this.final_points < this.target_points) {
        this.final_LP += this.max_LP;
        this.used_stone++;
        this.consumeLP();
      }

      [this.required_day, this.required_hour, this.required_min] =
          this.secToDateTuple((this.final_play_num + this.final_task_play_num) * 3 * 60);
    }

    return event;
  })
  .controller('eventPointsController', function($scope, $timeout, Event) {
    $scope.event = new Event();

    $scope.$watchGroup([
      'event.event_type',
      'event.task_difficulty',
      'event.difficulty',
      'event.score',
      'event.combo',
      'event.ranking',
    ], function(newVal, oldVal) {
      // Score: S, Ranking: 2nd
      if ($scope.event.event_type == "macaron") {
        $scope.event.average_points = $scope.event.reward[$scope.event.event_type].get_points[$scope.event.task_difficulty][$scope.event.score][$scope.event.combo];
      } else {
        $scope.event.average_points = Math.ceil($scope.event.reward[$scope.event.event_type].base_points[$scope.event.difficulty] * $scope.event.reward[$scope.event.event_type].score_bonus[$scope.event.score] * $scope.event.reward[$scope.event.event_type].ranking_bonus[$scope.event.ranking]);
      }
      $scope.event.calc();
    });

    $scope.$watchGroup([
      'event.current_rank',
      'event.current_exp',
      'event.current_LP',
      'event.current_points',
      'event.average_points',
      'event.target_points',
      'event.macaron',
    ], function(newVal, oldVal) {
      $scope.event.calc();
    });

    $scope.$watch('event.event_type', function(newVal, oldVal) {
      if ($scope.event.event_type === 'score_match') $scope.event.target_points = 50000;
      if ($scope.event.event_type === 'macaron') $scope.event.target_points = 25000;
    });
  });
