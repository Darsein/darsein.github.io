angular.module('darsein-hp')
  .component('memberPlace', {
    templateUrl: 'member_place/member_place.template.html',
    controller: function memberPlaceController($scope, $cookies, boardData) {
      var self = this;

      self.getStoredSelectedPuzzleId = function () {
        console.log($cookies.get('selected_puzzle_id'));
        return $cookies.get('selected_puzzle_id')
          ? JSON.parse($cookies.get('selected_puzzle_id')) : 0;
      };

      self.getStoredBoard = function (id) {
        console.log('board' + id, $cookies.get('board' + id));
        return $cookies.get('board' + id)
          ? JSON.parse($cookies.get('board' + id))
          : Array.from(new Array(9), () => new Array(9).fill(0));
      };

      self.board_data = new boardData();

      self.selected_puzzle = self.board_data.puzzles[self.getStoredSelectedPuzzleId()];
      self.current_board = self.getStoredBoard(self.selected_puzzle.id);

      self.changeSelectedPuzzle = function() {
        self.selected_group = self.board_data.puzzles[self.selected_puzzle.id].group;
        self.selected_board = self.board_data.puzzles[self.selected_puzzle.id].board;
        self.current_board = self.getStoredBoard(self.selected_puzzle.id);
      }

      self.getCurrentGroup = function() {
        return self.selected_group;
      };

      self.getCellValue = function(row, col) {
        return self.selected_board[row][col] != 0
                   ? self.selected_board[row][col]
                   : self.current_board[row][col];
      };

      self.incrementCell = function(row, col) {
        if (self.selected_board[row][col] != 0) {
          return;
        }
        self.current_board[row][col]++;
        self.current_board[row][col] %= 10;
      };

      self.resetState = function() {
        for (var i = 0; i < 9; ++i) {
          for (var j = 0; j < 9; ++j) {
            self.current_board[i][j] = 0;
          }
        }
      };

      $scope.$watch(function() {
        return self.current_board;
      }, function(newVal, oldVal) {
        console.log(self.current_board);
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('board' + self.selected_puzzle.id,
          JSON.stringify(self.current_board), {
            expires: expire
          });
      }, true);

      $scope.$watch(function() {
        return self.selected_puzzle;
      }, function(newVal, oldVal) {
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('selected_puzzle_id', JSON.stringify(self.selected_puzzle.id), {
          expires: expire
        });
        self.changeSelectedPuzzle();
      }, true);
    }
  });
