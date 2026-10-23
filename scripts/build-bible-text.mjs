/**
 * Full KJV and WEB verse text for the random verse tool (app/api/random-verse, app/random-bible-verse).
 * Writes lib/data/bible-text.json: { generated, books: [[name, testament]], web: [[[verse, ...] per chapter] per book], kjv: same }.
 * Chapter and verse arrays are 0-based here (chapter 1 verse 1 = [0][0]); a verse missing from one translation is "".
 * Source: the same public-domain files as every other build script (scripts/lib/bible-source.mjs).
 *
 *   node scripts/build-bible-text.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "lib", "data", "bible-text.json");
const booksData = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "lib", "data", "bible-books.json"), "utf8"));

const web = await loadBible("web");
const kjv = await loadBible("kjv");

function pack(bible) {
  return bible.books.map((b) =>
    b.chapters.slice(1).map((ch) => (ch || []).slice(1).map((v) => v || ""))
  );
}

const out = {
  generated: booksData.bible.generated,
  books: BOOKS.map((b) => [b[0], b[3]]),
  web: pack(web),
  kjv: pack(kjv),
};

const count = (t) => out[t].reduce((s, b) => s + b.reduce((c, ch) => c + ch.filter(Boolean).length, 0), 0);
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`bible-text.json: WEB ${count("web")} verses, KJV ${count("kjv")} verses, ${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB`);
console.log(`bible-books.json says: WEB ${booksData.bible.web.verses}, KJV ${booksData.bible.kjv.verses}`);
