/* First-party stats derived from verse lists (unique data per page) */

const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah",
  "Esther","Job","Psalm","Psalms","Proverb","Proverbs","Ecclesiastes","Song of Solomon",
  "Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel",
  "Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi",
]);

function bookFromReference(ref) {
  if (!ref) return "Unknown";
  // "1 John 4:8" / "Psalms 23:1" / "Song of Solomon 2:1"
  const m = ref.match(/^(\d?\s?[A-Za-z]+(?:\s[A-Za-z]+)?)/);
  return m ? m[1].trim() : "Unknown";
}

function isOT(book) {
  const b = book.replace(/^Psalms$/, "Psalm");
  return OT_BOOKS.has(book) || OT_BOOKS.has(b);
}

/**
 * @param {{ verses?: Array<{ reference: string }> }} topicData
 */
export function getTopicStats(topicData) {
  const verses = topicData?.verses || [];
  const total = verses.length;
  let ot = 0;
  let nt = 0;
  const bookCounts = {};

  for (const v of verses) {
    const book = bookFromReference(v.reference);
    bookCounts[book] = (bookCounts[book] || 0) + 1;
    if (isOT(book)) ot++;
    else nt++;
  }

  const topBook = Object.entries(bookCounts).sort((a, b) => b[1] - a[1])[0] || ["Bible", 0];

  return {
    total,
    ot,
    nt,
    otPercent: total ? Math.round((ot / total) * 100) : 0,
    ntPercent: total ? Math.round((nt / total) * 100) : 0,
    topBook: topBook[0],
    topBookCount: topBook[1],
    uniqueBooks: Object.keys(bookCounts).length,
  };
}

export function formatTopicSummary(topic, topicData, stats) {
  const name = topic.replace(/-/g, " ");
  const lead =
    stats.total >= 2
      ? `This collection has ${stats.total} Bible verses about ${name} — ${stats.ot} from the Old Testament and ${stats.nt} from the New Testament.`
      : `Bible verses about ${name}, gathered for study and encouragement.`;
  const bookLine =
    stats.topBookCount > 1
      ? ` ${stats.topBook} appears most often (${stats.topBookCount} verses), across ${stats.uniqueBooks} books of Scripture.`
      : ` Verses span ${stats.uniqueBooks} books of Scripture.`;
  return lead + bookLine;
}
