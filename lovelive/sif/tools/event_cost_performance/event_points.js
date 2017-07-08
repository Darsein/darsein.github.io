angular.module('darsein-hp', ['ngMaterial', 'ngCookies', 'rank', 'points'])
  .service('Event', function($cookies, Rank, ScoreMatch, Macaron) {

    var event = function() {
      this.rank = new Rank();
      this.event_type = {};
      this.event_type['score_match'] = new ScoreMatch();
      this.event_type['macaron'] = new Macaron();

      this.event_name = 'macaron';
      this.difficulty = 'expert';
      this.task_difficulty = 'expert';
      this.score = 0;
      this.combo = 0;
      this.ranking = 1;
      this.current_rank = 100;
      this.current_exp = 0;
      this.current_LP = 0;
      this.current_points = 0;
      this.target_points = 25000;
      this.macaron = 0;

      this.event_name = $cookies.get('event_name') ? $cookies.get('event_name') : 'macaron';
      this.difficulty = $cookies.get('difficulty') ? $cookies.get('difficulty') :'expert';
      this.task_difficulty = $cookies.get('task_difficulty') ? $cookies.get('task_difficulty') :'expert';
      this.score = $cookies.get('score') ? $cookies.get('score') : 0;
      this.combo = $cookies.get('combo') ? $cookies.get('combo') : 0;
      this.ranking = $cookies.get('ranking') ? $cookies.get('ranking') : 1;
      this.current_rank = $cookies.get('current_rank') ? Number($cookies.get('current_rank')) : 100;
      this.current_exp = $cookies.get('current_exp') ? Number($cookies.get('current_exp')) : 0;
      this.current_LP = $cookies.get('current_LP') ? Number($cookies.get('current_LP')) : 0;
      this.current_points = $cookies.get('current_points') ? Number($cookies.get('current_points')) : 0;
      this.target_points = $cookies.get('target_points') ? Number($cookies.get('target_points')) : 25000;
      this.macaron = $cookies.get('macaron') ? Number($cookies.get('macaron')) : 0;
      if (this.event_name === 'macaron') {
        this.average_points = this.event_type[this.event_name].get_points[this.task_difficulty][this.score][this.combo];
      } else {
        this.average_points = Math.ceil(this.event_type[this.event_name].base_points[this.difficulty] * this.event_type[this.event_name].score_bonus[this.score] * this.event_type[this.event_name].ranking_bonus[this.ranking]);
      }
      if ($cookies.get('average_points')) {
        this.average_points = Number($cookies.get('average_points', Number));
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
      var LP_per_play = this.event_type[this.event_name].required_LP[this.difficulty];
      var exp_per_play = this.event_type[this.event_name].exp[this.difficulty];
      while (true) {
        var play_num = Math.floor(this.final_LP / LP_per_play);
        if (play_num === 0) break;

        if (this.event_name === 'macaron') {
          this.final_points += this.event_type[this.event_name].get_macarons[this.difficulty] * play_num;
          this.final_macaron += this.event_type[this.event_name].get_macarons[this.difficulty] * play_num;
        } else {
          this.final_points += this.average_points * play_num;
        }
        this.final_LP -= LP_per_play * play_num;
        this.final_exp += exp_per_play * play_num;
        this.final_play_num += play_num;

        if (this.event_name === 'macaron') {
          var macaron_per_task_play = this.event_type[this.event_name].required_macarons[this.task_difficulty];
          var exp_per_task_play = this.event_type[this.event_name].exp[this.task_difficulty];
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

      this.consumeLP();
      while (this.final_points < this.target_points) {
        this.final_LP += this.max_LP;
        this.used_stone++;
        this.consumeLP();
      }

      [this.required_day, this.required_hour, this.required_min] =
          this.secToDateTuple((this.final_play_num + this.final_task_play_num) * 3 * 60);

      this.rewards = {};
      for (var reward of this.event_type[this.event_name].event_rewards) {
        if (reward['required_points'] <= this.final_points) {
          if (!this.rewards[reward['category']]) this.rewards[reward['category']] = 0;
          this.rewards[reward['category']] += reward['number'];
        }
      }
    }

    p.setCookies = function() {
      var expire = new Date();
      expire.setMonth(expire.getMonth() + 3);

      $cookies.put('event_name', this.event_name, {expires: expire});
      $cookies.put('difficulty', this.difficulty, {expires: expire});
      $cookies.put('task_difficulty', this.task_difficulty, {expires: expire});
      $cookies.put('score', this.score, {expires: expire});
      $cookies.put('combo', this.combo, {expires: expire});
      $cookies.put('ranking', this.ranking, {expires: expire});
      $cookies.put('current_rank', this.current_rank, {expires: expire});
      $cookies.put('current_exp', this.current_exp, {expires: expire});
      $cookies.put('current_LP', this.current_LP, {expires: expire});
      $cookies.put('current_points', this.current_points, {expires: expire});
      $cookies.put('target_points', this.target_points, {expires: expire});
      $cookies.put('average_points', this.target_points, {expires: expire});
      $cookies.put('macaron', this.macaron, {expires: expire});
    }

    return event;
  })
  .controller('eventPointsController', function($scope, $timeout, Event) {
    $scope.event = new Event();

    $scope.$watchGroup([
      'event.event_name',
      'event.difficulty',
      'event.task_difficulty',
      'event.score',
      'event.combo',
      'event.ranking',
    ], function(newVal, oldVal) {
      // Score: S, Ranking: 2nd
      if ($scope.event.event_name == 'macaron') {
        $scope.event.average_points = $scope.event.event_type[$scope.event.event_name].get_points[$scope.event.task_difficulty][$scope.event.score][$scope.event.combo];
      } else {
        $scope.event.average_points = Math.ceil($scope.event.event_type[$scope.event.event_name].base_points[$scope.event.difficulty] * $scope.event.event_type[$scope.event.event_name].score_bonus[$scope.event.score] * $scope.event.event_type[$scope.event.event_name].ranking_bonus[$scope.event.ranking]);
      }
      $scope.event.calc();
      $scope.event.setCookies();
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
      $scope.event.setCookies();
    });

  });
