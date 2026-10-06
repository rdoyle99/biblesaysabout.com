/* What a Bible name means, from Hitchcock's Bible Names Dictionary (1869, public domain). Built by scripts/build-bible-names.mjs */

import namesData from "./data/bible-names.json";

export const NAMES_DATE = namesData.generated;
export const NAMES_SOURCE = "Hitchcock's Bible Names Dictionary (1869)";
export const NAMES_NOTE =
  "Meanings come from Hitchcock's Bible Names Dictionary, published in 1869 and in the public domain. It records the traditional meaning of each name; modern scholars often read names differently, and some of these glosses are disputed.";
export const NAMES_NOTE_SHORT = "This is the 1869 traditional meaning; modern scholars often read names differently.";

/** "that quavers or totters (Zelophehad's daughter)" -> { gloss, who } */
export function splitMeaning(text) {
  const m = text.match(/^(.*?)\s*\(([^()]+)\)$/);
  return m ? { gloss: m[1], who: m[2] } : { gloss: text, who: null };
}

/** The meaning record for a name page, or null */
export function getMeaning(slug) {
  const n = namesData.names[slug];
  return n ? { ...n, main: n.entries[0], others: n.entries.slice(1) } : null;
}

/** The meaning a name page shows: held pages (30+ impressions when this shipped) keep their old page until their window ends */
export function getPageMeaning(slug) {
  const m = getMeaning(slug);
  return m && !m.held ? m : null;
}

export function allMeanings() {
  return Object.entries(namesData.names).map(([slug, n]) => ({ slug, ...n, main: n.entries[0], others: n.entries.slice(1) }));
}

/** "repose; consolation" -> a sentence */
export function meaningSentence(m, name) {
  const lead = m.main.via
    ? `Hitchcock lists ${name} as the same name as ${m.main.via}, which he glosses as "${m.main.meaning}".`
    : `Hitchcock's Bible Names Dictionary glosses ${name} as "${m.main.meaning}".`;
  if (!m.others.length) return lead;
  const extra = m.others
    .map((o) => {
      const { gloss, who } = splitMeaning(o.meaning);
      return `"${gloss}"${who ? ` (${who})` : ""}`;
    })
    .join("; ");
  return `${lead} He lists ${m.others.length === 1 ? "one more entry" : `${m.others.length} more entries`} under the same spelling, for another person or place: ${extra}.`;
}
