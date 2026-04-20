// FILE: js/engines/trafficEngine.js

import { divide } from "../utils/math.js";

/* -----------------------------------
   TRAFFIC ENGINE
   Dates intentionally ignored
----------------------------------- */

/**
 * By style_id
 */
export function getTrafficByStyle(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const id =
      row.styleId;

    if (!id) return;

    map[id] = {
      impressions:
        Number(
          row.impressions
        ) || 0,

      clicks:
        Number(
          row.clicks
        ) || 0,

      addToCarts:
        Number(
          row.addToCarts
        ) || 0,

      rating:
        Number(
          row.rating
        ) || 0
    };

    map[id].ctr =
      getCtr(
        map[id]
          .clicks,
        map[id]
          .impressions
      );
  });

  return map;
}

/**
 * Brand totals
 */
export function getTrafficByBrand(
  rows = []
) {
  const map = {};

  rows.forEach((row) => {
    const brand =
      row.brand ||
      "Unknown";

    if (!map[brand]) {
      map[brand] = {
        impressions: 0,
        clicks: 0,
        addToCarts: 0,
        ratingTotal: 0,
        styles: 0,
        rating: 0,
        ctr: 0
      };
    }

    map[brand]
      .impressions +=
      Number(
        row.impressions
      ) || 0;

    map[brand]
      .clicks +=
      Number(
        row.clicks
      ) || 0;

    map[brand]
      .addToCarts +=
      Number(
        row.addToCarts
      ) || 0;

    map[brand]
      .ratingTotal +=
      Number(
        row.rating
      ) || 0;

    map[brand]
      .styles += 1;
  });

  Object.values(
    map
  ).forEach((item) => {
    item.ctr =
      getCtr(
        item.clicks,
        item.impressions
      );

    item.rating =
      divide(
        item.ratingTotal,
        item.styles
      );
  });

  return map;
}

/* -----------------------------------
   HELPERS
----------------------------------- */

export function getCtr(
  clicks = 0,
  impressions = 0
) {
  return (
    divide(
      clicks,
      impressions
    ) * 100
  );
}
