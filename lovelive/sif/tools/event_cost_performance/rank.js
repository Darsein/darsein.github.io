angular.module('rank', [])
  .service("Rank",
  function() {
    var rank = function() {
      this.rankTable = [
        0,
        6, 6, 8, 10, 13, 16, 20, 24, 28, 34,
        39, 46, 52, 60, 68, 76, 85, 94, 104, 115,
        125, 137, 149, 162, 174, 188, 203, 217, 232, 247,
        264, 281, 298, 310, 327, 345, 362, 379, 396, 413,
        431, 448, 465, 483, 500, 517, 534, 551, 569, 585,
        603, 620, 638, 654, 672, 689, 707, 723, 741, 758,
        775, 793, 810, 827, 844, 861, 878, 896, 913, 930,
        947, 965, 982, 999, 1016, 1033, 1051, 1068, 1085, 1102,
        1120, 1137, 1154, 1171, 1189, 1206, 1223, 1240, 1257, 1275,
        1292, 1309, 1326, 1343, 1361, 1378, 1395, 1413, 1430, 2894,
        2929, 2963, 2998, 3032, 3066, 3101, 3135, 3170, 3204, 3239,
        3273, 3307, 3341, 3376, 3410, 3446, 3480, 3514, 3548, 3583,
        3618, 3652, 3687, 3721, 3756, 3790, 3825, 3858, 3893, 3928,
        3962, 3996, 4031, 4065, 4100, 4134, 4169, 4203, 4237, 4272,
        4306, 4341, 4375, 4409, 4445, 4479, 4514, 4548, 4582, 4616,
        4651, 4686, 4720, 4754, 4789, 4823, 4858, 4892, 4927, 4961,
        4996, 5030, 5064, 5099, 5134, 5168, 5202, 5237, 5271, 5306,
        5340, 5375, 5409, 5444, 5478, 5512, 5547, 5581, 5616, 5650,
        5685, 5719, 5754, 5788, 5822, 5857, 5891, 5926, 5960, 5994,
        6029, 6063, 6098, 6132, 6167, 6201, 6236, 6270, 6305, 6339,
        6373, 6408, 6442, 6477, 6511, 6546, 6580, 6614, 6650, 6684,
        6718, 6752, 6787, 6821, 6856, 6890, 6925, 6959, 6994, 7029,
        7062, 7097, 7132, 7166, 7201, 7235, 7270, 7304, 7339, 7373,
        7407, 7441, 7476, 7511, 7545, 7580, 7614, 7648, 7683, 7717,
        7752, 7786, 7820, 7855, 7890, 7924, 7959, 7993, 8028, 8062,
        8097, 8131, 8165, 8200, 8234, 8268, 8303, 8337, 8371, 8406,
        8440, 8475, 8510, 8544, 8579, 8613, 8647, 8682, 8716, 8751,
        8786, 8820, 8855, 8889, 8923, 8958, 8992, 9026, 9061, 9095,
        9129, 9164, 9198, 9233, 9267, 9302, 9336, 9371, 9406, 9440,
        9474, 9509, 9543, 9578, 9612, 9646, 9681, 9715, 9750, 9785,
        9819, 9853, 9887, 9922, 9956, 9991, 10025, 10060, 10094, 10129,
        10164, 10197, 10232, 10267, 10301, 10336, 10370, 10405, 10439, 10474,
        10508, 10542, 10576, 10612, 10646, 10680, 10715, 10749, 10784, 10818,
        10853, 10887, 10921, 10956, 10990, 11025, 11059, 11094, 11128, 11163,
        11197, 11232, 11266, 11300, 11335, 11369, 11404, 11438, 11472, 11507,
        11541, 11576, 11610, 11645, 11679, 11714, 11748, 11782, 11817, 11851,
        11886, 11920, 11955, 11989, 12024, 12058, 12092, 12127, 12162, 12196,
        12230, 12265, 12299, 12334, 12368, 12403, 12437, 12472, 12506, 12540,
        12575, 12610, 12644, 12678, 12712, 12747, 12781, 12817, 12851, 12885,
        12920, 12954, 12989, 13023, 13057, 13092, 13126, 13161, 13195, 13230,
        13264, 13298, 13333, 13368, 13401, 13436, 13470, 13505, 13539, 13574,
        13608, 13643, 13678, 13712, 13746, 13780, 13816, 13850, 13885, 13919,
        13953, 13987, 14022, 14056, 14091, 14125, 14160, 14194, 14228, 14263,
        14297, 14332, 14366, 14401, 14436, 14470, 14504, 14539, 14574, 14608,
        14642, 14677, 14711, 14746, 14780, 14814, 14849, 14883, 14918, 14952,
        14987, 15021, 15056, 15090, 15125, 15159, 15194, 15228, 15262, 15296,
        15332, 15366, 15400, 15435, 15469, 15504, 15538, 15572, 15606, 15641,
        15676, 15710, 15744, 15779, 15813, 15848, 15882, 15917, 15951, 15985,
        16021, 16055, 16089, 16123, 16158, 16192, 16226, 16261, 16295, 16330,
        16365, 16399, 16434, 16468, 16502, 16537, 16571, 16606, 16640, 16675,
      ];
    }
    return rank;
  });