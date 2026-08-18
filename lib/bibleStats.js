/* Bible reading statistics — every stat verified against a named research
 * organization's own published page or report. Do not add a stat here without
 * a real, fetchable source URL. No estimates, no rounded-from-memory numbers.
 */

export const STATS_UPDATED = "2026-08-18";

export const statSections = [
  {
    id: "reading-habits",
    name: "Bible Reading Habits & Frequency",
    intro:
      "How often people actually open a Bible, and how much of it they have read.",
    stats: [
      {
        claim:
          "Just 9% of Americans read the Bible every day and 25% use it weekly, while 38% never use it.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "Only 25% of Americans are active Bible users in 2026, with 13% occasional users and 62% not reading Scripture.",
        org: "American Bible Society",
        year: "2026",
        url: "https://sotb.americanbible.org/the-bible-in-america-today/",
      },
      {
        claim:
          "22% of U.S. adults read scripture outside of religious services at least once a week, while 61% seldom or never do.",
        org: "Pew Research Center",
        year: "2023-24",
        url: "https://www.pewresearch.org/religion/2025/02/26/prayer-and-other-religious-practices/",
      },
      {
        claim:
          "31% of American Protestant churchgoers say reading the Bible is a daily habit, and 9% read it rarely or never.",
        org: "Lifeway Research",
        year: "2026",
        url: "https://research.lifeway.com/2026/02/10/fewer-than-1-in-3-churchgoers-read-the-bible-daily/",
      },
      {
        claim:
          "Daily Bible reading among churchgoers rose from 16% in 2007 to 19% in 2012 to 31% in 2026.",
        org: "Lifeway Research",
        year: "2007-2026",
        url: "https://research.lifeway.com/2026/02/10/fewer-than-1-in-3-churchgoers-read-the-bible-daily/",
      },
      {
        claim: "Only 22% of churchgoers have read the entire Bible at least once.",
        org: "Lifeway Research",
        year: "2026",
        url: "https://research.lifeway.com/2026/02/10/fewer-than-1-in-3-churchgoers-read-the-bible-daily/",
      },
      {
        claim:
          "51% of Americans say they have read at least half the Bible, but only 22% have read it all the way through.",
        org: "Lifeway Research",
        year: "2025",
        url: "https://research.lifeway.com/2025/05/13/americans-judge-the-good-book-more-positively-but-still-often-by-its-cover/",
      },
      {
        claim: "9% of U.S. adults have never read any of the Bible personally.",
        org: "Lifeway Research",
        year: "2025",
        url: "https://research.lifeway.com/2025/05/13/americans-judge-the-good-book-more-positively-but-still-often-by-its-cover/",
      },
      {
        claim:
          "17% of Americans say they have read the Bible in its entirety, while only 10% say they have read none of it.",
        org: "American Bible Society",
        year: "2026",
        url: "https://www.americanbible.org/news/press-releases/articles/state-of-the-bible-2026-chapter-1/",
      },
      {
        claim:
          "74% of people who follow a Bible reading plan or guide have read most or all of the Bible.",
        org: "American Bible Society",
        year: "2026",
        url: "https://sotb.americanbible.org/the-bible-in-america-today/",
      },
      {
        claim:
          "51% of all Americans wish they read the Bible more, rising to 80% among the “Movable Middle.”",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/news/press-releases/articles/sotb-2025-release/",
      },
      {
        claim: "Bible readership in America fell from 73% in the 1980s to 59% in 2000.",
        org: "Gallup",
        year: "2000",
        url: "https://news.gallup.com/poll/2416/six-ten-americans-read-bible-least-occasionally.aspx",
      },
    ],
  },
  {
    id: "ownership",
    name: "Bible Ownership",
    intro:
      "Owning a Bible and reading a Bible are two very different numbers. Note the measures differ: American Bible Society counts individuals, Barna counts households.",
    stats: [
      {
        claim: "77% of Americans say they own a Bible, up from 74% the previous year.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "88% of American households own at least one Bible, and the average household has 4.7 Bibles.",
        org: "Barna Group",
        year: "2014",
        url: "https://www.barna.com/research/the-state-of-the-bible-6-trends-for-2014/",
      },
      {
        claim:
          "Bible ownership ranges from 82% of Millennial households to 93% of Elder households.",
        org: "Barna Group",
        year: "2017",
        url: "https://www.barna.com/research/state-bible-2017-top-findings/",
      },
      {
        claim: "24% of American Bible owners have six or more Bibles in their home.",
        org: "Barna Group",
        year: "2013",
        url: "https://www.barna.com/research/what-do-americans-really-think-about-the-bible/",
      },
    ],
  },
  {
    id: "translation",
    name: "Bible Translation & Global Availability",
    intro:
      "How many of the world's languages have Scripture, and how many are still waiting.",
    stats: [
      {
        claim: "There are 7,396 living languages in the world today.",
        org: "Wycliffe Global Alliance",
        year: "2025",
        url: "https://wycliffe.net/global-scripture-access/",
      },
      {
        claim:
          "The full Bible has been translated into 805 languages, the New Testament into 1,842 more, and Scripture portions into another 1,520.",
        org: "Wycliffe Bible Translators UK",
        year: "2026",
        url: "https://wycliffe.org.uk/statistics/",
      },
      {
        claim: "3,229 languages still have no Scripture at all.",
        org: "Wycliffe Bible Translators UK",
        year: "2026",
        url: "https://wycliffe.org.uk/statistics/",
      },
      {
        claim:
          "Roughly 1 in 5 people worldwide is still waiting for the Bible in their own language.",
        org: "Wycliffe Bible Translators UK",
        year: "2026",
        url: "https://wycliffe.org.uk/statistics/",
      },
      {
        claim:
          "Bible translation work is currently in progress in 4,440 languages, with a new translation project starting on average every day.",
        org: "Wycliffe Bible Translators UK",
        year: "2026",
        url: "https://wycliffe.org.uk/statistics/",
      },
      {
        claim:
          "535 languages still need Bible translation to begin for the very first time, down from 985 a year earlier.",
        org: "Wycliffe Bible Translators USA",
        year: "2026",
        url: "https://www.wycliffe.org/progress",
      },
      {
        claim:
          "The 544 languages still waiting for translation to begin are spoken by 36.8 million people.",
        org: "Wycliffe Global Alliance",
        year: "2025",
        url: "https://wycliffe.net/global-scripture-access/",
      },
      {
        claim:
          "More than 99% of the world's population now has access to at least some Scripture in a language they understand.",
        org: "Wycliffe Global Alliance",
        year: "2025",
        url: "https://wycliffe.net/global-scripture-access/",
      },
      {
        claim:
          "Bible translations were published in 100 languages used by about 566 million people during 2025, including 66 languages receiving Scripture for the first time.",
        org: "United Bible Societies",
        year: "2025",
        url: "https://unitedbiblesocieties.org/100-languages-receive-bible-translations-in-2025-reaching-566-million-people-worldwide/",
      },
      {
        claim:
          "More than 1.5 billion people still lack the full Bible in their own language, and 123 million have no Scripture at all in their heart language.",
        org: "United Bible Societies",
        year: "2025",
        url: "https://unitedbiblesocieties.org/100-languages-receive-bible-translations-in-2025-reaching-566-million-people-worldwide/",
      },
      {
        claim:
          "Bible Societies distributed 148.3 million printed Scriptures in 2025, including 22.4 million full Bibles.",
        org: "United Bible Societies",
        year: "2025",
        url: "https://unitedbiblesocieties.org/25-billion-scriptures-distributed-in-80-years-ubs-distribution-statistics-report-2025/",
      },
      {
        claim:
          "Bible Societies have distributed more than 25 billion Scriptures, including 1.1 billion full Bibles, across 80 years in more than 240 countries.",
        org: "United Bible Societies",
        year: "2025",
        url: "https://unitedbiblesocieties.org/25-billion-scriptures-distributed-in-80-years-ubs-distribution-statistics-report-2025/",
      },
    ],
  },
  {
    id: "engagement-trends",
    name: "Bible Engagement Trends Over Time",
    intro:
      "The 2022 collapse and the 2025 rebound are the two biggest movements in modern Bible engagement data.",
    stats: [
      {
        claim:
          "Bible Use among U.S. adults fell from 50% in 2021 to 40% in 2022, the sharpest single-year drop the survey has recorded.",
        org: "American Bible Society",
        year: "2022",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "The Bible Disengaged category grew by 45.2 million U.S. adults in one year between 2021 and 2022.",
        org: "American Bible Society",
        year: "2022",
        url: "https://www.americanbible.org/news/press-releases/articles/newly-released-12th-annual-state-of-the-bible-report/",
      },
      {
        claim:
          "Bible Users bottomed at 38% of U.S. adults (99 million) in 2024, down from 49% (124 million) in 2019, then rebounded to 41% (110 million) in 2025.",
        org: "American Bible Society",
        year: "2024-25",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "Scripture Engaged Americans fell from 25% in 2021 to 18% in 2024, then rose to 20% (more than 52 million) in 2025.",
        org: "American Bible Society",
        year: "2021-25",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "The Bible Disengaged share jumped from 39% in 2021 to 56% in 2022 and stood at 54% in 2025.",
        org: "American Bible Society",
        year: "2021-25",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "In 2026 the Movable Middle grew to 28% of the U.S. population, up 9 million since 2024, while Scripture Engaged slipped back to 17%.",
        org: "American Bible Society",
        year: "2026",
        url: "https://www.americanbible.org/news/press-releases/articles/state-of-the-bible-2026-chapter-1/",
      },
      {
        claim:
          "Bible reading among U.S. adults rose from a 25-year low of 30% in 2024 to 42% in 2025, the highest rate since 2012.",
        org: "Barna Group",
        year: "2025",
        url: "https://www.barna.com/trends/bible-reading-trends/",
      },
      {
        claim:
          "Only 36% of U.S. adults strongly agree the Bible is totally accurate in the principles it teaches, down from 43% in 2000.",
        org: "Barna Group",
        year: "2025",
        url: "https://www.barna.com/trends/bible-reading-trends/",
      },
    ],
  },
  {
    id: "demographics",
    name: "Who Reads the Bible: Demographics",
    intro:
      "Age, gender, ethnicity, and region all move Bible use by double digits.",
    stats: [
      {
        claim:
          "Bible use rises with age in 2025: 36% of Gen Z adults, 39% of Millennials, 42% of Gen X, and 46% of Boomers and older are Bible Users.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "Gen Z Bible reading jumped from 30% in 2024 to 49% in 2025, and Millennials from 34% to 50%.",
        org: "Barna Group",
        year: "2025",
        url: "https://www.barna.com/trends/bible-reading-trends/",
      },
      {
        claim:
          "Scripture Engagement among Gen Z rose from 11% to 15% and among Millennials from 12% to 17% between 2024 and 2025.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/news/press-releases/articles/sotb-2025-release/",
      },
      {
        claim:
          "Men closed the Bible-use gender gap from seven points in 2024 (41% women vs 34% men) to one point in 2025 (42% vs 41%).",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "Two out of three Black Americans (68%) are Bible Users, versus 41% of Hispanic, 38% of Asian, and 37% of white Americans.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "Scripture Engagement among Black Americans rose from 27% to 36% in one year, twice the level of white or Hispanic Americans (18% each).",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "The South leads U.S. Bible use at 48%, with the West and Midwest at 39% and the Northeast at 33%.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
      {
        claim:
          "Americans 65 and older are the age group most likely to have never read any of the Bible, at 15%.",
        org: "Lifeway Research",
        year: "2025",
        url: "https://research.lifeway.com/2025/05/13/americans-judge-the-good-book-more-positively-but-still-often-by-its-cover/",
      },
    ],
  },
  {
    id: "digital",
    name: "Digital Bibles & App Usage",
    intro:
      "Bible apps are now the fastest-moving channel in Scripture engagement.",
    stats: [
      {
        claim:
          "The YouVersion Bible App has been installed on more than one billion devices worldwide.",
        org: "YouVersion",
        year: "2025",
        url: "https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year",
      },
      {
        claim:
          "YouVersion's 2025 Verse of the Year was Isaiah 41:10, the fourth time in six years it topped the list.",
        org: "YouVersion",
        year: "2025",
        url: "https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year",
      },
      {
        claim:
          "On November 2, 2025, a single-day record 19 million people opened the YouVersion Bible App.",
        org: "YouVersion",
        year: "2025",
        url: "https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year",
      },
      {
        claim:
          "YouVersion users complete 40 Bible Plan days and highlight, bookmark, or note 112 verses every second on average.",
        org: "YouVersion",
        year: "2025",
        url: "https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year",
      },
      {
        claim:
          "3 million people subscribed to a one-year Bible Plan on New Year's Day 2025 alone.",
        org: "YouVersion",
        year: "2025",
        url: "https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year",
      },
      {
        claim: "The YouVersion Bible App offers Scripture in more than 2,400 languages.",
        org: "YouVersion",
        year: "2025",
        url: "https://www.youversion.com/news/youversion-announces-2025-verse-of-the-year",
      },
      {
        claim:
          "About 14 million people engaged with the Bible every day across YouVersion's apps in 2024, averaging 11.2 million new device installs per month.",
        org: "YouVersion",
        year: "2024",
        url: "https://www.prnewswire.com/news-releases/youversions-verse-of-the-year-reflects-global-trend-of-seeking-peace-through-prayer-302316829.html",
      },
      {
        claim:
          "YouVersion recorded more than 100 million new app installs in 2023, and over 80% were outside the United States.",
        org: "YouVersion",
        year: "2023",
        url: "https://www.prnewswire.com/news-releases/youversions-2023-verse-of-the-year-spotlights-a-widespread-search-for-peace-301994326.html",
      },
      {
        claim:
          "Bible chapters were viewed 32.2 billion times digitally in 2025, up 13.8% year over year, alongside 1.4 billion audio Scripture plays.",
        org: "United Bible Societies",
        year: "2025",
        url: "https://unitedbiblesocieties.org/25-billion-scriptures-distributed-in-80-years-ubs-distribution-statistics-report-2025/",
      },
      {
        claim:
          "Two-thirds of U.S. Bible Users access the Bible digitally at least some of the time, and 62% of those use Bible apps.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/news/press-releases/articles/sotb-2025-release/",
      },
      {
        claim:
          "Nearly 80% of Bible Users read a printed Bible at least monthly, while 62% use digital text at least monthly.",
        org: "American Bible Society",
        year: "2026",
        url: "https://www.americanbible.org/news/press-releases/articles/state-of-the-bible-2026-chapter-1/",
      },
    ],
  },
  {
    id: "beliefs",
    name: "What Americans Believe About the Bible",
    intro: "Gallup has tracked biblical literalism since the 1970s. It is falling.",
    stats: [
      {
        claim:
          "A record-low 20% of Americans say the Bible is the literal word of God, down from around 40% in the early 1980s.",
        org: "Gallup",
        year: "2022",
        url: "https://news.gallup.com/poll/394262/fewer-bible-literal-word-god.aspx",
      },
      {
        claim:
          "A record-high 29% of Americans call the Bible a collection of fables, legends, history, and moral precepts recorded by man, while 49% call it the inspired word of God not to be taken entirely literally.",
        org: "Gallup",
        year: "2022",
        url: "https://news.gallup.com/poll/394262/fewer-bible-literal-word-god.aspx",
      },
      {
        claim: "30% of Protestants take the Bible literally, versus 15% of Catholics.",
        org: "Gallup",
        year: "2022",
        url: "https://news.gallup.com/poll/394262/fewer-bible-literal-word-god.aspx",
      },
      {
        claim:
          "Biblical literalism among Americans aged 18-29 fell from 32% in 1976 to 12% in 2017.",
        org: "Gallup",
        year: "2017",
        url: "https://news.gallup.com/poll/210704/record-few-americans-believe-bible-literal-word-god.aspx",
      },
      {
        claim:
          "Three-quarters of U.S. Christians say the Bible is the word of God, and 39% say it should be taken literally.",
        org: "Pew Research Center",
        year: "2017",
        url: "https://www.pewresearch.org/short-reads/2017/04/14/5-facts-on-how-americans-view-the-bible-and-other-religious-texts/",
      },
      {
        claim:
          "42% of U.S. Christians say reading the Bible is essential to what being Christian means to them.",
        org: "Pew Research Center",
        year: "2017",
        url: "https://www.pewresearch.org/short-reads/2017/04/14/5-facts-on-how-americans-view-the-bible-and-other-religious-texts/",
      },
    ],
  },
  {
    id: "global",
    name: "Church & Global Christianity",
    intro:
      "The worldwide context the reading numbers sit inside.",
    stats: [
      {
        claim:
          "The number of Christians worldwide rose by 122 million between 2010 and 2020, reaching 2.3 billion, but fell 1.8 points as a share of world population, to 28.8%.",
        org: "Pew Research Center",
        year: "2020 data, published 2025",
        url: "https://www.pewresearch.org/religion/2025/06/09/how-the-global-religious-landscape-changed-from-2010-to-2020/",
      },
      {
        claim:
          "30.7% of the world's Christians live in sub-Saharan Africa, 24% in Latin America and the Caribbean, and 22.3% in Europe.",
        org: "Pew Research Center",
        year: "2020 data, published 2025",
        url: "https://www.pewresearch.org/religion/2025/06/09/how-the-global-religious-landscape-changed-from-2010-to-2020/",
      },
      {
        claim:
          "The United States has more Christian residents than any other country, about one-tenth of the world's Christians.",
        org: "Pew Research Center",
        year: "2020 data, published 2025",
        url: "https://www.pewresearch.org/religion/2025/06/09/christian-population-change/",
      },
      {
        claim:
          "68% of Practicing Christians are Scripture Engaged, and only 12% of Scripture Engaged Americans are unchurched.",
        org: "American Bible Society",
        year: "2025",
        url: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
      },
    ],
  },
];

export const totalStatCount = statSections.reduce(
  (sum, s) => sum + s.stats.length,
  0
);

export const sourceOrgs = [
  ...new Set(statSections.flatMap((s) => s.stats.map((st) => st.org))),
].sort();

/* Chart data — every value traced to a stat above. */

export const bibleUserTrend = {
  caption:
    "Share of U.S. adults classified as Bible Users, State of the Bible (American Bible Society)",
  source: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
  unit: "%",
  points: [
    { label: "2019", value: 49 },
    { label: "2021", value: 50 },
    { label: "2022", value: 40 },
    { label: "2024", value: 38 },
    { label: "2025", value: 41 },
  ],
};

export const generationUse = {
  caption:
    "Bible Users by generation, 2025 (American Bible Society, State of the Bible 2025)",
  source: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
  unit: "%",
  points: [
    { label: "Gen Z", value: 36 },
    { label: "Millennials", value: 39 },
    { label: "Gen X", value: 42 },
    { label: "Boomers+", value: 46 },
  ],
};

export const literalismTrend = {
  caption:
    "Share of Americans who say the Bible is the literal word of God (Gallup)",
  source: "https://news.gallup.com/poll/394262/fewer-bible-literal-word-god.aspx",
  unit: "%",
  points: [
    { label: "Early 1980s", value: 40 },
    { label: "2017", value: 24 },
    { label: "2022", value: 20 },
  ],
};

export const translationStatus = {
  caption:
    "World languages by Scripture status (Wycliffe Bible Translators UK, 2026)",
  source: "https://wycliffe.org.uk/statistics/",
  unit: " languages",
  points: [
    { label: "Full Bible", value: 805 },
    { label: "New Testament only", value: 1842 },
    { label: "Portions only", value: 1520 },
    { label: "No Scripture yet", value: 3229 },
  ],
};

export const regionUse = {
  caption: "U.S. Bible use by region, 2025 (American Bible Society)",
  source: "https://www.americanbible.org/wp-content/uploads/2025/04/SOTB-2025-04-Final.pdf",
  unit: "%",
  points: [
    { label: "South", value: 48 },
    { label: "West", value: 39 },
    { label: "Midwest", value: 39 },
    { label: "Northeast", value: 33 },
  ],
};

/* Gallup literalism 2017 figure: see
 * https://news.gallup.com/poll/210704/record-few-americans-believe-bible-literal-word-god.aspx
 */
