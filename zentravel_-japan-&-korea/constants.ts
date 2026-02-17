import { DailyPlan, EventType } from './types';

// Helper to create IDs
const id = () => Math.random().toString(36).substr(2, 9);

// NOTE: Local Image Configuration
// Please ensure you have a folder named 'assets/images' in your public directory (next to index.html).
// Place your image files there with the corresponding filenames.
const IMAGES = {
  flight_tpe_nrt: './assets/images/flight_tpe_nrt.jpg',
  train_nex_asama: './assets/images/train_nex_asama.jpg',
  hotel_coco: './assets/images/hotel_coco.jpg',
  train_0225: './assets/images/train_0225.jpg',
  train_0226_1: './assets/images/train_0226_1.jpg',
  train_0226_2: './assets/images/train_0226_2.jpg',
  sushi_ishiyama: './assets/images/sushi_ishiyama.jpg',
  hotel_omo5: './assets/images/hotel_omo5.jpg',
  imahan: './assets/images/imahan.jpg',
  flight_nrt_icn: './assets/images/flight_nrt_icn.jpg',
  hotel_wecostay: './assets/images/hotel_wecostay.jpg',
  flight_icn_tpe: './assets/images/flight_icn_tpe.jpg',
};

export const INITIAL_ITINERARY: DailyPlan[] = [
  {
    date: "2/24 (二)",
    items: [
      {
        id: id(),
        date: "2/24 (二)",
        type: EventType.FLIGHT,
        title: "飛機 (酷航)",
        startLocation: "桃園機場 (TPE)",
        endLocation: "成田機場 (NRT)",
        startTime: "14:00",
        endTime: "18:00",
        code: "TR874",
        notes: "飛行時間 3h 0m。波音 787-9。",
        attachments: [IMAGES.flight_tpe_nrt]
      },
      {
        id: id(),
        date: "2/24 (二)",
        type: EventType.TRAIN,
        title: "成田特快 (N'EX)",
        startLocation: "成田機場第一航廈",
        endLocation: "東京車站",
        startTime: "19:49",
        endTime: "20:51",
        code: "Narita-Express 50",
        notes: "座位: 3號車 14C, 14D (指定席)",
        tags: [{ label: "座位 14C/14D", type: "info" }],
        attachments: [IMAGES.train_nex_asama]
      },
      {
        id: id(),
        date: "2/24 (二)",
        type: EventType.TRAIN,
        title: "北陸新幹線",
        startLocation: "東京車站",
        endLocation: "高崎車站",
        startTime: "22:08",
        endTime: "22:58",
        code: "Asama 633",
        notes: "座位: 10號車 20D, 20E (指定席)",
        tags: [{ label: "座位 20D/20E", type: "info" }],
        attachments: [IMAGES.train_nex_asama]
      },
      {
        id: id(),
        date: "2/24 (二)",
        type: EventType.STAY,
        title: "抵達飯店",
        startLocation: "高崎車站",
        endLocation: "高崎可可大飯店",
        startTime: "23:00",
        endTime: "23:05",
        notes: "辦理入住 高崎可可大飯店。預約號碼: 3297-3002-9684。",
        tags: [{ label: "Res: 3297...", type: "reservation" }],
        walkingRoute: "高崎站「東口」2樓天橋直達 (步行3分)",
        attachments: [IMAGES.hotel_coco]
      }
    ]
  },
  {
    date: "2/25 (三)",
    items: [
      {
        id: id(),
        date: "2/25 (三)",
        type: EventType.TRANSFER,
        title: "從飯店出發",
        startLocation: "高崎可可大飯店",
        endLocation: "高崎車站",
        startTime: "07:20",
        endTime: "07:25",
        walkingRoute: "高崎站「東口」2樓天橋直達 (步行3分)"
      },
      {
        id: id(),
        date: "2/25 (三)",
        type: EventType.TRAIN,
        title: "上越新幹線",
        startLocation: "高崎車站",
        endLocation: "越後湯澤",
        startTime: "07:35",
        endTime: "08:02",
        code: "Tanigawa 401",
        notes: "座位: 8號車 2D, 2E (指定席)",
        tags: [{ label: "座位 2D/2E", type: "info" }],
        attachments: [IMAGES.train_0225]
      },
      {
        id: id(),
        date: "2/25 (三)",
        type: EventType.ACTIVITY,
        title: "雪具租借與接駁",
        startLocation: "越後湯澤車站",
        endLocation: "岩原滑雪場",
        startTime: "08:10",
        notes: "青達雪具 (全中文服務/免費接送)。",
        walkingRoute: "西口步行約1~5分"
      },
      {
        id: id(),
        date: "2/25 (三)",
        type: EventType.TRAIN,
        title: "上越新幹線",
        startLocation: "越後湯澤",
        endLocation: "高崎車站",
        startTime: "18:12",
        endTime: "18:39",
        code: "Toki 334",
        notes: "座位: 8號車 20D, 20E (指定席)",
        tags: [{ label: "座位 20D/20E", type: "info" }],
        attachments: [IMAGES.train_0225]
      },
      {
        id: id(),
        date: "2/25 (三)",
        type: EventType.STAY,
        title: "返回飯店",
        startLocation: "高崎車站",
        endLocation: "高崎可可大飯店",
        startTime: "18:45",
        endTime: "18:50",
        notes: "續住 高崎可可大飯店",
        walkingRoute: "高崎站「東口」2樓天橋直達 (步行3分)"
      }
    ]
  },
  {
    date: "2/26 (四)",
    items: [
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.TRANSFER,
        title: "退房出發",
        startLocation: "高崎可可大飯店",
        endLocation: "高崎車站",
        startTime: "07:20",
        endTime: "07:25",
        notes: "辦理退房、行李寄放",
        tags: [{ label: "Check-out", type: "alert" }],
        walkingRoute: "高崎站「東口」2樓天橋直達 (步行3分)"
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.TRAIN,
        title: "上越新幹線",
        startLocation: "高崎車站",
        endLocation: "越後湯澤",
        startTime: "07:35",
        endTime: "08:02",
        code: "Tanigawa 401",
        notes: "座位: 10號車 2D, 2E (指定席)",
        tags: [{ label: "座位 2D/2E", type: "info" }],
        attachments: [IMAGES.train_0226_1]
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.ACTIVITY,
        title: "雪具租借與接駁",
        startLocation: "越後湯澤車站",
        endLocation: "岩原滑雪場",
        startTime: "08:10",
        notes: "青達雪具 (接送至岩原滑雪場)",
        walkingRoute: "西口步行約1~5分"
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.TRAIN,
        title: "上越新幹線",
        startLocation: "越後湯澤",
        endLocation: "高崎車站",
        startTime: "18:05",
        endTime: "18:30",
        code: "Tanigawa 92",
        notes: "回高崎領取行李。座位: 10號車 19B, 19C (指定席)",
        tags: [{ label: "座位 19B/19C", type: "info" }],
        attachments: [IMAGES.train_0226_1, IMAGES.train_0226_2]
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.TRAIN,
        title: "北陸新幹線",
        startLocation: "高崎車站",
        endLocation: "上野車站",
        startTime: "19:13",
        endTime: "19:54",
        code: "Hakutaka 572",
        notes: "轉乘JR山手線前往大塚。座位: 8號車 20D, 20E (指定席)",
        tags: [{ label: "座位 20D/20E", type: "info" }],
        attachments: [IMAGES.train_0226_1, IMAGES.train_0226_2]
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.ACTIVITY,
        title: "晚餐 (鴨to蔥)",
        startLocation: "上野車站",
        endLocation: "御徒町/上野",
        startTime: "20:00",
        endTime: "21:00",
        notes: "超人氣鴨肉拉麵 (需稍微排隊)",
        tags: [{ label: "必吃拉麵", type: "food" }],
        walkingRoute: "上野站/御徒町站步行前往",
        guideRecommendation: {
          mustOrder: "鴨肉拉麵 (鴨らーめん) + 鮪魚丼 (小親子丼)",
          tips: "湯頭只有鴨跟水。每月更換的蔥建議選「丸太白蔥」。麵體建議選全麥。"
        }
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.TRANSFER,
        title: "JR山手線 (轉乘)",
        startLocation: "上野/御徒町站",
        endLocation: "大塚車站",
        startTime: "21:00",
        endTime: "21:15",
        notes: "吃飽後前往大塚"
      },
      {
        id: id(),
        date: "2/26 (四)",
        type: EventType.STAY,
        title: "抵達飯店",
        startLocation: "大塚車站",
        endLocation: "OMO5 東京大塚",
        startTime: "21:15",
        endTime: "21:20",
        notes: "辦理入住 OMO5 東京大塚。訂房代號: 482930。房型: YAGURA Room。",
        tags: [{ label: "Res: 482930", type: "reservation" }],
        walkingRoute: "JR大塚站「北口」過馬路即達 (步行1分)",
        attachments: [IMAGES.hotel_omo5]
      }
    ]
  },
  {
    date: "2/27 (五)",
    items: [
      {
        id: id(),
        date: "2/27 (五)",
        type: EventType.TRANSFER,
        title: "從飯店出發",
        startLocation: "OMO5 東京大塚",
        endLocation: "大塚車站",
        startTime: "11:20",
        endTime: "11:25",
        walkingRoute: "JR大塚站「北口」過馬路即達 (步行1分)"
      },
      {
        id: id(),
        date: "2/27 (五)",
        type: EventType.ACTIVITY,
        title: "生日大餐 (Sushi Ishiyama)",
        startLocation: "大塚車站",
        endLocation: "有樂町站/銀座站",
        startTime: "11:30",
        endTime: "12:30",
        notes: "銀座 Morita大樓 4F (二廚壽司套餐)。預約代號: UNQXV2。",
        tags: [{ label: "Res: UNQXV2", type: "reservation" }, { label: "生日(戀人)", type: "food" }],
        walkingRoute: "搭JR至有樂町站步行約5分或轉地鐵至銀座站步行約2分",
        guideRecommendation: {
          mustOrder: "Omakase (主廚發辦)",
          tips: "江戶前壽司的精髓。留意他們的『鮪魚大腹』與『海膽』，醋飯的溫度控制是這家的絕活。"
        },
        attachments: [IMAGES.sushi_ishiyama]
      },
      {
        id: id(),
        date: "2/27 (五)",
        type: EventType.SHOPPING,
        title: "東京市區自由行",
        startLocation: "銀座",
        notes: "銀座周邊逛街",
        tags: [{ label: "Shopping", type: "shopping" }]
      },
      {
        id: id(),
        date: "2/27 (五)",
        type: EventType.STAY,
        title: "返回飯店",
        startLocation: "大塚車站",
        endLocation: "OMO5 東京大塚",
        notes: "續住 OMO5 東京大塚",
        walkingRoute: "JR大塚站「北口」過馬路即達 (步行1分)"
      }
    ]
  },
  {
    date: "2/28 (六)",
    items: [
      {
        id: id(),
        date: "2/28 (六)",
        type: EventType.TRANSFER,
        title: "從飯店出發",
        startLocation: "OMO5 東京大塚",
        endLocation: "大塚車站",
        startTime: "10:15",
        endTime: "10:20",
        walkingRoute: "JR大塚站「北口」過馬路即達 (步行1分)"
      },
      {
        id: id(),
        date: "2/28 (六)",
        type: EventType.ACTIVITY,
        title: "生日大餐 (人形町今半)",
        startLocation: "大塚車站",
        endLocation: "新宿車站",
        startTime: "10:20",
        endTime: "11:00",
        notes: "新宿南方之星塔店 4F (極上壽喜燒)。預約代號: T95G7W。",
        tags: [{ label: "Res: T95G7W", type: "reservation" }, { label: "極上壽喜燒", type: "food" }],
        walkingRoute: "搭JR山手線至新宿站「新南改札」步行約3分",
        guideRecommendation: {
          mustOrder: "極上黑毛和牛壽喜燒套餐",
          tips: "全程由女將服務。肉片沾滿蛋液入口即化，最後的『滑蛋蓋飯 (Fu-watro bowl)』吸滿肉汁精華，絕對不能錯過。"
        },
        attachments: [IMAGES.imahan]
      },
      {
        id: id(),
        date: "2/28 (六)",
        type: EventType.SHOPPING,
        title: "東京市區自由行",
        startLocation: "新宿",
        notes: "新宿周邊逛街",
        tags: [{ label: "Must Buy", type: "shopping" }]
      },
      {
        id: id(),
        date: "2/28 (六)",
        type: EventType.STAY,
        title: "返回飯店",
        startLocation: "大塚車站",
        endLocation: "OMO5 東京大塚",
        notes: "續住 OMO5 東京大塚",
        walkingRoute: "JR大塚站「北口」過馬路即達 (步行1分)"
      }
    ]
  },
  {
    date: "3/1 (日)",
    items: [
      {
        id: id(),
        date: "3/1 (日)",
        type: EventType.TRANSFER,
        title: "退房出發",
        startLocation: "OMO5 東京大塚",
        endLocation: "大塚車站",
        notes: "辦理退房",
        tags: [{ label: "Check-out", type: "alert" }],
        walkingRoute: "JR大塚站「北口」過馬路即達 (步行1分)"
      },
      {
        id: id(),
        date: "3/1 (日)",
        type: EventType.TRANSFER,
        title: "前往成田機場",
        startLocation: "大塚車站",
        endLocation: "成田機場 (NRT)",
        notes: "搭乘 Skyliner 或 N'EX"
      },
      {
        id: id(),
        date: "3/1 (日)",
        type: EventType.FLIGHT,
        title: "飛機 (Air Premia)",
        startLocation: "成田機場 (NRT)",
        endLocation: "仁川機場 (ICN)",
        startTime: "12:30",
        endTime: "15:20",
        code: "YP732",
        notes: "搭乘機場快線/巴士前往市區",
        attachments: [IMAGES.flight_nrt_icn]
      },
      {
        id: id(),
        date: "3/1 (日)",
        type: EventType.TRANSFER,
        title: "市區交通",
        startLocation: "仁川機場 (ICN)",
        endLocation: "首爾忠武路站"
      },
      {
        id: id(),
        date: "3/1 (日)",
        type: EventType.STAY,
        title: "抵達飯店",
        startLocation: "忠武路站",
        endLocation: "Wecostay 南山住宿",
        notes: "辦理入住 Wecostay 南山住宿。PIN碼: 9466。訂單號: ...1704",
        tags: [{ label: "PIN: 9466", type: "reservation" }],
        walkingRoute: "地鐵忠武路站「5/6號出口」 (步行1-2分)",
        attachments: [IMAGES.hotel_wecostay]
      }
    ]
  },
  {
    date: "3/2 (一)",
    items: [
      {
        id: id(),
        date: "3/2 (一)",
        type: EventType.TRANSFER,
        title: "從飯店出發",
        startLocation: "Wecostay 南山住宿",
        endLocation: "首爾市區",
        walkingRoute: "地鐵忠武路站「5/6號出口」 (步行1-2分)"
      },
      {
        id: id(),
        date: "3/2 (一)",
        type: EventType.ACTIVITY,
        title: "首爾市區自由行 (一隻雞)",
        startLocation: "首爾市區",
        notes: "全天自由行",
        tags: [{ label: "一隻雞", type: "food" }],
        guideRecommendation: {
          mustOrder: "一隻雞 (닭한마리) + 刀削麵",
          tips: "推薦『陳玉華』或『孔陵』。先喝清湯，再加蒜泥與泡菜煮。最後的精華雞湯一定要加點刀削麵或海苔煮成粥！"
        }
      },
      {
        id: id(),
        date: "3/2 (一)",
        type: EventType.STAY,
        title: "返回飯店",
        startLocation: "首爾市區",
        endLocation: "Wecostay 南山住宿",
        notes: "續住 Wecostay 南山住宿",
        walkingRoute: "地鐵忠武路站「5/6號出口」 (步行1-2分)"
      }
    ]
  },
  {
    date: "3/3 (二)",
    items: [
      {
        id: id(),
        date: "3/3 (二)",
        type: EventType.TRANSFER,
        title: "退房出發",
        startLocation: "Wecostay 南山住宿",
        endLocation: "忠武路站",
        notes: "退房、行李寄放",
        tags: [{ label: "Check-out 11:00", type: "alert" }],
        walkingRoute: "地鐵忠武路站「5/6號出口」 (步行1-2分)"
      },
      {
        id: id(),
        date: "3/3 (二)",
        type: EventType.SHOPPING,
        title: "市區採買",
        startLocation: "忠武路站",
        endLocation: "首爾市區",
        notes: "白天市區採買"
      },
      {
        id: id(),
        date: "3/3 (二)",
        type: EventType.TRANSFER,
        title: "前往仁川機場",
        startLocation: "忠武路站",
        endLocation: "仁川機場 (ICN)",
        notes: "準備搭機"
      },
      {
        id: id(),
        date: "3/3 (二)",
        type: EventType.FLIGHT,
        title: "飛機 (酷航)",
        startLocation: "仁川機場 (ICN)",
        endLocation: "桃園機場 (TPE)",
        startTime: "23:00",
        endTime: "00:45",
        code: "TR897",
        notes: "座位: 4D, 4E。結束旅程",
        tags: [{ label: "座位 4D/4E", type: "info" }],
        attachments: [IMAGES.flight_icn_tpe]
      }
    ]
  }
];

export const FLIGHT_INFO = [
  { no: 'TR874', route: 'TPE -> NRT', time: '2/24 14:00' },
  { no: 'YP732', route: 'NRT -> ICN', time: '3/1 12:30' },
  { no: 'TR897', route: 'ICN -> TPE', time: '3/3 23:00' }
];

export const ACCOMMODATION = [
  { name: '高崎可可大飯店', address: '高崎站「東口」2樓天橋直達', dates: '2/24 - 2/26' },
  { name: 'OMO5 東京大塚', address: 'JR大塚站「北口」', dates: '2/26 - 3/1' },
  { name: 'Wecostay 南山住宿', address: '地鐵忠武路站「5/6號出口」', dates: '3/1 - 3/3' }
];