/* Names of God: lexicon data plus counts computed from the full KJV and WEB text by scripts/build-names-of-god.mjs */

import data from "./data/names-of-god.json";

export const NAMES_OF_GOD_DATE = data.generated;
export const GOD_NAMES = data.order.map((slug) => ({ slug, ...data.names[slug] }));
export const STRONGS_SOURCE = "Strong's Exhaustive Concordance of the Bible (1890), Hebrew dictionary, public domain";
export const STRONGS_READ = "2026-10-22";
export const STRONGS_NOTE =
  "Every Hebrew form, transliteration and definition on these pages was read against the matching Strong's entry on Biblehub on 2026-10-22. Verse text is the King James Version and the World English Bible, both public domain.";

export function getGodName(slug) {
  return GOD_NAMES.find((n) => n.slug === slug) || null;
}

/** The search to headline: the first one, from KJV if it has matches else WEB */
export function headlineSearch(n) {
  const key = Object.keys(n.searches)[0];
  const s = n.searches[key];
  const tr = s.kjv && s.kjv.n > 0 ? "kjv" : s.web && s.web.n > 0 ? "web" : s.kjv ? "kjv" : "web";
  return { key, tr, label: s.label, stat: s[tr] };
}

export const TR_NAME = { kjv: "King James Version", web: "World English Bible" };
export const TR_SHORT = { kjv: "KJV", web: "WEB" };
