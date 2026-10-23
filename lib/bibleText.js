/* Whole-Bible random draws from the full KJV and WEB text (lib/data/bible-text.json, built by
 * scripts/build-bible-text.mjs). Server only and loaded only by app/api/random-verse: the file is 8 MB. */

import bibleText from "@/lib/data/bible-text.json";
import { topicPool, decorate, refName } from "@/lib/verseTool";

const POOL_BY_REF = new Map(topicPool.map((e) => [e.reference, e]));

/** Every KJV verse is equally likely; testament "OT" | "NT" and book name narrow the draw */
export function randomBibleVerse({ testament, book } = {}) {
  const cells = [];
  let total = 0;
  bibleText.books.forEach(([name, t], i) => {
    if ((testament && t !== testament) || (book && name !== book)) return;
    bibleText.kjv[i].forEach((ch, c) => {
      total += ch.length;
      cells.push({ i, name, c, upTo: total, len: ch.length });
    });
  });
  if (!total) return null;
  for (let tries = 0; tries < 20; tries++) {
    const r = Math.floor(Math.random() * total);
    const cell = cells.find((x) => r < x.upTo);
    const v = r - (cell.upTo - cell.len);
    const kjv = bibleText.kjv[cell.i][cell.c][v];
    const web = (bibleText.web[cell.i][cell.c] || [])[v] || "";
    if (!kjv) continue;
    const reference = refName(cell.name, cell.c + 1, v + 1);
    const inPool = POOL_BY_REF.get(reference);
    return decorate({
      reference,
      book: cell.name,
      chapter: cell.c + 1,
      verse: v + 1,
      web,
      kjv,
      topics: inPool ? inPool.topics : [],
    });
  }
  return null;
}
