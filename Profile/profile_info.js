angular.module('darsein-profile', ['ngMaterial'])
  .controller('profilePageController', function() {
    this.openSection = null;
    this.toggle = function(section) {
      this.openSection = (this.openSection === section) ? null : section;
    }
    this.isOpen = function(section) {
      return this.openSection === section;
    }

    this.interests = [{
        category: '研究',
        topic: '離散構造に対する列挙・最適化アルゴリズム (特に組み合わせ、順列、グラフ)',
      },
      {
        category: '趣味',
        topic: '競技プログラミング',
      },
    ];

    this.education = [{
        degree: '博士',
        affiliation: '北海道大学大学院 情報科学研究科 情報理工学専攻',
        date: '2017年3月',
        done_flag: true,
      },
      {
        degree: '修士',
        affiliation: '北海道大学大学院 情報科学研究科 コンピュータサイエンス専攻',
        date: '2014年3月',
        done_flag: true,
      },
      {
        degree: '学士',
        affiliation: '北海道大学 工学部 情報エレクトロニクス学科',
        date: '2012年3月',
        done_flag: true,
      },
    ];

    this.publications = [{
        type: '査読付き学術論文',
        papers: [{
          title: '"Implicit Generation of Pattern-Avoiding Permutations by Using Permutation Decision Diagrams."',
          authors: 'Y. Inoue, T. Toda, and M. Minato.',
          journal: 'IEICE TRANSACTIONS on Fundamentals of Electronics, Communications and Computer Sciences, Vol.E97-A, No.6, pp.1171-1179, June 2014.',
          journal_link: 'https://www.jstage.jst.go.jp/browse/transfun/E97.A/6/_contents',
        }, ],
      },
      {
        type: '査読付き国際会議',
        papers: [{
            title: '"Using piDDs for Nearest Neighbor Optimization of Quantum Circuits." ',
            authors: 'Robert Wille, Nils Quetschlich, Yuma Inoue, Norihito Yasuda, and Shin-Ichi Minato. ',
            journal: 'Reversible Computation 2016.',
            journal_link: 'http://www.reversible-computation.org/2016/',
          },
          {
            title: 'Improved Algorithms for Debugging Problems on Erroneous Reversible Circuits." ',
            authors: 'Y. Inoue and S. Minato. ',
            journal: 'Reversible Computation 2015.',
            journal_link: 'http://www.reversible-computation.org/2015/',
          },
          {
            title: '"Enumerating Eulerian Trails via Hamiltonian Path Enumeration." ',
            authors: 'H. Hanada, S. Denzumi, Y. Inoue, H. Aoki, N. Yasuda, S. Takeuchi, and S. Minato. ',
            journal: 'WALCOM2015.',
            journal_link: 'http://cse.buet.ac.bd/walcom2015/',
          },
          {
            title: '"An Efficient Method for Indexing All Topological Orders of a Directed Graph."',
            authors: 'Y. Inoue and S. Minato. ',
            journal: 'ISAAC 2014.',
            journal_link: 'http://tcs.postech.ac.kr/isaac2014/',
          },
          {
            title: '"Generating Permutations under Pattern Occurrence Constraints Using PiDDs." ',
            authors: 'Y. Inoue, T. Toda, and S. Minato. ',
            journal: 'ALSIP 2014.',
            journal_link: 'http://www-erato.ist.hokudai.ac.jp/alsip2014/',
          },
        ],
      },
      {
        type: '査読なし国際ワークショップ',
        papers: [{
            title: '"Conjectures on strong Wilf-equivalence by decision diagram-based enumeration."',
            authors: 'Y. Inoue and S. Minato. ',
            journal: 'Permutation Patterns 2015.',
            journal_link: 'https://sites.google.com/site/pp2015london/',
          },
          {
            title: '"Efficiently generating classical and vincular pattern avoiding permutations based on permutation decision diagrams." ',
            authors: 'Y. Inoue, T. Toda, and S. Minato. ',
            journal: 'Permutation Patterns 2013.',
            journal_link: 'http://www.lix.polytechnique.fr/pp2013/',
          },
        ],
      },
      {
        type: '査読なし国内学会',
        papers: [{
            title: '"複数の順列に共通して現れるパターンの列挙法."',
            authors: '井上 祐馬, 湊 真一.',
            journal: '情報処理学会 第79回全国大会 (IPSJ), 2017年3月',
            journal_link: 'http://www.ipsj.or.jp/event/taikai/79/',
          },
          {
            title: '"順列のサイクルタイプ同値類分割に対する順列決定グラフの適用."',
            authors: '井上 祐馬, 湊 真一.',
            journal: '人工知能学会 第101回 人工知能基本問題研究会 (SIG-FPAI), 2016年8月',
            journal_link: 'http://www.ar.sanken.osaka-u.ac.jp/~sigfpai/past/fpai101.html',
          },
          {
            title: '"グラフの部分構造を列挙するZDD構築のための変数順序付けヒューリスティクス."',
            authors: '井上 祐馬, 鈴木 浩史, 伊藤 華, 湊 真一.',
            journal: '人工知能学会全国大会 (JSAI), 2016年6月',
            journal_link: 'http://www.ai-gakkai.or.jp/jsai2016/',
          },
          {
            title: '"ZDD のトップダウン構築における変数順序付け法の実験と考察."',
            authors: '伊藤 華, 井上 祐馬, 湊 真一.',
            journal: '情報技術フォーラム (FIT), 2015年9月',
            journal_link: 'http://www.ipsj.or.jp/event/fit/fit2015/',
          },
          {
            title: '"MEET 演算を用いた組合せ集合間の類似度の定義と応用."',
            authors: '竹内 文登, 鈴木 浩史, 白石 恒介, 井上 祐馬, 湊 真一.',
            journal: '情報技術フォーラム (FIT), 2015年9月',
            journal_link: 'http://www.ipsj.or.jp/event/fit/fit2015/',
          },
          {
            title: '"(依頼講演) 問題の性質を考慮した分解法に基づく決定グラフの選択."',
            authors: '井上 祐馬, 湊 真一.',
            journal: '電子情報通信学会 総合大会 (IEICE) COMP-ELC 学生シンポジウム, 2015年3月',
            journal_link: 'https://www.gakkai-web.net/gakkai/ieice/G_2015/',
          },
          {
            title: '"順列決定グラフ (πDD) を用いたオイラー路の高速な列挙索引化."',
            authors: '井上 祐馬, 湊 真一.',
            journal: '電子情報通信学会 コンピュテーション研究会, 2014年10月.',
            journal_link: 'http://www.ieice.org/ken/program/index.php?tgs_regid=4e328343fa3ebb694b04c01a25c4ad7f3847282d137091ff13cad82fbb596a64&tgid=IEICE-COMP&lang=',
          },
          {
            title: '"順列二分決定グラフを用いたパターン回避順列の列挙索引化."',
            authors: '井上 祐馬, 戸田 貴久, 湊 真一.',
            journal: '情報処理学会 第143回アルゴリズム研究会, 2013年3月.',
            journal_link: 'http://www.ipsj-sigal.or.jp/prog24/prog143.html',
          },
          {
            title: '"πDDの順列集合演算を用いたパンケーキ整列問題の解析法."',
            authors: '井上 祐馬, 湊 真一.',
            journal: '電子情報通信学会 総合大会 (IEICE) COMP 学生シンポジウム, 2012年3月.',
            journal_link: 'http://www.ieice.org/jpn/event/program/2012G/index.html',
          },
        ],
      },
    ];

    this.awards = [{
        title: '人工知能学会 全国大会優秀賞',
        date: '2016',
      },
      {
        title: '北海道大学大学院 情報科学研究科 コンピュータサイエンス専攻 専攻長賞',
        date: '2014',
      },
    ];

    this.career = [{
        type: '企業',
        jobs: [{
          title: 'グーグル合同会社',
          link: 'https://www.google.co.jp/about/',
          start_date: '2017',
          end_date: '',
        }, ],
      },
      {
        type: 'インターンシップ',
        jobs: [{
            title: 'リクルートホールディングス グローバルエンジニアインターンシップ',
            link: '',
            date: '2015',
          },
          {
            title: 'サイバーエージェント テクノロジーキャンプ',
            link: '',
            date: '2012',
          },
        ],
      },
      {
        type: '奨励',
        jobs: [{
          title: '特別研究員 (DC2)',
          link: 'http://www.jsps.go.jp/j-pd/index.html',
          start_date: '2015',
          end_date: '2017',
        }, ],
      },
      {
        type: 'RA',
        jobs: [{
            title: '北海道大学大学院情報科学研究科 基盤(S) 離散構造処理系プロジェクト',
            link: 'http://www-erato.ist.hokudai.ac.jp/',
            start_date: '2016',
            end_date: '2017',
          },
          {
            title: 'ERATO湊離散構造処理系プロジェクト',
            link: 'http://www-erato.ist.hokudai.ac.jp/',
            start_date: '2011',
            end_date: '2016',
          },
        ],
      },
      {
        type: 'TA',
        jobs: [{
            title: 'コンピュータサイエンス実験 II ',
            link: '',
            date: '2015',
          },
          {
            title: '計算理論',
            link: '',
            start_date: '2014',
            end_date: '2015',
          },
          {
            title: '情報エレクトロニクス演習',
            link: '',
            date: '2012',
          },
        ],
      },
    ];

    this.activities = [{
        event: '人工知能学会',
        event_link: 'http://www.ai-gakkai.or.jp/',
        title: '全国大会 学生企画 PC 委員',
        date: '2015-2016',
      },
      {
        event: 'CODE FESTIVAL 2015',
        event_link: 'http://recruit-jinji.jp/code_fes2015/',
        title: '運営サポーター',
        date: '2015',
      },
      {
        event: 'ACM-ICPC OB/OG の会 ',
        event_link: 'http://acm-icpc.aitea.net/',
        title: 'コンテスト運営マネージャー',
        date: '2014-2016',
      },
    ];

  });
