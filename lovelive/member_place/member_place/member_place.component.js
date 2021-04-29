angular.module('darsein-hp')
  .component('memberPlace', {
    templateUrl: 'member_place/member_place.template.html',
    controller: function memberPlaceController($scope, $cookies, boardData) {
      var self = this;

      self.getStoredSelectedPuzzleId = function () {
        return $cookies.get('selected_puzzle_id')
          ? JSON.parse($cookies.get('selected_puzzle_id')) : 0;
      };

      self.getStoredBoard = function (id) {
        return $cookies.get('board' + id)
          ? JSON.parse($cookies.get('board' + id))
          : Array.from(new Array(9), () => new Array(9).fill(0));
      };

      self.getStoredMemo = function (id) {
        return $cookies.get('memo' + id)
          ? JSON.parse($cookies.get('memo' + id))
          : Array.from(new Array(9),
              () => Array.from(new Array(9), () => new Array(9).fill(0))
            );
      };

      self.board_data = new boardData();

      self.selected_puzzle = self.board_data.puzzles[self.getStoredSelectedPuzzleId()];
      self.current_board = self.getStoredBoard(self.selected_puzzle.id);
      self.current_memo = self.getStoredMemo(self.selected_puzzle.id);
      self.overwrite_character = -1;
      self.is_memo_mode = false;

      self.changeSelectedPuzzle = function() {
        self.selected_group = self.board_data.puzzles[self.selected_puzzle.id].group;
        self.selected_board = self.board_data.puzzles[self.selected_puzzle.id].board;
        self.current_board = self.getStoredBoard(self.selected_puzzle.id);
        self.current_memo = self.getStoredMemo(self.selected_puzzle.id);
      };

      self.getCurrentGroup = function() {
        return self.selected_group;
      };

      self.getCellValue = function(row, col) {
        return self.selected_board[row][col] !== 0
                   ? self.selected_board[row][col]
                   : self.current_board[row][col];
      };

      self.getImageUrl = function(id) {
        const image_id = self.selected_puzzle.offset + self.selected_puzzle.member_perm[id - 1]
        return "img/" + self.getCurrentGroup() + image_id + ".jpg"
      };

      self.getColorImageUrl = function(id) {
        return "img/color-" + self.getCurrentGroup() + self.selected_puzzle.member_perm[id - 1] + ".jpg"
      };

      self.isDefaultCell = function(row, col) {
        return self.selected_board[row][col] !== 0;
      };

      self.isCellFilled = function(row, col) {
        return self.getCellValue(row, col) !== 0;
      };

      self.changeCellValue = function(row, col) {
        if (self.is_memo_mode) {
          if (self.isCellFilled(row, col)) {
            return;
          }
          if (self.overwrite_character === 0) {
            self.current_memo[row][col] = new Array(9).fill(0);
          } else if (self.overwrite_character !== -1) {
            self.current_memo[row][col][self.overwrite_character - 1]
              = 1 - self.current_memo[row][col][self.overwrite_character - 1];
          }
        } else {
          if (self.isDefaultCell(row, col)) {
            return;
          }
          if (self.overwrite_character === -1) {
            self.current_board[row][col]++;
            self.current_board[row][col] %= 10;
          } else {
            if (self.current_board[row][col] === self.overwrite_character) {
              self.current_board[row][col] = 0;
            } else {
              self.current_board[row][col] = self.overwrite_character;
            }
          }
        }
      };

      self.changeOverwriteCharactor = function(id) {
        self.overwrite_character = id;
      };

      self.validateNums = function(list) {
        var freq = new Map();
        for (var i of list) {
          freq.set(i, freq.has(i) ? freq.get(i) + 1 : 1);
        }
        if (freq.size == 9 && !freq.has(0)) {
          return "complete";
        }
        for (var [key, value] of freq.entries()) {
          if (key !== 0 && value > 1) {
            return "invalid";
          }
        }
        return "valid";
      };

      self.validateBoard = function() {
        var validation_result = {
          "is_complete": true,
          "error_list": [],
        };

        // validate rows
        for (var i = 0; i < 9; ++i) {
          var nums = [];
          for (var j = 0; j < 9; ++j) {
            nums.push(self.getCellValue(i, j));
          }
          var result = self.validateNums(nums);
          if (result !== "complete") {
            validation_result["is_complete"] = false;
          }
          if (result === "invalid") {
            validation_result["error_list"].push({
              "error_position_type": "行",
              "error_position_index": i,
            });
          }
        }

        // validate columns
        for (var i = 0; i < 9; ++i) {
          var nums = [];
          for (var j = 0; j < 9; ++j) {
            nums.push(self.getCellValue(j, i));
          }
          var result = self.validateNums(nums);
          if (result !== "complete") {
            validation_result["is_complete"] = false;
          }
          if (result === "invalid") {
            validation_result["error_list"].push({
              "error_position_type": "列",
              "error_position_index": i,
            });
          }
        }

        // validate blocks
        for (var i = 0; i < 9; ++i) {
          var nums = [];
          for (var j = 0; j < 9; ++j) {
            nums.push(self.getCellValue(Math.floor(i/3)*3 + Math.floor(j/3), (i%3)*3 + j%3));
          }
          var result = self.validateNums(nums);
          if (result !== "complete") {
            validation_result["is_complete"] = false;
          }
          if (result === "invalid") {
            validation_result["error_list"].push({
              "error_position_type": "ブロック",
              "error_position_index": i,
            });
          }
        }

        self.validation = validation_result;
      };

      self.resetValidation = function() {
        self.validation = {};
      };

      self.resetState = function() {
        self.current_board = Array.from(new Array(9), () => new Array(9).fill(0));
        self.current_memo = Array.from(new Array(9),
            () => Array.from(new Array(9), () => new Array(9).fill(0))
          );
      };

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

      $scope.$watch(function() {
        return self.current_board;
      }, function(newVal, oldVal) {
        self.resetValidation();
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('board' + self.selected_puzzle.id,
          JSON.stringify(self.current_board), {
            expires: expire
          });
      }, true);

      $scope.$watch(function() {
        return self.current_memo;
      }, function(newVal, oldVal) {
        var expire = new Date();
        expire.setMonth(expire.getMonth() + 3);
        $cookies.put('memo' + self.selected_puzzle.id,
          JSON.stringify(self.current_memo), {
            expires: expire
          });
      }, true);
    }
  });
