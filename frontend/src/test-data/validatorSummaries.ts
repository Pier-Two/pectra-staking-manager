import { ObjectId } from "mongodb";

type ValidatorSummary = {
  _id: {
    $oid: string;
  };
  withdrawalCredentialPrefix: string;
  totalStaked: string;
  count: number;
  avgStaked: string;
  timestamp: {
    $date: string;
  };
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
};

const validatorSummariesData: ValidatorSummary[] = [
  {
    _id: {
      $oid: "67f5bbce24a8d1c20c63d712",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426276703542",
    count: 12391,
    avgStaked: "36108972375",
    timestamp: {
      $date: "2025-04-09T00:14:06.935Z",
    },
    createdAt: {
      $date: "2025-04-09T00:14:06.939Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:14:06.939Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5bbce24a8d1c20c63d713",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33723734547092657",
    count: 1053497,
    avgStaked: "32011229787",
    timestamp: {
      $date: "2025-04-09T00:14:06.935Z",
    },
    createdAt: {
      $date: "2025-04-09T00:14:06.941Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:14:06.941Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5bbce24a8d1c20c63d714",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282042194",
    count: 5,
    avgStaked: "32056408438",
    timestamp: {
      $date: "2025-04-09T00:14:06.935Z",
    },
    createdAt: {
      $date: "2025-04-09T00:14:06.941Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:14:06.941Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5bccc24a8d1c20c63d716",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426430610082",
    count: 12391,
    avgStaked: "36108984796",
    timestamp: {
      $date: "2025-04-09T00:18:20.736Z",
    },
    createdAt: {
      $date: "2025-04-09T00:18:20.737Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:18:20.737Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5bccc24a8d1c20c63d717",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33723482090419242",
    count: 1053489,
    avgStaked: "32011233235",
    timestamp: {
      $date: "2025-04-09T00:18:20.736Z",
    },
    createdAt: {
      $date: "2025-04-09T00:18:20.738Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:18:20.738Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5bccc24a8d1c20c63d718",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282088609",
    count: 5,
    avgStaked: "32056417721",
    timestamp: {
      $date: "2025-04-09T00:18:20.736Z",
    },
    createdAt: {
      $date: "2025-04-09T00:18:20.738Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:18:20.738Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c126a3fb841aff25cc41",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426799198214",
    count: 12391,
    avgStaked: "36109014542",
    timestamp: {
      $date: "2025-04-09T00:36:54.950Z",
    },
    createdAt: {
      $date: "2025-04-09T00:36:54.956Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:36:54.956Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c126a3fb841aff25cc42",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722714067700536",
    count: 1053465,
    avgStaked: "32011233470",
    timestamp: {
      $date: "2025-04-09T00:36:54.950Z",
    },
    createdAt: {
      $date: "2025-04-09T00:36:54.958Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:36:54.958Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c126a3fb841aff25cc43",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:36:54.950Z",
    },
    createdAt: {
      $date: "2025-04-09T00:36:54.958Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:36:54.958Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c173a3fb841aff25cc45",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426799873454",
    count: 12391,
    avgStaked: "36109014597",
    timestamp: {
      $date: "2025-04-09T00:38:11.119Z",
    },
    createdAt: {
      $date: "2025-04-09T00:38:11.121Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:38:11.121Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c173a3fb841aff25cc46",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722712241681113",
    count: 1053465,
    avgStaked: "32011231736",
    timestamp: {
      $date: "2025-04-09T00:38:11.119Z",
    },
    createdAt: {
      $date: "2025-04-09T00:38:11.122Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:38:11.122Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c173a3fb841aff25cc47",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:38:11.119Z",
    },
    createdAt: {
      $date: "2025-04-09T00:38:11.122Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:38:11.122Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1aea3fb841aff25cc49",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426800503678",
    count: 12391,
    avgStaked: "36109014648",
    timestamp: {
      $date: "2025-04-09T00:39:10.938Z",
    },
    createdAt: {
      $date: "2025-04-09T00:39:10.941Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:39:10.941Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1aea3fb841aff25cc4a",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722710723272562",
    count: 1053465,
    avgStaked: "32011230295",
    timestamp: {
      $date: "2025-04-09T00:39:10.938Z",
    },
    createdAt: {
      $date: "2025-04-09T00:39:10.942Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:39:10.942Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1aea3fb841aff25cc4b",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:39:10.938Z",
    },
    createdAt: {
      $date: "2025-04-09T00:39:10.942Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:39:10.942Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1dc24a8d1c20c63d71a",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426800998854",
    count: 12391,
    avgStaked: "36109014687",
    timestamp: {
      $date: "2025-04-09T00:39:56.096Z",
    },
    createdAt: {
      $date: "2025-04-09T00:39:56.098Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:39:56.098Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1dc24a8d1c20c63d71b",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722709482006985",
    count: 1053465,
    avgStaked: "32011229117",
    timestamp: {
      $date: "2025-04-09T00:39:56.096Z",
    },
    createdAt: {
      $date: "2025-04-09T00:39:56.098Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:39:56.098Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1dc24a8d1c20c63d71c",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:39:56.096Z",
    },
    createdAt: {
      $date: "2025-04-09T00:39:56.098Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:39:56.098Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1eaa3fb841aff25cc4d",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426801133902",
    count: 12391,
    avgStaked: "36109014698",
    timestamp: {
      $date: "2025-04-09T00:40:10.764Z",
    },
    createdAt: {
      $date: "2025-04-09T00:40:10.767Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:40:10.767Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1eaa3fb841aff25cc4e",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722709234050298",
    count: 1053465,
    avgStaked: "32011228881",
    timestamp: {
      $date: "2025-04-09T00:40:10.764Z",
    },
    createdAt: {
      $date: "2025-04-09T00:40:10.768Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:40:10.768Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1eaa3fb841aff25cc4f",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:40:10.764Z",
    },
    createdAt: {
      $date: "2025-04-09T00:40:10.768Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:40:10.768Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1f924a8d1c20c63d71e",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426801403998",
    count: 12391,
    avgStaked: "36109014720",
    timestamp: {
      $date: "2025-04-09T00:40:25.487Z",
    },
    createdAt: {
      $date: "2025-04-09T00:40:25.488Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:40:25.488Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1f924a8d1c20c63d71f",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722708552901702",
    count: 1053465,
    avgStaked: "32011228235",
    timestamp: {
      $date: "2025-04-09T00:40:25.487Z",
    },
    createdAt: {
      $date: "2025-04-09T00:40:25.489Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:40:25.489Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c1f924a8d1c20c63d720",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:40:25.487Z",
    },
    createdAt: {
      $date: "2025-04-09T00:40:25.489Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:40:25.489Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c227a3fb841aff25cc51",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426801809142",
    count: 12391,
    avgStaked: "36109014753",
    timestamp: {
      $date: "2025-04-09T00:41:11.056Z",
    },
    createdAt: {
      $date: "2025-04-09T00:41:11.058Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:41:11.058Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c227a3fb841aff25cc52",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722707668485131",
    count: 1053465,
    avgStaked: "32011227395",
    timestamp: {
      $date: "2025-04-09T00:41:11.056Z",
    },
    createdAt: {
      $date: "2025-04-09T00:41:11.059Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:41:11.059Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c227a3fb841aff25cc53",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:41:11.056Z",
    },
    createdAt: {
      $date: "2025-04-09T00:41:11.059Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:41:11.059Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c262a3fb841aff25cc55",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426802169270",
    count: 12391,
    avgStaked: "36109014782",
    timestamp: {
      $date: "2025-04-09T00:42:10.978Z",
    },
    createdAt: {
      $date: "2025-04-09T00:42:10.980Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:42:10.980Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c262a3fb841aff25cc56",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722706144440461",
    count: 1053465,
    avgStaked: "32011225949",
    timestamp: {
      $date: "2025-04-09T00:42:10.978Z",
    },
    createdAt: {
      $date: "2025-04-09T00:42:10.981Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:42:10.981Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c262a3fb841aff25cc57",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282224817",
    count: 5,
    avgStaked: "32056444963",
    timestamp: {
      $date: "2025-04-09T00:42:10.978Z",
    },
    createdAt: {
      $date: "2025-04-09T00:42:10.981Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:42:10.981Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c2a4f68cbd2bf6d7de2d",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426908750766",
    count: 12391,
    avgStaked: "36109023383",
    timestamp: {
      $date: "2025-04-09T00:43:16.575Z",
    },
    createdAt: {
      $date: "2025-04-09T00:43:16.581Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:43:16.581Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c2a4f68cbd2bf6d7de2e",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722457706840501",
    count: 1053457,
    avgStaked: "32011233212",
    timestamp: {
      $date: "2025-04-09T00:43:16.575Z",
    },
    createdAt: {
      $date: "2025-04-09T00:43:16.584Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:43:16.584Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c2a4f68cbd2bf6d7de2f",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282271397",
    count: 5,
    avgStaked: "32056454279",
    timestamp: {
      $date: "2025-04-09T00:43:16.575Z",
    },
    createdAt: {
      $date: "2025-04-09T00:43:16.584Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:43:16.584Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c2dbf68cbd2bf6d7de31",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426909155910",
    count: 12391,
    avgStaked: "36109023416",
    timestamp: {
      $date: "2025-04-09T00:44:11.142Z",
    },
    createdAt: {
      $date: "2025-04-09T00:44:11.145Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:44:11.145Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c2dbf68cbd2bf6d7de32",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722456383474816",
    count: 1053457,
    avgStaked: "32011231956",
    timestamp: {
      $date: "2025-04-09T00:44:11.142Z",
    },
    createdAt: {
      $date: "2025-04-09T00:44:11.146Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:44:11.146Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c2dbf68cbd2bf6d7de33",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282271397",
    count: 5,
    avgStaked: "32056454279",
    timestamp: {
      $date: "2025-04-09T00:44:11.142Z",
    },
    createdAt: {
      $date: "2025-04-09T00:44:11.146Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:44:11.146Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c318f68cbd2bf6d7de35",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426909831150",
    count: 12391,
    avgStaked: "36109023471",
    timestamp: {
      $date: "2025-04-09T00:45:12.984Z",
    },
    createdAt: {
      $date: "2025-04-09T00:45:12.987Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:45:12.987Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c318f68cbd2bf6d7de36",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722454953785159",
    count: 1053457,
    avgStaked: "32011230599",
    timestamp: {
      $date: "2025-04-09T00:45:12.984Z",
    },
    createdAt: {
      $date: "2025-04-09T00:45:12.987Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:45:12.987Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c318f68cbd2bf6d7de37",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282271397",
    count: 5,
    avgStaked: "32056454279",
    timestamp: {
      $date: "2025-04-09T00:45:12.984Z",
    },
    createdAt: {
      $date: "2025-04-09T00:45:12.988Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:45:12.988Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c357e2979e5a5c8471e8",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426910596422",
    count: 12391,
    avgStaked: "36109023532",
    timestamp: {
      $date: "2025-04-09T00:46:15.052Z",
    },
    createdAt: {
      $date: "2025-04-09T00:46:15.058Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:46:15.058Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c357e2979e5a5c8471e9",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722453096228602",
    count: 1053457,
    avgStaked: "32011228836",
    timestamp: {
      $date: "2025-04-09T00:46:15.052Z",
    },
    createdAt: {
      $date: "2025-04-09T00:46:15.060Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:46:15.060Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c357e2979e5a5c8471ea",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282271397",
    count: 5,
    avgStaked: "32056454279",
    timestamp: {
      $date: "2025-04-09T00:46:15.052Z",
    },
    createdAt: {
      $date: "2025-04-09T00:46:15.061Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:46:15.061Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c3941426d4ab418fca7c",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426911226646",
    count: 12391,
    avgStaked: "36109023583",
    timestamp: {
      $date: "2025-04-09T00:47:16.452Z",
    },
    createdAt: {
      $date: "2025-04-09T00:47:16.458Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:47:16.458Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c3941426d4ab418fca7d",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722451676307176",
    count: 1053457,
    avgStaked: "32011227488",
    timestamp: {
      $date: "2025-04-09T00:47:16.452Z",
    },
    createdAt: {
      $date: "2025-04-09T00:47:16.460Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:47:16.460Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c3941426d4ab418fca7e",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282271397",
    count: 5,
    avgStaked: "32056454279",
    timestamp: {
      $date: "2025-04-09T00:47:16.452Z",
    },
    createdAt: {
      $date: "2025-04-09T00:47:16.460Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:47:16.460Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c3d09014cb134f16416c",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447426911901886",
    count: 12391,
    avgStaked: "36109023638",
    timestamp: {
      $date: "2025-04-09T00:48:16.006Z",
    },
    createdAt: {
      $date: "2025-04-09T00:48:16.009Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:48:16.009Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c3d09014cb134f16416d",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722450085213296",
    count: 1053457,
    avgStaked: "32011225978",
    timestamp: {
      $date: "2025-04-09T00:48:16.006Z",
    },
    createdAt: {
      $date: "2025-04-09T00:48:16.010Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:48:16.010Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c3d09014cb134f16416e",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282271397",
    count: 5,
    avgStaked: "32056454279",
    timestamp: {
      $date: "2025-04-09T00:48:16.006Z",
    },
    createdAt: {
      $date: "2025-04-09T00:48:16.011Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:48:16.011Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4079014cb134f164170",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447427017266669",
    count: 12391,
    avgStaked: "36109032141",
    timestamp: {
      $date: "2025-04-09T00:49:11.445Z",
    },
    createdAt: {
      $date: "2025-04-09T00:49:11.448Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:49:11.448Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4079014cb134f164171",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722202352569687",
    count: 1053449,
    avgStaked: "32011233911",
    timestamp: {
      $date: "2025-04-09T00:49:11.445Z",
    },
    createdAt: {
      $date: "2025-04-09T00:49:11.449Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:49:11.449Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4079014cb134f164172",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282317777",
    count: 5,
    avgStaked: "32056463555",
    timestamp: {
      $date: "2025-04-09T00:49:11.445Z",
    },
    createdAt: {
      $date: "2025-04-09T00:49:11.449Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:49:11.449Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4449014cb134f164174",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447427017671813",
    count: 12391,
    avgStaked: "36109032174",
    timestamp: {
      $date: "2025-04-09T00:50:12.171Z",
    },
    createdAt: {
      $date: "2025-04-09T00:50:12.173Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:50:12.173Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4449014cb134f164175",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722201018232113",
    count: 1053449,
    avgStaked: "32011232644",
    timestamp: {
      $date: "2025-04-09T00:50:12.171Z",
    },
    createdAt: {
      $date: "2025-04-09T00:50:12.174Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:50:12.174Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4449014cb134f164176",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282317777",
    count: 5,
    avgStaked: "32056463555",
    timestamp: {
      $date: "2025-04-09T00:50:12.171Z",
    },
    createdAt: {
      $date: "2025-04-09T00:50:12.174Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:50:12.174Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c47e9014cb134f164178",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447427018347053",
    count: 12391,
    avgStaked: "36109032228",
    timestamp: {
      $date: "2025-04-09T00:51:10.983Z",
    },
    createdAt: {
      $date: "2025-04-09T00:51:10.985Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:51:10.985Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c47e9014cb134f164179",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722199002196688",
    count: 1053449,
    avgStaked: "32011230730",
    timestamp: {
      $date: "2025-04-09T00:51:10.983Z",
    },
    createdAt: {
      $date: "2025-04-09T00:51:10.986Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:51:10.986Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c47e9014cb134f16417a",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282317777",
    count: 5,
    avgStaked: "32056463555",
    timestamp: {
      $date: "2025-04-09T00:51:10.983Z",
    },
    createdAt: {
      $date: "2025-04-09T00:51:10.986Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:51:10.986Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4bb9014cb134f16417c",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447427019022293",
    count: 12391,
    avgStaked: "36109032283",
    timestamp: {
      $date: "2025-04-09T00:52:11.043Z",
    },
    createdAt: {
      $date: "2025-04-09T00:52:11.045Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:52:11.045Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4bb9014cb134f16417d",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722197509373359",
    count: 1053449,
    avgStaked: "32011229313",
    timestamp: {
      $date: "2025-04-09T00:52:11.043Z",
    },
    createdAt: {
      $date: "2025-04-09T00:52:11.046Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:52:11.046Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4bb9014cb134f16417e",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282317777",
    count: 5,
    avgStaked: "32056463555",
    timestamp: {
      $date: "2025-04-09T00:52:11.043Z",
    },
    createdAt: {
      $date: "2025-04-09T00:52:11.046Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:52:11.046Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4f79014cb134f164180",
    },
    withdrawalCredentialPrefix: "0x00",
    totalStaked: "447427019292389",
    count: 12391,
    avgStaked: "36109032305",
    timestamp: {
      $date: "2025-04-09T00:53:11.270Z",
    },
    createdAt: {
      $date: "2025-04-09T00:53:11.273Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:53:11.273Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4f79014cb134f164181",
    },
    withdrawalCredentialPrefix: "0x01",
    totalStaked: "33722195934473987",
    count: 1053449,
    avgStaked: "32011227818",
    timestamp: {
      $date: "2025-04-09T00:53:11.270Z",
    },
    createdAt: {
      $date: "2025-04-09T00:53:11.274Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:53:11.274Z",
    },
    __v: 0,
  },
  {
    _id: {
      $oid: "67f5c4f79014cb134f164182",
    },
    withdrawalCredentialPrefix: "0x02",
    totalStaked: "160282317777",
    count: 5,
    avgStaked: "32056463555",
    timestamp: {
      $date: "2025-04-09T00:53:11.270Z",
    },
    createdAt: {
      $date: "2025-04-09T00:53:11.274Z",
    },
    updatedAt: {
      $date: "2025-04-09T00:53:11.274Z",
    },
    __v: 0,
  },
];

const convertValidatorSummaries = (data: ValidatorSummary[]) => {
  return data.map((entry: ValidatorSummary) => ({
    ...entry,
    _id: new ObjectId(entry._id.$oid),
    timestamp: new Date(entry.timestamp.$date),
    createdAt: new Date(entry.createdAt.$date),
    updatedAt: new Date(entry.updatedAt.$date),
  }));
};

export const validatorSummaries = convertValidatorSummaries(
  validatorSummariesData,
);
