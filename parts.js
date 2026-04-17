// 解剖パーツのメタデータ (ID, 日本語名, 英語名, 系統, 解説)
// anatomy.js 側で mesh.userData.partId = 'xxx' を設定し、クリック時にここから情報を引く。

export const PARTS = {
  // === 骨格系 ===
  cranium: {
    ja: '頭蓋骨', en: 'Cranium', system: 'skeleton',
    description: '脳を保護する球状の骨の集合体。約 22 個の骨が縫合で結合しており、眼窩や鼻腔などの空間を形成する。'
  },
  spine: {
    ja: '脊椎 (背骨)', en: 'Vertebral Column', system: 'skeleton',
    description: '頸椎 7・胸椎 12・腰椎 5・仙骨・尾骨からなる体の支柱。脊髄を保護し、体幹の運動と衝撃吸収を担う。'
  },
  clavicle_l: {
    ja: '鎖骨 (左)', en: 'Left Clavicle', system: 'skeleton',
    description: '胸骨と肩甲骨を連結する S 字状の骨。肩の可動域を広げ、上肢を体幹から離して動かす役割を持つ。'
  },
  clavicle_r: {
    ja: '鎖骨 (右)', en: 'Right Clavicle', system: 'skeleton',
    description: '胸骨と肩甲骨を連結する S 字状の骨。肩の可動域を広げ、上肢を体幹から離して動かす役割を持つ。'
  },
  ribcage: {
    ja: '胸郭 (肋骨)', en: 'Rib Cage', system: 'skeleton',
    description: '12 対の肋骨・胸骨・胸椎で構成される籠状構造。心臓や肺などの重要臓器を保護し、呼吸運動を可能にする。'
  },
  pelvis: {
    ja: '骨盤', en: 'Pelvis', system: 'skeleton',
    description: '寛骨・仙骨・尾骨からなる輪状構造。上半身の重みを下肢へ伝え、生殖器や膀胱など下腹部臓器を支える。'
  },
  humerus_l: {
    ja: '上腕骨 (左)', en: 'Left Humerus', system: 'skeleton',
    description: '肩関節から肘関節までを結ぶ上肢最大の骨。球状の頭部が肩甲骨と肩関節を形成する。'
  },
  humerus_r: {
    ja: '上腕骨 (右)', en: 'Right Humerus', system: 'skeleton',
    description: '肩関節から肘関節までを結ぶ上肢最大の骨。球状の頭部が肩甲骨と肩関節を形成する。'
  },
  forearm_l: {
    ja: '前腕骨 (左)', en: 'Left Radius/Ulna', system: 'skeleton',
    description: '橈骨と尺骨の 2 本からなる。両骨の回旋により前腕の回内・回外運動が生じる。'
  },
  forearm_r: {
    ja: '前腕骨 (右)', en: 'Right Radius/Ulna', system: 'skeleton',
    description: '橈骨と尺骨の 2 本からなる。両骨の回旋により前腕の回内・回外運動が生じる。'
  },
  femur_l: {
    ja: '大腿骨 (左)', en: 'Left Femur', system: 'skeleton',
    description: '人体で最も長く強い骨。股関節と膝関節の間を結び、直立歩行の荷重を支える。'
  },
  femur_r: {
    ja: '大腿骨 (右)', en: 'Right Femur', system: 'skeleton',
    description: '人体で最も長く強い骨。股関節と膝関節の間を結び、直立歩行の荷重を支える。'
  },
  tibia_l: {
    ja: '脛骨 (左)', en: 'Left Tibia', system: 'skeleton',
    description: '下腿の内側にある太い骨。体重の大部分を踝 (くるぶし) を経由して足へ伝える。'
  },
  tibia_r: {
    ja: '脛骨 (右)', en: 'Right Tibia', system: 'skeleton',
    description: '下腿の内側にある太い骨。体重の大部分を踝 (くるぶし) を経由して足へ伝える。'
  },

  // === 内臓系 ===
  brain: {
    ja: '脳', en: 'Brain', system: 'organ',
    description: '中枢神経系の中核。大脳・小脳・脳幹からなり、思考・感覚・運動・自律機能を統合制御する。'
  },
  heart: {
    ja: '心臓', en: 'Heart', system: 'organ',
    description: '全身に血液を循環させる筋性ポンプ。胸腔中央やや左に位置し、4 つの部屋 (心房 2・心室 2) を持つ。'
  },
  lung_l: {
    ja: '肺 (左)', en: 'Left Lung', system: 'organ',
    description: '左肺は 2 葉。酸素を取り込み二酸化炭素を排出するガス交換を肺胞で行う。心臓の分だけ右肺より小さい。'
  },
  lung_r: {
    ja: '肺 (右)', en: 'Right Lung', system: 'organ',
    description: '右肺は 3 葉。酸素を取り込み二酸化炭素を排出するガス交換を肺胞で行う。'
  },
  liver: {
    ja: '肝臓', en: 'Liver', system: 'organ',
    description: '右上腹部にある人体最大の内臓。代謝・解毒・胆汁生成・栄養素貯蔵など 500 以上の機能を担う。'
  },
  stomach: {
    ja: '胃', en: 'Stomach', system: 'organ',
    description: '食道と十二指腸の間にある袋状の消化器。胃酸と酵素で食物を分解し、蠕動運動で攪拌する。'
  },
  kidney_l: {
    ja: '腎臓 (左)', en: 'Left Kidney', system: 'organ',
    description: '腰背部に 1 対あるそら豆型の臓器。血液を濾過して老廃物を尿として排出し、体液バランスを調節する。'
  },
  kidney_r: {
    ja: '腎臓 (右)', en: 'Right Kidney', system: 'organ',
    description: '腰背部に 1 対あるそら豆型の臓器。血液を濾過して老廃物を尿として排出し、体液バランスを調節する。'
  },
  intestines: {
    ja: '腸 (小腸・大腸)', en: 'Intestines', system: 'organ',
    description: '腹腔の中央を占める消化管。小腸で栄養を吸収し、大腸で水分吸収と便形成を行う。全長は約 8 m。'
  },

  // === 筋肉系 ===
  pectoralis_l: {
    ja: '大胸筋 (左)', en: 'Left Pectoralis Major', system: 'muscle',
    description: '胸の前面を覆う扇状の筋。上腕の内転・屈曲・内旋に働き、押す動作の主動筋となる。'
  },
  pectoralis_r: {
    ja: '大胸筋 (右)', en: 'Right Pectoralis Major', system: 'muscle',
    description: '胸の前面を覆う扇状の筋。上腕の内転・屈曲・内旋に働き、押す動作の主動筋となる。'
  },
  deltoid_l: {
    ja: '三角筋 (左)', en: 'Left Deltoid', system: 'muscle',
    description: '肩を覆うように走る三角形の筋。前・中・後の 3 部に分かれ、肩関節の外転・屈曲・伸展を担う。'
  },
  deltoid_r: {
    ja: '三角筋 (右)', en: 'Right Deltoid', system: 'muscle',
    description: '肩を覆うように走る三角形の筋。前・中・後の 3 部に分かれ、肩関節の外転・屈曲・伸展を担う。'
  },
  biceps_l: {
    ja: '上腕二頭筋 (左)', en: 'Left Biceps Brachii', system: 'muscle',
    description: '上腕前面の 2 頭筋。肘関節の屈曲と前腕の回外に働く。いわゆる「力こぶ」をつくる筋。'
  },
  biceps_r: {
    ja: '上腕二頭筋 (右)', en: 'Right Biceps Brachii', system: 'muscle',
    description: '上腕前面の 2 頭筋。肘関節の屈曲と前腕の回外に働く。いわゆる「力こぶ」をつくる筋。'
  },
  rectus_abdominis: {
    ja: '腹直筋', en: 'Rectus Abdominis', system: 'muscle',
    description: '腹部前面を縦走する長い筋。体幹の屈曲に働き、腱画 (けんかく) により「シックスパック」として見える。'
  },
  quadriceps_l: {
    ja: '大腿四頭筋 (左)', en: 'Left Quadriceps', system: 'muscle',
    description: '大腿前面を占める 4 頭の筋群 (大腿直筋・内側広筋・外側広筋・中間広筋)。膝関節の伸展を担う。'
  },
  quadriceps_r: {
    ja: '大腿四頭筋 (右)', en: 'Right Quadriceps', system: 'muscle',
    description: '大腿前面を占める 4 頭の筋群 (大腿直筋・内側広筋・外側広筋・中間広筋)。膝関節の伸展を担う。'
  },
  gastrocnemius_l: {
    ja: '下腿三頭筋 (左)', en: 'Left Gastrocnemius', system: 'muscle',
    description: 'ふくらはぎを形成する筋。足関節の底屈 (つま先を下げる動作) に働き、歩行や跳躍で大きな力を発揮する。'
  },
  gastrocnemius_r: {
    ja: '下腿三頭筋 (右)', en: 'Right Gastrocnemius', system: 'muscle',
    description: 'ふくらはぎを形成する筋。足関節の底屈 (つま先を下げる動作) に働き、歩行や跳躍で大きな力を発揮する。'
  },
};

export const SYSTEM_LABELS = {
  skeleton: '骨格系',
  organ:    '内臓系',
  muscle:   '筋肉系',
  skin:     '皮膚',
};
