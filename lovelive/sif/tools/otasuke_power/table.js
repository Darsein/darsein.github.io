angular.module('otasukeTable', [])
  .service("OtasukeTable",
  function() {
    var otasukeTable = function() {
      this.rare_ratio = { N: 0, R: 25, SR: 55, SSR: 120, UR: 200 };
      this.otasuke_threshold = [0, 450, 900, 1350, 2250, 3150, 4650, 6900, 10050, 14250];
    }
    return otasukeTable;
  })
  .service("SkillLevelTable",
  function() {
    var skillLevelTable = function() {
      this.skill_level_table = {};
      this.skill_level_table[0] = [0];
      this.skill_level_table[25] = [0, 10, 20, 40, 60, 90, 120, 150];
      this.skill_level_table[55] = [0, 100, 200, 400, 600, 900, 1200, 1500];
      this.skill_level_table[120] = [0, 200, 400, 800, 1200, 2400, 3200, 4500];
      this.skill_level_table[200] = [0, 300, 600, 1500, 3000, 5000, 7500, 12000];
    }
    return skillLevelTable;
  })
