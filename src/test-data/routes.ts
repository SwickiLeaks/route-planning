import type { Route } from "@/types/proto";

const SAMPLE_ROUTES: Route[] = [
  {
    id: "campbell-nashville",
    name: "Campbell–Nashville Corridor",
    distanceNm: 67,
    durationMin: 50,
    waypoints: [
      {
        id: "cam-aaf",
        name: "Campbell AAF",
        position: { lat: 36.6681, lng: -87.4962 },
        altitudeFt: 573,
      },
      {
        id: "clarksville",
        name: "Clarksville",
        position: { lat: 36.5298, lng: -87.3595 },
        altitudeFt: 2000,
      },
      {
        id: "springfield",
        name: "Springfield",
        position: { lat: 36.5092, lng: -86.8828 },
        altitudeFt: 2500,
      },
      {
        id: "jwn",
        name: "John C. Tune Airport",
        position: { lat: 36.1824, lng: -86.8886 },
        altitudeFt: 1500,
      },
      {
        id: "bna",
        name: "Nashville Intl (BNA)",
        position: { lat: 36.1245, lng: -86.6782 },
        altitudeFt: 599,
      },
    ],
  },
  {
    id: "cumberland-river",
    name: "Cumberland River Run",
    distanceNm: 50,
    durationMin: 40,
    waypoints: [
      {
        id: "cam-aaf-cr",
        name: "Campbell AAF",
        position: { lat: 36.6681, lng: -87.4962 },
        altitudeFt: 573,
      },
      {
        id: "ckv",
        name: "Outlaw Field (CKV)",
        position: { lat: 36.6219, lng: -87.415 },
        altitudeFt: 1200,
      },
      {
        id: "ashland-city",
        name: "Ashland City",
        position: { lat: 36.2743, lng: -87.0644 },
        altitudeFt: 1800,
      },
      {
        id: "dtn",
        name: "Downtown Nashville",
        position: { lat: 36.1627, lng: -86.7816 },
        altitudeFt: 2000,
      },
      {
        id: "bna",
        name: "Nashville Intl (BNA)",
        position: { lat: 36.1245, lng: -86.6782 },
        altitudeFt: 599,
      },
    ],
  },
  // {
  //   id: 'nashville-orbit',
  //   name: 'Nashville City Orbit',
  //   distanceNm: 19,
  //   durationMin: 20,
  //   waypoints: [
  //     {
  //       id: 'bna-orbit',
  //       name: 'Nashville Intl (BNA)',
  //       position: { lat: 36.1245, lng: -86.6782 },
  //       altitudeFt: 599,
  //     },
  //     {
  //       id: 'dtn-orbit',
  //       name: 'Downtown Nashville',
  //       position: { lat: 36.1627, lng: -86.7816 },
  //       altitudeFt: 1500,
  //     },
  //     {
  //       id: 'percy-priest',
  //       name: 'Percy Priest Lake',
  //       position: { lat: 36.133, lng: -86.61 },
  //       altitudeFt: 1500,
  //     },
  //     {
  //       id: 'bna-orbit-return',
  //       name: 'Nashville Intl (BNA)',
  //       position: { lat: 36.1245, lng: -86.6782 },
  //       altitudeFt: 599,
  //     },
  //   ],
  // },
];
