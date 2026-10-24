/* Four list pages (fruit of the Spirit, armor of God, twelve tribes, ten plagues), counted from the KJV and WEB text by scripts/build-bible-lists.mjs */

import lists from "./data/bible-lists.json";

export const LISTS_DATE = lists.generated;
export const LISTS = lists;

/** "Genesis 29:32" -> "Genesis 29:32" link text only; the pages print references as plain text */
export const joinList = (items) => (items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`);
export const pct1 = (n, d) => ((n / d) * 100).toFixed(1);
