// 自動生成: Write About the Photo のシーン（写真キーワード＋DET110模範解答＋和訳＋表現Tips）
export interface PhotoScene {
  key: string;
  keyword: string;
  theme: string;
  modelAnswer: string;
  modelAnswerJa: string;
  tips: { term: string; ja: string }[];
}

export const WRITE_PHOTO_PROMPT =
  "Write about the photo. Describe what you see in detail — the people, the place, and what is happening.";

// DET の Write About the Photo は制限時間 1 分
export const PHOTO_TIME_LIMIT_SEC = 60;

export const PHOTO_SCENES: PhotoScene[] = [
  {
    "key": "airport",
    "keyword": "airport,travelers",
    "theme": "空港・旅行者",
    "modelAnswer": "This photo shows a busy airport terminal crowded with travelers. In the foreground, a group of people are waiting in line at the check-in counter, and several of them are pulling wheeled suitcases. A woman holding a boarding pass appears to be checking the departure board for her gate. Through the large windows behind them, an airplane can be seen parked on the runway. Despite the crowd, the scene looks orderly, suggesting that everyone is patiently waiting to board their flights.",
    "tips": [
      {
        "term": "terminal",
        "ja": "(空港の)ターミナル、旅客棟。a busy/crowded terminal の形で使う"
      },
      {
        "term": "check-in counter",
        "ja": "搭乗手続きカウンター。wait in line at the check-in counter(カウンターに並ぶ)"
      },
      {
        "term": "departure board",
        "ja": "出発便案内板。check the departure board for one's gate のように使う"
      },
      {
        "term": "wheeled suitcase / luggage",
        "ja": "キャスター付きスーツケース・荷物。pull/carry one's luggage"
      },
      {
        "term": "boarding pass",
        "ja": "搭乗券。hold/show a boarding pass"
      },
      {
        "term": "board a flight",
        "ja": "搭乗する、飛行機に乗り込む。waiting to board their flights(搭乗を待っている)"
      }
    ],
    "modelAnswerJa": "この写真には、旅行者でにぎわう空港のターミナルが写っている。手前では、人々がチェックインカウンターに列を作って並んでおり、その何人かはキャスター付きのスーツケースを引いている。搭乗券を手にした女性は、自分のゲートを確かめようと出発案内の掲示板に目をやっているようだ。彼らの背後にある大きな窓越しには、滑走路に停まっている飛行機が見える。混雑しているにもかかわらず、その光景は秩序立っており、誰もが自分の便の搭乗を辛抱強く待っている様子がうかがえる。"
  },
  {
    "key": "bakery",
    "keyword": "bakery,bread",
    "theme": "パン屋の店内",
    "modelAnswer": "This photo shows the inside of a cozy bakery, where freshly baked bread is arranged neatly along the wooden shelves. Behind the glass counter, a baker wearing an apron is serving a customer, while a group of people wait in line to place their orders. The warm lighting makes the loaves of bread, pastries, and cookies look especially appetizing. On the right, a chalkboard menu lists the prices of various items. Overall, it seems like a busy morning at a small neighborhood bakery.",
    "tips": [
      {
        "term": "freshly baked",
        "ja": "焼きたての（bread/pastries を修飾する形容詞句）"
      },
      {
        "term": "loaves of bread",
        "ja": "（パンの）塊・ひと斤。loaf の複数形が loaves"
      },
      {
        "term": "be arranged/displayed on the shelves",
        "ja": "棚に並べられている・陳列されている（受動態で配置を描写）"
      },
      {
        "term": "glass counter / display case",
        "ja": "ガラスのカウンター・陳列ケース（商品を見せる什器）"
      },
      {
        "term": "wearing an apron",
        "ja": "エプロンを身につけて（分詞句で人物の服装を描写）"
      },
      {
        "term": "wait in line to place an order",
        "ja": "注文するために列に並んで待つ（客の行動を表す定番表現）"
      }
    ],
    "modelAnswerJa": "この写真は、居心地のよいパン屋の店内を写したものである。焼きたてのパンが木製の棚に沿ってきれいに並べられている。ガラスのカウンターの奥では、エプロンを着けたパン職人が客の対応をしており、その一方で、数人の客が注文をしようと列に並んで待っている。暖かみのある照明のおかげで、パンやペストリー、クッキーがとりわけおいしそうに見える。右側には黒板のメニューがあり、さまざまな商品の値段が書かれている。全体として、近所の小さなパン屋のにぎやかな朝の様子のようだ。"
  },
  {
    "key": "beach",
    "keyword": "beach,people",
    "theme": "海辺で過ごす人々",
    "modelAnswer": "This photo was taken on a sandy beach on a bright summer day. In the foreground, a group of people are relaxing under colorful umbrellas, while a few children are building sandcastles near the water. Several swimmers can be seen splashing in the waves, and a couple are strolling along the shore, enjoying the warm sunshine. Behind them, the calm blue sea stretches toward the horizon, where small boats are floating. Judging by their cheerful expressions, everyone seems to be having a wonderful time by the seaside.",
    "tips": [
      {
        "term": "in the foreground / in the background",
        "ja": "写真の手前に／奥に。位置を示す前置詞句で描写の幅が出る"
      },
      {
        "term": "stretch toward the horizon",
        "ja": "水平線へと広がる。海や砂浜の広がりを描く定番表現"
      },
      {
        "term": "relax under a beach umbrella",
        "ja": "ビーチパラソルの下でくつろぐ。海辺の人物の動作描写に便利"
      },
      {
        "term": "stroll along the shore",
        "ja": "浜辺をのんびり歩く。strollは「ぶらぶら歩く」のニュアンス"
      },
      {
        "term": "splash in the waves",
        "ja": "波の中で水しぶきを上げる／はしゃぐ。海で遊ぶ様子を表す"
      },
      {
        "term": "judging by their expressions",
        "ja": "表情から判断すると。写真から推測を述べる際の高得点フレーズ"
      }
    ],
    "modelAnswerJa": "この写真は、よく晴れた夏の日に砂浜で撮影されたものだ。手前では、大勢の人々が色とりどりのパラソルの下でくつろいでおり、数人の子どもたちが水際で砂のお城を作っている。波の中で水しぶきを上げながらはしゃぐ泳いでいる人たちの姿も見え、一組のカップルが暖かな日差しを楽しみながら浜辺をのんびり歩いている。その向こうには、穏やかで青い海が水平線へと広がり、そこには小さなボートが浮かんでいる。みんなの楽しそうな表情から判断すると、誰もが海辺で素晴らしいひとときを過ごしているようだ。"
  },
  {
    "key": "cafe",
    "keyword": "cafe,coffee,people",
    "theme": "カフェで過ごす人々",
    "modelAnswer": "This photo shows a cozy café where a group of people are enjoying their afternoon. In the foreground, a young woman sitting by the window is sipping coffee while scrolling through her phone. Behind the counter, a barista is busy preparing drinks for the customers waiting in line. Two friends seated at a wooden table appear to be chatting and laughing over their lattes. The warm lighting and relaxed atmosphere make the place look like a perfect spot to unwind.",
    "tips": [
      {
        "term": "barista",
        "ja": "(カフェの)バリスタ、コーヒーを淹れる店員。写真の従業員を指すのに便利"
      },
      {
        "term": "sip coffee",
        "ja": "コーヒーを少しずつ飲む/すする。drink より描写的で自然"
      },
      {
        "term": "cozy / relaxed atmosphere",
        "ja": "居心地のよい/くつろいだ雰囲気。店内の様子を表す定番表現"
      },
      {
        "term": "in the foreground / in the background",
        "ja": "前景に/背景に。写真内の位置関係を示す描写の必須フレーズ"
      },
      {
        "term": "chat (and laugh) over coffee/lattes",
        "ja": "コーヒーを飲みながらおしゃべりする。over+飲食物で「~しながら」"
      },
      {
        "term": "a perfect spot to unwind",
        "ja": "くつろぐのにぴったりの場所。締めの一文で雰囲気をまとめるのに有用"
      }
    ],
    "modelAnswerJa": "この写真には、人々のグループが午後のひとときを楽しんでいる、居心地のよいカフェが写っている。手前では、窓際に座った若い女性が、スマートフォンをスクロールしながらコーヒーを飲んでいる。カウンターの奥では、バリスタが列に並んで待つ客のために忙しく飲み物を用意している。木製のテーブルに着いた二人の友人は、ラテを飲みながらおしゃべりをして笑い合っているようだ。暖かな照明とくつろいだ雰囲気が、この店をひと息つくのにぴったりの場所に見せている。"
  },
  {
    "key": "city-street",
    "keyword": "city,street,crowd",
    "theme": "にぎやかな街の通り",
    "modelAnswer": "This photo shows a busy city street crowded with people during what appears to be rush hour. Lined with tall buildings and shops, the street is filled with pedestrians who are walking quickly along the sidewalks. In the background, several cars and buses move slowly through heavy traffic. A group of people seems to be waiting to cross at an intersection, while bright signs and advertisements light up the scene. The lively atmosphere suggests that this is a major commercial area in the heart of a large city.",
    "tips": [
      {
        "term": "bustling / busy street",
        "ja": "にぎやかで活気のある通り。bustling は busy より「人で混み合う」ニュアンスが強い"
      },
      {
        "term": "pedestrians",
        "ja": "歩行者。crowd を具体化する語。a group of pedestrians のように使う"
      },
      {
        "term": "lined with ~",
        "ja": "(通りなどが)~で立ち並んでいる。The street is lined with shops/tall buildings"
      },
      {
        "term": "rush hour",
        "ja": "ラッシュアワー。混雑の理由を説明でき、during rush hour で時間帯を示せる"
      },
      {
        "term": "heavy traffic",
        "ja": "激しい交通量・渋滞。move slowly through heavy traffic などで描写"
      },
      {
        "term": "lively atmosphere",
        "ja": "活気のある雰囲気。写真全体の印象をまとめる締めの表現に便利"
      }
    ],
    "modelAnswerJa": "この写真には、ラッシュアワーと思われる時間帯に、大勢の人でにぎわう混雑した街の通りが写っている。通りの両側には高層ビルや店が立ち並び、歩道では多くの歩行者が足早に歩いている。背景では、何台もの車やバスが激しい渋滞の中をゆっくりと進んでいる。交差点では一団の人々が横断するのを待っているように見え、明るい看板や広告がこの場面を照らし出している。こうした活気あふれる雰囲気から、ここが大都市の中心にある主要な商業地区であることがうかがえる。"
  },
  {
    "key": "classroom",
    "keyword": "classroom,students",
    "theme": "教室の授業風景",
    "modelAnswer": "This photo shows a group of students sitting at their desks in a brightly lit classroom. At the front of the room, a teacher is standing beside a whiteboard, explaining something to the class. Most of the students appear to be paying close attention, while a few are taking notes in their notebooks. There are posters and educational charts hanging on the walls behind them. The atmosphere looks focused and engaged, as if an important lesson is taking place.",
    "tips": [
      {
        "term": "pay attention (to)",
        "ja": "(〜に)注意を払う、集中して聞く。授業を聞く生徒の様子に。例: students paying attention to the lesson"
      },
      {
        "term": "take notes",
        "ja": "メモを取る、ノートを取る。授業中の生徒の動作を描写するのに便利"
      },
      {
        "term": "stand beside / in front of the whiteboard",
        "ja": "ホワイトボードのそばに/前に立つ。教師の位置を示す前置詞句"
      },
      {
        "term": "be seated at one's desk",
        "ja": "机に座っている。sit at a desk のやや丁寧な言い方で表現に幅が出る"
      },
      {
        "term": "a focused and engaged atmosphere",
        "ja": "集中して熱心に取り組む雰囲気。教室全体の様子をまとめる表現"
      },
      {
        "term": "hang on the wall",
        "ja": "壁に掛かっている。ポスターや掲示物など背景を描写する定番表現"
      }
    ],
    "modelAnswerJa": "この写真には、明るく照らされた教室で自分の机に着席している生徒たちのグループが写っている。教室の前方では、教師がホワイトボードのそばに立ち、クラスに向かって何かを説明している。ほとんどの生徒は熱心に耳を傾けているように見え、数人はノートにメモを取っている。彼らの背後の壁には、ポスターや学習用の図表が貼られている。まるで大切な授業が行われているかのように、教室は集中して熱心に取り組んでいる雰囲気に包まれている。"
  },
  {
    "key": "concert",
    "keyword": "concert,crowd",
    "theme": "コンサート・ライブ会場",
    "modelAnswer": "This photo shows a large crowd gathered at an outdoor concert. On a brightly lit stage, a band is performing while colorful lights sweep across the venue. Many fans, raising their hands and holding up their phones, seem completely caught up in the music. Behind them, a huge screen displays the singer, allowing people at the back to see clearly. Judging by their cheerful expressions, the audience is thoroughly enjoying this lively and unforgettable evening.",
    "tips": [
      {
        "term": "a large crowd gathered at",
        "ja": "〜に集まった大勢の観客・人だかり。会場の人混みを描写する定番表現"
      },
      {
        "term": "perform on stage",
        "ja": "ステージで演奏する・パフォーマンスする。band/singer を主語にして使う"
      },
      {
        "term": "be caught up in the music",
        "ja": "音楽に夢中になっている・のめり込んでいる。観客の没入感を表す熟語"
      },
      {
        "term": "raise one's hands / hold up phones",
        "ja": "両手を上げる・スマホを掲げる。ライブ会場での観客の典型的な動作"
      },
      {
        "term": "colorful lights sweep across",
        "ja": "色とりどりの照明が〜を駆け巡る。ステージ演出の臨場感を出す表現"
      },
      {
        "term": "the audience",
        "ja": "観客（集合名詞）。crowd と言い換えて繰り返しを避けられる"
      }
    ],
    "modelAnswerJa": "この写真には、野外コンサートに集まった大勢の観客が写っている。明るく照らされたステージでは、バンドが演奏し、色とりどりのライトが会場を走るように動いている。多くのファンが手を上げ、スマートフォンをかざしながら、すっかり音楽に夢中になっているようだ。その後方には巨大なスクリーンが設置され、歌手の姿が映し出されているので、後ろのほうにいる人たちもはっきりと見ることができる。楽しそうな表情から判断すると、観客はこの活気にあふれた忘れられない夜を心から楽しんでいる。"
  },
  {
    "key": "construction",
    "keyword": "construction,workers",
    "theme": "建設現場の作業員",
    "modelAnswer": "In this picture, a group of construction workers is busy at a building site. Most of them are wearing hard hats and bright safety vests to protect themselves from injury. One worker, who is standing on scaffolding, appears to be operating a piece of heavy machinery, while two others are carrying materials nearby. In the background, a half-finished building rises against a cloudy sky. Although the work looks tiring and dangerous, everyone seems focused on completing the project on time.",
    "tips": [
      {
        "term": "construction site / building site",
        "ja": "建設現場。写真の場所を一語で示す定番表現"
      },
      {
        "term": "hard hat",
        "ja": "ヘルメット(安全帽)。作業員が頭を守るためにかぶる"
      },
      {
        "term": "safety vest",
        "ja": "安全ベスト。高視認性の蛍光色ベスト。high-visibility vest とも言う"
      },
      {
        "term": "scaffolding",
        "ja": "足場。建物の周りに組まれた金属の作業台(不可算名詞)"
      },
      {
        "term": "heavy machinery / equipment",
        "ja": "重機・大型設備。クレーンやショベルなどをまとめて指す不可算名詞"
      },
      {
        "term": "be busy doing / be focused on",
        "ja": "～するのに忙しい/～に集中している。人物の動作や様子を描写するのに便利"
      }
    ],
    "modelAnswerJa": "この写真では、建設作業員の一団が建設現場で忙しく働いている。そのほとんどが、けがから身を守るためにヘルメットと明るい色の安全ベストを身につけている。足場の上に立っている一人の作業員は、大型の重機を操作しているように見え、その近くでは別の二人が資材を運んでいる。背景では、半分ほど出来上がった建物が曇り空を背にそびえ立っている。作業は大変そうで危険にも見えるが、全員が予定どおりに工事を終わらせようと集中している様子だ。"
  },
  {
    "key": "gardening",
    "keyword": "garden,gardening",
    "theme": "庭でガーデニングをする様子",
    "modelAnswer": "In this picture, a group of people are working in a lush green garden on a sunny afternoon. Kneeling on the soft soil, a woman wearing gloves is carefully planting flowers in a freshly dug flower bed. Beside her, a man is watering the plants with a hose, while a young child holds a small bucket of tools. Surrounded by colorful blossoms and leafy bushes, they all seem relaxed and happy to be spending time outdoors together. Gardening like this is a wonderful way to enjoy nature and stay active.",
    "tips": [
      {
        "term": "flower bed",
        "ja": "花壇。庭の植え込みスペースを指す名詞句"
      },
      {
        "term": "kneel on the soil",
        "ja": "土の上にひざをつく。作業姿勢の描写に便利(過去形は knelt / kneeled)"
      },
      {
        "term": "water the plants (with a hose)",
        "ja": "(ホースで)植物に水をやる。water は動詞"
      },
      {
        "term": "plant flowers / seeds",
        "ja": "花や種を植える。ガーデニング描写の中心となる動詞"
      },
      {
        "term": "lush green",
        "ja": "青々と茂った。植物が生い茂る様子を表す形容表現"
      },
      {
        "term": "wearing gloves",
        "ja": "手袋をはめて。分詞句で人物の装備を簡潔に描写"
      }
    ],
    "modelAnswerJa": "この写真では、晴れた午後に、数人が緑豊かな庭で作業をしている。手袋をはめた女性が柔らかい土の上にひざをつき、掘り返したばかりの花壇に丁寧に花を植えている。そのそばでは、男性がホースで植物に水をやっており、幼い子どもは道具の入った小さなバケツを持っている。色とりどりの花や葉の茂った低木に囲まれて、みんなくつろいだ様子で、一緒に屋外で過ごす時間を楽しんでいるように見える。このようなガーデニングは、自然を満喫しながら体を動かすのにうってつけの方法だ。"
  },
  {
    "key": "gym",
    "keyword": "gym,workout",
    "theme": "ジムで運動する人々",
    "modelAnswer": "This photo shows a busy gym where a group of people are working out. In the foreground, a young man is lifting a heavy barbell while a trainer stands beside him. To the right, several women are running on treadmills, looking focused and determined. The walls are lined with mirrors, which make the room appear larger and brighter. Everyone is wearing comfortable sportswear and seems committed to staying fit and healthy.",
    "tips": [
      {
        "term": "work out / a workout",
        "ja": "運動する(動詞 work out)／トレーニング(名詞 a workout)。ジム描写の中心語"
      },
      {
        "term": "lift weights / lift a barbell",
        "ja": "ウェイト(重り)を持ち上げる、バーベルを持ち上げる。筋トレを表す定番表現。dumbbell(ダンベル)も使える"
      },
      {
        "term": "run on a treadmill",
        "ja": "ランニングマシンで走る。treadmill=ジムの走行器具"
      },
      {
        "term": "in the foreground / in the background",
        "ja": "手前に／奥に。写真内の位置を説明する前置詞句で構図描写に必須"
      },
      {
        "term": "sportswear / workout clothes",
        "ja": "運動着・スポーツウェア。人物の服装を一般化して描写できる"
      },
      {
        "term": "stay fit and healthy",
        "ja": "健康で体型を維持する。運動の目的を示す締めの表現として便利"
      }
    ],
    "modelAnswerJa": "この写真は、大勢の人がトレーニングをしている賑やかなジムを写している。手前では若い男性が重いバーベルを持ち上げ、そのそばにトレーナーが立っている。右側では数人の女性がトレッドミルの上を走り、集中した真剣な表情を浮かべている。壁一面に鏡が並び、そのおかげで室内が実際より広く明るく見える。全員が動きやすいスポーツウェアを着ていて、健康と体力を維持することに真剣に取り組んでいる様子だ。"
  },
  {
    "key": "hiking",
    "keyword": "mountain,hiking",
    "theme": "山でハイキングする人々",
    "modelAnswer": "In this photo, a group of people are hiking along a narrow trail that winds up a steep mountain. Surrounded by towering peaks and lush green slopes, the hikers carry backpacks and walking poles to help them keep their balance. One person, who is leading the way, pauses to admire the breathtaking scenery in the distance. Although the climb looks challenging, everyone seems cheerful and full of energy. The clear blue sky suggests that it is a perfect day for an outdoor adventure.",
    "tips": [
      {
        "term": "hike along a trail",
        "ja": "登山道を(歩いて)進む。trail=登山道・小道"
      },
      {
        "term": "a winding / narrow path",
        "ja": "曲がりくねった/細い道。地形描写に便利"
      },
      {
        "term": "towering peaks",
        "ja": "そびえ立つ山頂。背景の山々を表す表現"
      },
      {
        "term": "carry a backpack / walking poles",
        "ja": "リュック/トレッキングポールを持って歩く"
      },
      {
        "term": "breathtaking scenery",
        "ja": "息をのむほど美しい景色。景観をほめる定番語"
      },
      {
        "term": "be surrounded by",
        "ja": "〜に囲まれている。分詞構文(Surrounded by ...)で文頭にも使える"
      }
    ],
    "modelAnswerJa": "この写真では、数人のグループが、険しい山をうねうねと登っていく細い登山道を歩いている。そびえ立つ山々と青々と茂った緑の斜面に囲まれて、ハイカーたちはバランスを保つのに役立てるためリュックサックとトレッキングポールを身につけている。先頭を歩く一人は、立ち止まって遠くに広がる息をのむような景色に見入っている。登りは大変そうに見えるが、誰もが明るく、活力に満ちている様子だ。澄みわたった青空から、アウトドアの冒険にうってつけの日であることがうかがえる。"
  },
  {
    "key": "hospital",
    "keyword": "hospital,doctor,patient",
    "theme": "病院・診察の様子",
    "modelAnswer": "In this picture, a doctor wearing a white coat is examining a patient who is sitting on an examination bed. Holding a stethoscope, the physician appears to be listening carefully to the patient's heartbeat. On the wall behind them, there are charts and medical equipment that suggest this is a hospital or clinic. The patient, who looks slightly worried, is describing how he feels. The bright, clean room creates a calm and professional atmosphere where people can receive proper care.",
    "tips": [
      {
        "term": "examine a patient",
        "ja": "患者を診察する。診察シーンの中心となる動詞。"
      },
      {
        "term": "white coat",
        "ja": "白衣。医師や看護師の服装を描写するのに便利。"
      },
      {
        "term": "stethoscope",
        "ja": "聴診器。医療器具の定番語彙。"
      },
      {
        "term": "examination bed / examination room",
        "ja": "診察台／診察室。場所や家具を特定する表現。"
      },
      {
        "term": "appear to be doing",
        "ja": "～しているように見える。写真の動作を断定せず描写する型。"
      },
      {
        "term": "medical equipment",
        "ja": "医療機器。背景の小道具をまとめて言える総称表現。"
      }
    ],
    "modelAnswerJa": "この写真では、白衣を着た医師が、診察台に座っている患者を診察している。医師は聴診器を手にして、患者の心音を注意深く聞いているように見える。二人の背後の壁には、ここが病院か診療所であることをうかがわせるカルテや医療機器がある。少し不安そうな表情の患者は、自分の体調を説明している。明るく清潔なこの部屋は、人々が適切な医療を受けられる、落ち着いた専門的な雰囲気を作り出している。"
  },
  {
    "key": "kitchen",
    "keyword": "kitchen,cooking",
    "theme": "キッチンで料理する様子",
    "modelAnswer": "In this picture, a group of people are busy preparing a meal together in a modern kitchen. A woman standing at the counter is chopping fresh vegetables on a wooden cutting board, while a man beside her stirs something in a pot on the stove. Steam rises from the pot, suggesting that the food is almost ready to be served. Behind them, various ingredients and cooking utensils are neatly arranged within easy reach. Everyone seems cheerful and focused, clearly enjoying the experience of cooking as a team.",
    "tips": [
      {
        "term": "chop vegetables on a cutting board",
        "ja": "まな板の上で野菜を刻む。料理描写の定番表現"
      },
      {
        "term": "stir something in a pot/pan",
        "ja": "鍋・フライパンの中身をかき混ぜる。on the stove と組み合わせて使う"
      },
      {
        "term": "steam is rising from ~",
        "ja": "～から湯気が立ち上っている。調理中の臨場感を出せる"
      },
      {
        "term": "prepare a meal",
        "ja": "食事を準備する。cook より幅広く下ごしらえを含む調理を指す"
      },
      {
        "term": "ingredients and utensils",
        "ja": "食材と調理器具。キッチンの細部描写に便利な名詞ペア"
      },
      {
        "term": "at the counter / by the stove",
        "ja": "調理台のそばで／コンロのそばで。人物の位置を示す前置詞句"
      }
    ],
    "modelAnswerJa": "この写真では、数人のグループが現代的なキッチンで一緒に食事の準備に忙しく取り組んでいる。カウンターに立つ女性は木製のまな板の上で新鮮な野菜を刻んでおり、その隣にいる男性はコンロにかけた鍋の中身をかき混ぜている。鍋からは湯気が立ちのぼっており、料理がもうすぐ盛り付けられる頃合いであることがうかがえる。彼らの後ろには、さまざまな食材や調理器具がすぐ手の届くところにきちんと並べられている。皆、明るく集中した様子で、チームとして料理する体験を楽しんでいるのが見て取れる。"
  },
  {
    "key": "library",
    "keyword": "library,studying",
    "theme": "図書館で勉強する人々",
    "modelAnswer": "This photograph shows the interior of a busy library where a group of people are studying quietly. Seated at long wooden tables, several students are reading thick books and taking notes on their laptops. Tall shelves packed with books line the walls behind them, while warm light streams in through large windows. A young woman in the foreground appears to be concentrating hard on her work, surrounded by piles of papers. Overall, the scene conveys a calm, focused atmosphere that is typical of a place dedicated to learning.",
    "tips": [
      {
        "term": "be absorbed in / concentrate on",
        "ja": "〜に没頭する/集中する。studying や reading の様子を描写するのに便利"
      },
      {
        "term": "shelves lined with books",
        "ja": "本がぎっしり並んだ棚。be lined with〜で「〜がずらりと並んでいる」"
      },
      {
        "term": "take notes",
        "ja": "メモを取る。勉強中の動作を表す定番表現"
      },
      {
        "term": "seated at a table",
        "ja": "テーブルに着席して。分詞構文 Seated at... で文頭を多様化できる"
      },
      {
        "term": "a quiet / studious atmosphere",
        "ja": "静かで勉強に集中した雰囲気。情景全体をまとめる時に使える"
      },
      {
        "term": "in the foreground / background",
        "ja": "手前に/奥に。写真内の人や物の位置関係を示す描写の必須表現"
      }
    ],
    "modelAnswerJa": "この写真は、大勢の人々が静かに勉強している、にぎわう図書館の内部をとらえている。長い木製のテーブルに着いた数人の学生が、分厚い本を読んだり、ノートパソコンでメモを取ったりしている。彼らの背後には、本がぎっしりと詰まった高い書棚が壁沿いに並び、大きな窓からは暖かな光が差し込んでいる。手前にいる若い女性は、山積みの書類に囲まれながら、作業に深く集中しているように見える。全体として、この光景は学びに専念する場所ならではの、落ち着いて集中した雰囲気を伝えている。"
  },
  {
    "key": "market",
    "keyword": "market,vegetables",
    "theme": "朝の市場で生鮮品を買う人々",
    "modelAnswer": "This photo shows a busy outdoor market early in the morning. In the foreground, a vendor stands behind a stall piled high with fresh fruit and vegetables, while several customers browse the colorful produce. A woman wearing an apron is weighing some tomatoes for a man who is paying for them. Wooden crates full of leafy greens and ripe peppers line the front of the stall. Judging by the soft light, it seems to be the start of a sunny day.",
    "tips": [
      {
        "term": "produce / fresh produce",
        "ja": "(集合名詞)農産物・生鮮品。野菜や果物をまとめて指す不可算名詞"
      },
      {
        "term": "stall / market stall",
        "ja": "屋台・売店。市場で商品を並べる台や区画"
      },
      {
        "term": "vendor",
        "ja": "売り手・販売者。露店の店主を指すのに便利"
      },
      {
        "term": "piled high with ~",
        "ja": "~がうずたかく積まれて。商品が山積みの様子を描写する熟語"
      },
      {
        "term": "browse the goods",
        "ja": "商品を見て回る・物色する。買う前に眺める動作"
      },
      {
        "term": "in the foreground / in the background",
        "ja": "手前(前景)に/奥(背景)に。写真の位置関係を示す定番表現"
      }
    ],
    "modelAnswerJa": "この写真には、早朝のにぎわう屋外の市場が写っている。手前では、新鮮な果物や野菜を山のように積み上げた屋台の奥に売り手が立っており、その一方で何人もの客が色とりどりの農産物を見て回っている。エプロンを身につけた女性が、代金を支払っている男性のためにトマトを量っている。葉物野菜や熟したピーマンがいっぱいに入った木箱が、屋台の前に並んでいる。柔らかな光の様子から見て、晴れた一日が始まろうとしているところのようだ。"
  },
  {
    "key": "museum",
    "keyword": "museum,art,visitors",
    "theme": "美術館を訪れる人々",
    "modelAnswer": "This photo shows the inside of a busy art museum where a group of visitors are admiring the paintings on display. Standing in front of a large framed artwork, several people are looking closely at the details, while others move slowly along the gallery wall. In the background, a guide appears to be explaining the history of one of the pieces to a small crowd. The bright, spacious room is filled with people who seem genuinely interested in the exhibition.",
    "tips": [
      {
        "term": "art gallery / exhibition",
        "ja": "展示室・企画展。gallery は作品を並べた部屋、exhibition は展覧会全体を指す"
      },
      {
        "term": "admire the paintings on display",
        "ja": "展示されている絵画に見入る。on display=展示中で"
      },
      {
        "term": "a framed artwork / piece",
        "ja": "額装された作品。piece は作品1点を指す便利な語"
      },
      {
        "term": "stand in front of ~",
        "ja": "～の前に立つ。鑑賞シーンの位置説明に頻出する前置詞句"
      },
      {
        "term": "a guide explaining the history of ~",
        "ja": "～の歴史を説明するガイド。現在分詞で人物を後置修飾する形"
      },
      {
        "term": "spacious / well-lit room",
        "ja": "広々とした・明るい部屋。館内の雰囲気描写に使える形容詞"
      }
    ],
    "modelAnswerJa": "この写真は、大勢の人で賑わう美術館の館内を写しており、訪れた人々の一団が展示されている絵画に見入っている。大きな額装の作品の前に立った数人が細部までじっくりと見つめている一方で、ほかの人たちは展示室の壁沿いをゆっくりと歩いて移動している。奥のほうでは、ガイドが作品の一つの歴史について小さな人だかりに説明しているように見える。明るく広々とした部屋は、この展覧会に心から興味を持っている様子の人々で満ちている。"
  },
  {
    "key": "office",
    "keyword": "office,meeting",
    "theme": "オフィスの会議",
    "modelAnswer": "This photo shows a group of colleagues gathered around a long table in a modern office meeting room. Seated in front of their laptops, several people are listening attentively while one woman stands beside a screen, presenting some charts. Bright sunlight streams through the large windows behind them, creating a focused yet relaxed atmosphere. On the table, there are notebooks, coffee cups, and a few documents spread out. They appear to be discussing an important project and sharing ideas with one another.",
    "tips": [
      {
        "term": "gather around a table",
        "ja": "テーブルを囲んで集まる（会議の様子を描写する定番表現）"
      },
      {
        "term": "give a presentation / present charts",
        "ja": "プレゼンをする／グラフを見せながら説明する"
      },
      {
        "term": "listen attentively",
        "ja": "熱心に耳を傾ける（参加者の様子を表す）"
      },
      {
        "term": "meeting room / conference room",
        "ja": "会議室（場所を特定する語）"
      },
      {
        "term": "discuss an important project",
        "ja": "重要なプロジェクトについて話し合う"
      },
      {
        "term": "sunlight streams through the windows",
        "ja": "日光が窓から差し込む（背景・雰囲気の描写に便利）"
      }
    ],
    "modelAnswerJa": "この写真には、現代的なオフィスの会議室で長いテーブルを囲んで集まっている同僚たちのグループが写っている。何人かはノートパソコンを前に座って熱心に耳を傾けており、一人の女性はスクリーンのそばに立って、いくつかのグラフを示しながら説明している。彼らの背後にある大きな窓からは明るい日差しが差し込み、集中しつつもくつろいだ雰囲気を作り出している。テーブルの上には、ノートやコーヒーカップ、そして数枚の書類が広げられている。彼らは重要なプロジェクトについて話し合い、互いに意見を出し合っているように見える。"
  },
  {
    "key": "park-picnic",
    "keyword": "park,picnic",
    "theme": "公園でのピクニック",
    "modelAnswer": "In this picture, a group of people are enjoying a picnic in a sunny park. They are sitting on a large blanket spread out on the green grass, surrounded by tall trees that provide plenty of shade. A variety of food and drinks, including sandwiches and fresh fruit, have been laid out in the middle. While some friends are chatting and laughing together, others seem to be relaxing in the warm sunshine. Judging by their cheerful expressions, everyone appears to be having a wonderful time outdoors.",
    "tips": [
      {
        "term": "have a picnic / go on a picnic",
        "ja": "ピクニックをする・ピクニックに出かける。写真の主題を一文で言える定番表現。"
      },
      {
        "term": "spread out on the grass",
        "ja": "芝生の上に広げる。a blanket spread out on the grass のように分詞で後置修飾できる。"
      },
      {
        "term": "be surrounded by ~",
        "ja": "〜に囲まれている。surrounded by trees など背景描写に使える受動の分詞句。"
      },
      {
        "term": "lay out (the food)",
        "ja": "(食べ物を)並べる・広げる。have been laid out と現在完了受動で状態を表せる。"
      },
      {
        "term": "chat and laugh together",
        "ja": "おしゃべりして一緒に笑う。人物の動作・雰囲気を生き生きと描写する。"
      },
      {
        "term": "judging by their expressions",
        "ja": "表情から判断すると。写真から推測を述べる時の便利な前置き表現。"
      }
    ],
    "modelAnswerJa": "この写真では、何人かの人々が日の差す公園でピクニックを楽しんでいる。彼らは緑の芝生の上に広げた大きな敷物に座っており、その周りにはたっぷりと日陰をつくる高い木々が立ち並んでいる。真ん中には、サンドイッチや新鮮な果物をはじめとするさまざまな食べ物や飲み物が並べられている。友人の中にはおしゃべりをしながら一緒に笑い合っている人もいれば、暖かな日差しの中でくつろいでいるように見える人もいる。その明るい表情から判断すると、みんな屋外でのひとときをとても楽しんでいるようだ。"
  },
  {
    "key": "playground",
    "keyword": "playground,children",
    "theme": "遊び場で遊ぶ子供たち",
    "modelAnswer": "This photo shows a lively playground where a group of children are playing on a sunny afternoon. In the foreground, a young boy is sliding down a colorful slide while several others wait for their turn. Nearby, two girls are swinging back and forth, laughing as they go higher. A few parents stand in the background, keeping a close eye on the children who are climbing the play structure. Surrounded by green trees, the scene gives a strong sense of joy and carefree energy.",
    "tips": [
      {
        "term": "playground",
        "ja": "遊び場、児童公園。写真の場所そのものを指す基本語"
      },
      {
        "term": "slide down a slide",
        "ja": "滑り台を滑り降りる。動詞slideと名詞slideの組み合わせ"
      },
      {
        "term": "swing back and forth",
        "ja": "ブランコで前後に揺れる。ブランコの動作描写に便利"
      },
      {
        "term": "climb the play structure",
        "ja": "ジャングルジム(遊具)によじ登る。play structure=複合遊具"
      },
      {
        "term": "wait for one's turn",
        "ja": "順番を待つ。遊具で待つ子供たちの描写に使える"
      },
      {
        "term": "keep a close eye on",
        "ja": "～をしっかり見守る。付き添いの親の様子を表す表現"
      }
    ],
    "modelAnswerJa": "この写真には、晴れた午後に子供たちの一団が遊んでいる、にぎやかな遊び場が写っている。手前では、ひとりの幼い男の子がカラフルな滑り台を滑り降りており、その一方で他の何人かの子供たちが自分の順番を待っている。すぐそばでは、ふたりの女の子がブランコを前後に漕ぎ、高く上がっていくにつれて笑い声をあげている。背景では、数人の親たちが立ち、遊具によじ登っている子供たちにしっかりと目を配っている。緑の木々に囲まれたこの光景は、喜びと屈託のない活気を強く感じさせる。"
  },
  {
    "key": "rainy-street",
    "keyword": "rain,umbrella,street",
    "theme": "雨の通りで傘をさす人々",
    "modelAnswer": "This photo shows a busy city street on a rainy day. A group of people are walking along the sidewalk, holding colorful umbrellas to stay dry. In the foreground, a woman dressed in a raincoat is crossing the street while puddles reflect the gray sky above. Because the rain is falling heavily, most pedestrians are hurrying to reach shelter. The wet pavement and the row of buildings in the background create a calm yet gloomy atmosphere.",
    "tips": [
      {
        "term": "hold an umbrella",
        "ja": "傘をさす。写真の中心動作を表す基本表現"
      },
      {
        "term": "pedestrian(s)",
        "ja": "歩行者。通りを歩く人々を指す自然な名詞"
      },
      {
        "term": "to stay dry",
        "ja": "濡れないように。傘をさす目的を表す不定詞句"
      },
      {
        "term": "puddle",
        "ja": "水たまり。雨天の路面描写に便利"
      },
      {
        "term": "wet pavement",
        "ja": "濡れた歩道・路面。情景の細部を加える表現"
      },
      {
        "term": "gloomy atmosphere",
        "ja": "どんよりした雰囲気。雨天の全体的な印象をまとめる語"
      }
    ],
    "modelAnswerJa": "この写真は、雨の日のにぎやかな繁華街を写しています。人々の一団が、雨に濡れないよう色とりどりの傘をさして歩道を歩いています。手前では、レインコートを着た女性が通りを渡っており、水たまりが頭上の灰色の空を映しています。雨が激しく降っているため、ほとんどの歩行者は雨宿りできる場所へ急いでいます。濡れた路面と背景に立ち並ぶ建物が、穏やかでありながらもどんよりとした雰囲気を作り出しています。"
  },
  {
    "key": "restaurant",
    "keyword": "restaurant,dining",
    "theme": "レストランで食事する人々",
    "modelAnswer": "This photo shows the interior of a busy restaurant, where a group of people are enjoying a meal together. Seated around several wooden tables, the diners are chatting and laughing while plates of food and glasses of drinks are spread out in front of them. A waiter wearing an apron is taking an order from one of the guests on the right. Warm lighting and large windows create a cozy, welcoming atmosphere. Judging by the relaxed mood, the customers seem to be having a pleasant time.",
    "tips": [
      {
        "term": "dine / have a meal",
        "ja": "食事をする。eat より上品で、写真描写に適した動詞。"
      },
      {
        "term": "be seated around a table",
        "ja": "テーブルを囲んで座っている。受動態+前置詞句で配置を自然に表す。"
      },
      {
        "term": "a waiter taking an order",
        "ja": "注文を取っている店員。現在分詞で人物の動作を簡潔に説明できる。"
      },
      {
        "term": "be spread out in front of someone",
        "ja": "～の前に並んでいる/広がっている。料理や食器の様子を描写。"
      },
      {
        "term": "cozy / welcoming atmosphere",
        "ja": "居心地のよい/温かみのある雰囲気。店内の印象を述べる定番表現。"
      },
      {
        "term": "chat and laugh together",
        "ja": "一緒におしゃべりして笑う。人々の交流の様子を表す自然な組み合わせ。"
      }
    ],
    "modelAnswerJa": "この写真は賑わうレストランの店内を写したもので、大勢の人たちが一緒に食事を楽しんでいる。客たちはいくつかの木製のテーブルを囲んで座り、おしゃべりをしたり笑ったりしていて、目の前には料理の皿や飲み物の入ったグラスが並べられている。エプロンを身につけたウェイターが、右側にいる客の一人から注文を取っている。暖かみのある照明と大きな窓が、居心地がよく温かく迎え入れてくれるような雰囲気を生み出している。くつろいだ様子から判断すると、客たちは楽しいひとときを過ごしているようだ。"
  },
  {
    "key": "station",
    "keyword": "train,station,commuters",
    "theme": "駅・通勤の様子",
    "modelAnswer": "This photograph shows a busy train station during the morning rush hour. On the platform, a group of commuters dressed in business attire are waiting for the next train, and several of them are checking their phones to pass the time. A train has just pulled in, and its doors are opening to let passengers board. In the background, a large digital display lists the upcoming departures and their platforms. Overall, the scene captures the hurried yet orderly atmosphere of a typical weekday commute.",
    "tips": [
      {
        "term": "rush hour",
        "ja": "ラッシュアワー、通勤通学の混雑時間帯。during the morning rush hour で時間帯を示す"
      },
      {
        "term": "commuter",
        "ja": "通勤・通学客。a group of commuters のように使う"
      },
      {
        "term": "platform",
        "ja": "(駅の)ホーム。on the platform で「ホームで」"
      },
      {
        "term": "pull in / pull into the station",
        "ja": "(電車が)入ってくる、到着する。A train has just pulled in で「電車が到着したばかり」"
      },
      {
        "term": "board (a train)",
        "ja": "(電車に)乗り込む。let passengers board で「乗客を乗せる」"
      },
      {
        "term": "departure board / digital display",
        "ja": "発車案内表示板。発車時刻やホームを表示する電光掲示板"
      }
    ],
    "modelAnswerJa": "この写真には、朝のラッシュアワーで混み合う鉄道の駅が写っている。プラットホームでは、ビジネス用の服装をした通勤客の一団が次の電車を待っており、そのうちの何人かは時間をつぶすためにスマートフォンを見ている。電車はちょうど到着したところで、乗客が乗り込めるようにドアが開きつつある。背景には大きな電光掲示板があり、これから発車する電車とそのホーム番号が表示されている。全体として、この場面は平日のありふれた通勤の、慌ただしくも秩序立った雰囲気をとらえている。"
  },
  {
    "key": "supermarket",
    "keyword": "supermarket,shopping",
    "theme": "スーパーで買い物する様子",
    "modelAnswer": "This photo shows the inside of a busy supermarket, where several shoppers are browsing the well-stocked aisles. In the foreground, a woman pushing a shopping cart is reaching for a product on a shelf, while a man beside her compares two items. Behind them, a group of people wait at the checkout, where a cashier is scanning groceries. The shelves are lined with fresh produce, packaged goods, and colorful boxes. Overall, it captures an ordinary moment of grocery shopping on a typical day.",
    "tips": [
      {
        "term": "aisle",
        "ja": "（商品棚の間の）通路。browse the aisles で「通路を見て回る」"
      },
      {
        "term": "shopping cart / trolley",
        "ja": "ショッピングカート。push a shopping cart で「カートを押す」"
      },
      {
        "term": "shelf (shelves) / well-stocked",
        "ja": "棚／商品が豊富に並んだ。a product on a shelf、well-stocked shelves のように使う"
      },
      {
        "term": "checkout (counter)",
        "ja": "レジ・会計場所。wait at the checkout で「レジで待つ」"
      },
      {
        "term": "cashier",
        "ja": "レジ係。scan groceries で「商品をスキャンする」"
      },
      {
        "term": "fresh produce",
        "ja": "（青果の）生鮮食品。野菜や果物類を指す、スーパー描写の定番語"
      }
    ],
    "modelAnswerJa": "この写真は、混み合ったスーパーマーケットの店内を写しており、数人の買い物客が品物の豊富に並んだ通路を見て回っている。手前では、ショッピングカートを押した女性が棚の商品に手を伸ばしており、その隣では男性が二つの商品を見比べている。彼らの後ろでは、大勢の人がレジに並んで待っており、店員が食料品をスキャンしている。棚には新鮮な野菜や果物、包装された食品、色とりどりの箱が並んでいる。全体として、ごく普通の一日に食料品の買い物をする何気ない一場面をとらえている。"
  },
  {
    "key": "zoo",
    "keyword": "zoo,animals,visitors",
    "theme": "動物園を訪れる人々",
    "modelAnswer": "This photo shows a busy day at the zoo, where a group of visitors has gathered in front of a large enclosure. Several families with young children are leaning against the railing, pointing at the animals and taking photos. In the background, tall trees and an information sign create a natural setting for the exhibit. Some people seem fascinated by the creatures, while others are simply chatting and enjoying the sunny weather. Overall, it looks like a relaxing place where people of all ages can observe wildlife up close.",
    "tips": [
      {
        "term": "enclosure / exhibit",
        "ja": "（動物園の）囲い・展示区画。動物が飼育・展示されている場所を指す定番語"
      },
      {
        "term": "a group of visitors",
        "ja": "訪問客の一団。人々を一般化して描写するときに便利な表現"
      },
      {
        "term": "gather in front of ~",
        "ja": "～の前に集まる。人だかりができている様子を表す"
      },
      {
        "term": "lean against the railing",
        "ja": "手すりにもたれる。柵越しに見ている動作の描写に使える"
      },
      {
        "term": "point at the animals",
        "ja": "動物を指さす。来園者の典型的な仕草を表す（point to も可）"
      },
      {
        "term": "observe wildlife up close",
        "ja": "動物を間近で観察する。締めの一般化した描写に使える上級表現"
      }
    ],
    "modelAnswerJa": "この写真は、動物園のにぎわう一日を写したもので、大きな囲いの前に一団の来園者が集まっている。幼い子どもを連れた何組かの家族が手すりに寄りかかり、動物を指さしたり写真を撮ったりしている。背景には高い木々と案内板があり、展示に自然な趣を添えている。生き物にすっかり見入っている人もいれば、ただおしゃべりをして晴れた天気を楽しんでいる人もいる。全体として、あらゆる年齢の人々が野生動物を間近で観察できる、くつろげる場所のように見える。"
  }
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** 日付からその日のシーンと写真URL（LoremFlickrでキーワード一致）を決める */
export function getTodayScene(today: string): { scene: PhotoScene; image: string } {
  const h = hashStr(today);
  const scene = PHOTO_SCENES[h % PHOTO_SCENES.length];
  const image = `https://loremflickr.com/1000/750/${encodeURIComponent(scene.keyword)}?lock=${(h % 60) + 1}`;
  return { scene, image };
}
