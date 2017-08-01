angular.module('darsein-hp', ['ngMaterial'])
  .factory('CalendarData', function($http) {
    return {
      getCalendarData: function() {
        return $http({
            method: 'GET',
            url: 'https://www.googleapis.com/calendar/v3/calendars/darsein.ll%40gmail.com/events?key=AIzaSyCTsWVSc_Slirsqy5ry4NPzMPLJMPeqSQQ',
            params: {}
          })
          .success(function(data, status, headers, config) {
            return data;
          })
          .error(function(data, status, headers, config) {
            // TODO: reconsider error handling
            alert('カレンダーデータの取得に失敗しました');
          });
      }
    }
  })
  .service('StoneEvents', function() {
    var stone_events = function() {
      // TODO: cache event data
      this.setDates();
    };

    var p = stone_events.prototype;

    p.setDates = function() {
      this.start_day = new Date();
      this.target_day = new Date();
      this.target_day.setDate(this.target_day.getDate() + 7);
    };

    p.parseEvents = function(raw_events) {
      var events = [];
      for (var i = 0, len = raw_events.length; i < len; ++i) {
        var event = new Object();
        event.category = raw_events[i].summary.match(/(.*)\s\(.+\)/)[1];

        event.start_date = new Date(raw_events[i].start.date.replace(/-/g, "/") + " 00:00:00");

        // UTNIL or null
        var maybe_end_date = raw_events[i].recurrence[0].match(/.*UNTIL=(.*).*/);
        event.end_date = maybe_end_date ? new Date(maybe_end_date[1].slice(0, 4) + "/" + maybe_end_date[1].slice(4, 6) + "/" + maybe_end_date[1].slice(6, 8) + " 00:00:00") : null;

        // YEARLY, MONTHLY (BYMONTHDAY=-1), WEEKLY, DAILY
        event.frequency = raw_events[i].recurrence[0].match(/.*FREQ=([A-Z]+).*/)[1];

        event.is_end_of_month = raw_events[i].recurrence[0].match(/.*BYMONTHDAY=-1.*/) !== null;

        // in ()
        event.num_per_day = Number(raw_events[i].summary.match(/.*\((.+)\)/)[1]);

        // TODO: will be in ()
        event.reward_type = "ラブカストーン";

        events.push(event);
      }
      return events;
    };

    p.beginOfDay = function(day) {
      day.setHours(0);
      day.setMinutes(0);
      day.setSeconds(0);
      day.setMilliseconds(0);
    }

    p.calcStonesNum = function() {
      this.rewards = {};
      for (var i = 0, len = this.events.length; i < len; ++i) {
        var event = this.events[i];
        var start_day = new Date(event.start_date < this.start_day ? this.start_day : event.start_date);
        var end_day = new Date((event.end_date === null) ? this.target_day :
          (event.end_date > this.target_day ? this.target_day : event.end_date));

        var times = 0;
        if (event.frequency == "DAILY") {
          times = Math.floor(end_day / 86400000) - Math.floor(start_day / 86400000) + 1;
          if (times < 0) times = 0;
        } else if (event.frequency == "WEEKLY") {
          // currently no weekly event
        } else if (event.frequency == "MONTHLY") {
          var event_day = new Date(event.start_date);
          while (event_day <= end_day) {
            if (start_day <= event_day) times++;
            if (event.is_end_of_month) {
              event_day.setDate(1);
              event_day.setMonth(event_day.getMonth() + 2);
              event_day.setDate(0);
            } else {
              event_day.setMonth(event_day.getMonth() + 1);
            }
          }
        } else if (event.frequency == "YEARLY") {
          var event_day = new Date(event.start_date);
          while (event_day <= end_day) {
            if (start_day <= event_day) times++;
            event_day.setFullYear(event_day.getFullYear() + 1);
          }
        }

        if (!this.rewards[event.reward_type]) {
          this.rewards[event.reward_type] = new Object();
          this.rewards[event.reward_type].total_num = 0;
        }
        this.rewards[event.reward_type].total_num += times * event.num_per_day;

        if (!this.rewards[event.reward_type].detail) {
          this.rewards[event.reward_type].detail = new Object();
        }
        if (!this.rewards[event.reward_type].detail[event.category]) {
          this.rewards[event.reward_type].detail[event.category] = new Object();
          this.rewards[event.reward_type].detail[event.category].num = event.num_per_day;
          this.rewards[event.reward_type].detail[event.category].times = 0;
        }
        this.rewards[event.reward_type].detail[event.category].times += times;
      }
    };

    return stone_events;
  })
  .controller('stoneEventsController', function($scope, $timeout, CalendarData, StoneEvents) {
    $scope.stone_events = new StoneEvents();
    CalendarData.getCalendarData().then(function(res) {
      $scope.stone_events.events = $scope.stone_events.parseEvents(res.data.items);
      $scope.stone_events.calcStonesNum();
    });

    $scope.$watchGroup([
      'stone_events.start_day',
      'stone_events.target_day',
    ], function(newVal, oldVal) {
      $scope.stone_events.beginOfDay($scope.stone_events.start_day);
      $scope.stone_events.beginOfDay($scope.stone_events.target_day);
      if ($scope.stone_events.events) $scope.stone_events.calcStonesNum();
    });
  });
