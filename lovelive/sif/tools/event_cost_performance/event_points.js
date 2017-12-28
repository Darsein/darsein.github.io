angular.module('darsein-hp', ['ngMaterial', 'ngCookies', 'rank', 'points'])
  .service('Event', function($cookies, Rank, ScoreMatch, Macaron, MedleyFestival, ChallengeFestival, OsanpoRally, NakayoshiMatch) {

    var event = function() {
      this.rank = new Rank();
      this.event_type = {};
      this.event_type['score_match'] = new ScoreMatch();
      this.event_type['macaron'] = new Macaron();
      this.event_type['medley_festival'] = new MedleyFestival();
      this.event_type['challenge_festival'] = new ChallengeFestival();
      this.event_type['osanpo_rally'] = new OsanpoRally();
      this.event_type['nakayoshi_match'] = new NakayoshiMatch();

      this.event_name = $cookies.get('event_name') ? $cookies.get('event_name') : 'osanpo_rally';
      this.difficulty = $cookies.get('difficulty') ? $cookies.get('difficulty') : 'expert';
      this.secret_difficulty = $cookies.get('secret_difficulty') ? $cookies.get('secret_difficulty') : 'expert';
      this.task_difficulty = $cookies.get('task_difficulty') ? $cookies.get('task_difficulty') : 'expert';
      this.score = $cookies.get('score') ? $cookies.get('score') : 0;
      this.combo = $cookies.get('combo') ? $cookies.get('combo') : 0;
      this.normal_LP_ratio = $cookies.get('normal_LP_ratio') ? $cookies.get('normal_LP_ratio') : 1;
      this.secret_score = $cookies.get('ssecret_core') ? $cookies.get('secret_score') : 0;
      this.secret_combo = $cookies.get('secret_combo') ? $cookies.get('secret_combo') : 0;
      this.secret_LP_ratio = $cookies.get('secret_LP_ratio') ? $cookies.get('secret_LP_ratio') : 1;
      this.ranking = $cookies.get('ranking') ? $cookies.get('ranking') : 1;
      this.rounds = $cookies.get('rounds') ? $cookies.get('rounds') : this.event_name === 'medley_festival' ? 3 : 5;
      this.pt_arrange = $cookies.get('pt_arrange') ? $cookies.get('pt_arrange') : 1;
      this.exp_arrange = $cookies.get('exp_arrange') ? $cookies.get('exp_arrange') : 1;
      this.contribution = $cookies.get('contribution') ? $cookies.get('contribution') : 1;
      this.mission = $cookies.get('mission') ? $cookies.get('mission') : 0;
      this.current_points = $cookies.get('current_points') ? Number($cookies.get('current_points')) : 0;
      if (this.event_name === 'macaron') {
        this.average_points = this.event_type[this.event_name].get_points[this.task_difficulty][this.score][this.combo];
      } else {
        var points = this.event_type[this.event_name].base_points[this.difficulty];
        points *= this.event_type[this.event_name].score_bonus[this.score];
        if (this.event_name === 'score_match') {
          points *= this.event_type[this.event_name].ranking_bonus[this.ranking];
        }
        if (this.event_name === 'medley_festival') {
          points = this.event_type[this.event_name].base_points[this.difficulty][this.rounds-1];
          points *= this.event_type[this.event_name].combo_bonus[this.combo];
          points *= this.event_type[this.event_name].score_bonus[this.score];
          points *= this.event_type[this.event_name].arrange_bonus[this.pt_arrange];
        }
        if (this.event_name === 'challenge_festival') {
          points = 0;
          for (var i = 0; i < this.rounds; ++i) {
            var point_per_round = this.event_type[this.event_name].base_points[this.difficulty][i]
            point_per_round *= this.event_type[this.event_name].combo_bonus[this.combo];
            point_per_round *= this.event_type[this.event_name].score_bonus[this.score];
            point_per_round *= this.event_type[this.event_name].arrange_bonus[this.pt_arrange];
            points += Math.ceil(point_per_round);
          }
        }
        if (this.event_name === 'osanpo_rally') {
          points *= this.event_type[this.event_name].combo_bonus[this.combo];
          points *= this.normal_LP_ratio;
        }
        if (this.event_name === 'nakayoshi_match') {
          points *= this.event_type[this.event_name].combo_bonus[this.combo];
          points *= this.event_type[this.event_name].contribution_bonus[this.contribution];
          points *= this.event_type[this.event_name].mission_bonus[this.mission];
        }
        this.average_points = Math.ceil(points);
      }
      if ($cookies.get('average_points')) {
        this.average_points = Number($cookies.get('average_points'));
      }

      if (this.event_name === 'osanpo_rally') {
        points = this.event_type[this.event_name].base_points[this.secret_difficulty];
        points *= this.event_type[this.event_name].score_bonus[this.secret_score];
        points *= this.event_type[this.event_name].combo_bonus[this.secret_combo];
        points *= this.event_type[this.event_name].secret_pt_exp;
        points *= this.secret_LP_ratio;
        this.secret_average_points = Math.ceil(points)
      }
      if ($cookies.get('secret_average_points')) {
        this.secret_average_points = Number($cookies.get('secret_average_points'));
      }

      this.border = {}
      this.border[10000] = $cookies.get('border_10000') ? Number($cookies.get('border_10000')) : 110000;
      this.border[50000] = $cookies.get('border_50000') ? Number($cookies.get('border_50000')) : 50000;
      this.border[120000] = $cookies.get('border_120000') ? Number($cookies.get('border_120000')) : 25000;
      this.border[700000] = 0;

      this.current_rank = $cookies.get('current_rank') ? Number($cookies.get('current_rank')) : 100;
      this.current_exp = $cookies.get('current_exp') ? Number($cookies.get('current_exp')) : 0;
      this.current_LP = $cookies.get('current_LP') ? Number($cookies.get('current_LP')) : 0;
      this.current_omiyage = $cookies.get('current_omiyage') ? Number($cookies.get('current_omiyage')) : 0;
      this.used_stone = $cookies.get('used_stone') ? Number($cookies.get('used_stone')) : 0;
      this.macaron = $cookies.get('macaron') ? Number($cookies.get('macaron')) : 0;

      this.target = $cookies.get('target') ? $cookies.get('target') : 'points';
      this.target_points = $cookies.get('target_points') ? Number($cookies.get('target_points')) : 60000;
      this.target_stone = $cookies.get('target_stone') ? Number($cookies.get('target_stone')) : 0;
      this.target_rank = $cookies.get('target_rank') ? Number($cookies.get('target_rank')) : this.current_rank;

      this.min_per_play = 2.5;
      if (this.event_name === 'score_match' || this.event_name === 'nakayoshi_match') {
        this.min_per_play = 3;
      }
      if (this.event_name === 'challenge_festival' || this.event_name === 'medley_festival') {
        this.min_per_play *= this.rounds;
      }
      this.calcTarget();
    }
    var p = event.prototype;

    p.secToDateTuple = function(sec) {
      var min = Math.floor(sec / 60);
      var hour = Math.floor(min / 60);
      min -= hour * 60;
      var day = Math.floor(hour / 24);
      hour -= day * 24;
      return [day, hour, min];
    }

    p.consumeLP = function() {
      var LP_per_play = this.event_type[this.event_name].required_LP[this.difficulty];
      if (this.event_name === 'medley_festival' || this.event_name == 'challenge_festival') {
        LP_per_play *= this.rounds;
      }
      var exp_per_play = this.event_type[this.event_name].exp[this.difficulty];
      if (this.event_name === 'medley_festival') {
        exp_per_play = Math.ceil(exp_per_play * this.rounds
          * this.event_type[this.event_name].arrange_bonus[this.exp_arrange]);
      }
      if (this.event_name === 'challenge_festival') {
        exp_per_play = 0;
        for (var i = 0; i < this.rounds; ++i) {
          exp_per_play += Math.floor((this.event_type[this.event_name].exp[this.difficulty] +
              this.event_type[this.event_name].exp_bonus[this.difficulty] * i) *
            this.event_type[this.event_name].arrange_bonus[this.exp_arrange]);
        }
      }
      if (this.event_name === 'osanpo_rally') {
        // TODO: allow users to input this parameter.
        var secret_required_play = 5;

        LP_per_play *= this.normal_LP_ratio;
        exp_per_play *= this.normal_LP_ratio;
        var omiyage_per_play = this.event_type[this.event_name].get_omiyage[this.difficulty];
        omiyage_per_play *= this.normal_LP_ratio;

        var LP_per_secret_play = this.event_type[this.event_name].required_LP[this.secret_difficulty];
        LP_per_secret_play *= this.event_type[this.event_name].secret_LP_exp;
        LP_per_secret_play *= this.secret_LP_ratio;
        var exp_per_secret_play = this.event_type[this.event_name].exp[this.secret_difficulty];
        exp_per_secret_play *= this.secret_LP_ratio;
        var omiyage_per_secret_play = this.event_type[this.event_name].get_omiyage[this.secret_difficulty] * 2.5;
        omiyage_per_secret_play *= this.event_type[this.event_name].secret_omiyage_exp;
        omiyage_per_secret_play *= this.secret_LP_ratio;

        while (true) {
          if (this.final_play_num % secret_required_play == 0 && this.final_secret_play_num * secret_required_play < this.final_play_num) {
            if (this.final_LP < LP_per_secret_play) break;
            this.final_LP -= LP_per_secret_play;
            this.final_exp += exp_per_secret_play;
            this.final_secret_play_num += 1;
            this.final_points += this.secret_average_points;
            this.final_omiyage += omiyage_per_secret_play;
          } else {
            if (this.final_LP < LP_per_play) break;
            this.final_LP -= LP_per_play;
            this.final_exp += exp_per_play;
            this.final_play_num += 1;
            this.final_points += this.average_points;
            this.final_omiyage += omiyage_per_play;
          }

          while (this.next_exp <= this.final_exp) {
            this.final_exp -= this.next_exp;
            this.final_rank++;
            this.next_exp = this.rank.rankTable[this.final_rank];
            if (this.final_rank <= 300 && this.final_rank % 2 == 0) this.max_LP++;
            if (this.final_rank > 300 && this.final_rank % 3 == 0) this.max_LP++;
            this.final_LP += this.max_LP;
          }
        }
      } else {
        while (true) {
          var play_num = Math.floor(this.final_LP / LP_per_play);
          if (play_num == 0) break;

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
            if (this.final_rank <= 300 && this.final_rank % 2 == 0) this.max_LP++;
            if (this.final_rank > 300 && this.final_rank % 3 == 0) this.max_LP++;
            this.final_LP += this.max_LP;
          }
        }
      }
    }

    p.calcInitialize = function() {
      this.max_LP = 25;
      this.max_LP += Math.floor(Math.min(this.current_rank, 300) / 2);
      this.max_LP += Math.floor(Math.max(this.current_rank - 300, 0) / 3);

      this.final_rank = this.current_rank;
      this.final_exp = this.current_exp;
      this.final_LP = this.current_LP;
      this.final_points = this.current_points;
      this.final_play_num = 0;
      this.final_secret_play_num = 0;
      this.final_task_play_num = 0;
      this.final_macaron = this.macaron;
      this.final_omiyage = this.current_omiyage;
      this.required_stone = 0;
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
      this.secToDateTuple(Math.floor((this.event_end - Math.max(this.now, this.event_start)) / 1000));
    }

    p.calcRewards = function() {
      this.rewards = {};
      for (var reward of this.event_type[this.event_name].event_rewards) {
        if (reward['required_points'] <= this.final_points) {
          if (!this.rewards[reward['category']]) this.rewards[reward['category']] = 0;
          this.rewards[reward['category']] += reward['number'];
        }
      }

      for (var ranking_reward of this.event_type[this.event_name].ranking_rewards) {
        if (this.border[ranking_reward['border']] <= this.final_points) {
          if (!this.rewards[ranking_reward['category']]) this.rewards[ranking_reward['category']] = 0;
          this.rewards[ranking_reward['category']] += ranking_reward['number'];
        }
      }
    }

    p.checkTargetCondition = function() {
      if (this.target === "points" && this.final_points < this.target_points) {
        return true;
      }
      if (this.target === "stone" && this.required_stone < this.target_stone) {
        return true;
      }
      if (this.target === "rank" && this.final_rank < this.target_rank) {
        return true;
      }
      return false;
    }

    p.calcTarget = function() {
      this.calcInitialize();

      this.final_LP += Math.floor((this.event_end - Math.max(this.now, this.event_start)) / 1000 / 60 / 6);
      this.consumeLP();
      while (this.checkTargetCondition()) {
        this.final_LP += this.max_LP;
        this.required_stone++;
        this.consumeLP();
      }

      var required_time = (this.final_play_num + this.final_task_play_num + this.final_secret_play_num) * this.min_per_play * 60;
      [this.required_day, this.required_hour, this.required_min] =
      this.secToDateTuple(required_time);

      this.calcRewards();
    }

    p.setCookies = function() {
      var expire = new Date();
      expire.setMonth(expire.getMonth() + 3);

      $cookies.put('event_name', this.event_name, {
        expires: expire
      });
      $cookies.put('difficulty', this.difficulty, {
        expires: expire
      });
      $cookies.put('secret_difficulty', this.secret_difficulty, {
        expires: expire
      });
      $cookies.put('task_difficulty', this.task_difficulty, {
        expires: expire
      });
      $cookies.put('score', this.score, {
        expires: expire
      });
      $cookies.put('combo', this.combo, {
        expires: expire
      });
      $cookies.put('normal_LP_ratio', this.normal_LP_ratio, {
        expires: expire
      });
      $cookies.put('secret_score', this.secret_score, {
        expires: expire
      });
      $cookies.put('secret_combo', this.secret_combo, {
        expires: expire
      });
      $cookies.put('secret_LP_ratio', this.secret_LP_ratio, {
        expires: expire
      });
      $cookies.put('ranking', this.ranking, {
        expires: expire
      });
      $cookies.put('rounds', this.rounds, {
        expires: expire
      });
      $cookies.put('pt_arrange', this.pt_arrange, {
        expires: expire
      });
      $cookies.put('exp_arrange', this.exp_arrange, {
        expires: expire
      });
      $cookies.put('contribution', this.contribution, {
        expires: expire
      });
      $cookies.put('mission', this.mission, {
        expires: expire
      });

      $cookies.put('current_points', this.current_points, {
        expires: expire
      });
      $cookies.put('average_points', this.average_points, {
        expires: expire
      });

      $cookies.put('border_10000', this.border[10000], {
        expires: expire
      });
      $cookies.put('border_50000', this.border[50000], {
        expires: expire
      });
      $cookies.put('border_120000', this.border[120000], {
        expires: expire
      });

      $cookies.put('current_rank', this.current_rank, {
        expires: expire
      });
      $cookies.put('current_exp', this.current_exp, {
        expires: expire
      });
      $cookies.put('current_LP', this.current_LP, {
        expires: expire
      });
      $cookies.put('current_omiyage', this.current_omiyage, {
        expires: expire
      });
      $cookies.put('used_stone', this.used_stone, {
        expires: expire
      });
      $cookies.put('macaron', this.macaron, {
        expires: expire
      });

      $cookies.put('target', this.target, {
        expires: expire
      });
      $cookies.put('target_points', this.target_points, {
        expires: expire
      });
      $cookies.put('target_stone', this.target_stone, {
        expires: expire
      });
      $cookies.put('target_rank', this.target_rank, {
        expires: expire
      });
    }

    return event;
  })
  .controller('eventPointsController', function($scope, $timeout, Event) {
    $scope.event = new Event();

    $scope.$watchGroup([
      'event.event_name',
      'event.difficulty',
      'event.secret_difficulty',
      'event.task_difficulty',
      'event.score',
      'event.combo',
      'event.normal_LP_ratio',
      'event.secret_score',
      'event.secret_combo',
      'event.secret_LP_ratio',
      'event.ranking',
      'event.rounds',
      'event.pt_arrange',
      'event.exp_arrange',
      'event.contribution',
      'event.mission',
    ], function(newVal, oldVal) {
      // Score: S, Ranking: 2nd
      if ($scope.event.event_name === 'macaron') {
        $scope.event.average_points = $scope.event.event_type[$scope.event.event_name].get_points[$scope.event.task_difficulty][$scope.event.score][$scope.event.combo];
      } else {
        var points = $scope.event.event_type[$scope.event.event_name].base_points[$scope.event.difficulty];
        points *= $scope.event.event_type[$scope.event.event_name].score_bonus[$scope.event.score];
        if ($scope.event.event_name === 'score_match') {
          points *= $scope.event.event_type[$scope.event.event_name].ranking_bonus[$scope.event.ranking];
        }
        if ($scope.event.event_name === 'medley_festival') {
          points = $scope.event.event_type[$scope.event.event_name].base_points[$scope.event.difficulty][$scope.event.rounds-1];
          points *= $scope.event.event_type[$scope.event.event_name].combo_bonus[$scope.event.combo];
          points *= $scope.event.event_type[$scope.event.event_name].score_bonus[$scope.event.score];
          points *= $scope.event.event_type[$scope.event.event_name].arrange_bonus[$scope.event.pt_arrange];
        }
        if ($scope.event.event_name === 'challenge_festival') {
          points = 0;
          for (var i = 0; i < $scope.event.rounds; ++i) {
            var point_per_round = $scope.event.event_type[$scope.event.event_name].base_points[$scope.event.difficulty][i]
            point_per_round *= $scope.event.event_type[$scope.event.event_name].combo_bonus[$scope.event.combo];
            point_per_round *= $scope.event.event_type[$scope.event.event_name].score_bonus[$scope.event.score];
            point_per_round *= $scope.event.event_type[$scope.event.event_name].arrange_bonus[$scope.event.pt_arrange];
            points += Math.round(point_per_round);
          }
        }
        if ($scope.event.event_name === 'osanpo_rally') {
          points *= $scope.event.event_type[$scope.event.event_name].combo_bonus[$scope.event.combo];
          points *= $scope.event.normal_LP_ratio;
        }
        if ($scope.event.event_name === 'nakayoshi_match') {
          points *= $scope.event.event_type[$scope.event.event_name].combo_bonus[$scope.event.combo];
          points *= $scope.event.event_type[$scope.event.event_name].contribution_bonus[$scope.event.contribution];
          points *= $scope.event.event_type[$scope.event.event_name].mission_bonus[$scope.event.mission];
        }
        $scope.event.average_points = Math.ceil(points);

        if ($scope.event.event_name === 'osanpo_rally') {
          points = $scope.event.event_type[$scope.event.event_name].base_points[$scope.event.secret_difficulty];
          points *= $scope.event.event_type[$scope.event.event_name].score_bonus[$scope.event.secret_score];
          points *= $scope.event.event_type[$scope.event.event_name].combo_bonus[$scope.event.secret_combo];
          points *= $scope.event.event_type[$scope.event.event_name].secret_pt_exp;
          points *= $scope.event.secret_LP_ratio;
          $scope.event.secret_average_points = Math.ceil(points)
        }

      }
    });

    $scope.$watchGroup([
      'event.current_rank',
      'event.current_exp',
      'event.current_LP',
      'event.current_omiyage',
      'event.current_points',
      'event.average_points',
      'event.secret_average_points',
      'event.target',
      'event.target_points',
      'event.target_stone',
      'event.target_rank',
      'event.macaron',
    ], function(newVal, oldVal) {
      // TODO: revisit after introducing validation
      if ($scope.event.average_points > 0) {
        if ($scope.event.event_name !== 'osanpo_rally' || $scope.event.secret_average_points > 0) {
          $scope.event.calcTarget();
        }
      }
      $scope.event.setCookies();
    });

    $scope.$watchCollection('event.border', function(newVal, oldVal) {
      // TODO: revisit after introducing validation
      if ($scope.event.average_points > 0) {
        if ($scope.event.event_name !== 'osanpo_rally' || $scope.event.secret_average_points > 0) {
          $scope.event.calcTarget();
        }
      }
      $scope.event.setCookies();
    });

    $scope.$watchGroup([
      'event.used_stone',
      'event.required_stone',
      'event.rewards["ラブカストーン"]',
    ], function(newVal, oldVal) {
      $scope.event.total_stone = $scope.event.used_stone + $scope.event.required_stone;
      var reward_stone = $scope.event.rewards["ラブカストーン"] ? $scope.event.rewards["ラブカストーン"] : 0;
      $scope.event.stone_diff = reward_stone - $scope.event.total_stone;
      $scope.event.setCookies();
    });
  });
