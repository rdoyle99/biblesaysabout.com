# Bible Says About: word counts in the KJV and World English Bible for 253 words and names

This dataset has one row for each of the 253 words and names we publish a count page for on Bible Says About. For each we give how often it appears in the King James Version and in the World English Bible, how many verses contain it, how the counts split between the Old and New Testaments, and the number of books it appears in. The counts are ours; the two Bible texts are in the public domain.

- **Source:** Our counts from the full text of the King James Version (1769) and the World English Bible, both public domain, from the open-bibles project (https://github.com/seven1m/open-bibles). Pages: https://www.biblesaysabout.com/words/.
- **Published by:** Bible Says About, https://www.biblesaysabout.com
- **Rows:** 253 (one header line, comma-separated, UTF-8)
- **License:** CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Reuse with attribution.
- **Date built:** 2026-10-15
- **File:** bible-says-about-dataset.csv

## Column dictionary

| column | description |
|---|---|
| `word` | The word or name |
| `kind` | word or name |
| `kjv_total` | Total occurrences in the KJV, including listed variant forms |
| `kjv_verses` | KJV verses containing the word |
| `kjv_old_testament` | KJV occurrences in the Old Testament |
| `kjv_new_testament` | KJV occurrences in the New Testament |
| `kjv_books` | Number of KJV books containing the word |
| `web_total` | Total occurrences in the WEB, including listed variant forms |
| `web_verses` | WEB verses containing the word |
| `web_old_testament` | WEB occurrences in the Old Testament |
| `web_new_testament` | WEB occurrences in the New Testament |
| `web_books` | Number of WEB books containing the word |
| `kjv_first_ref` | First KJV verse containing the word (may be empty) |
| `kjv_last_ref` | Last KJV verse containing the word (may be empty) |
| `kjv_most_in_one_verse_ref` | A KJV verse with the most occurrences of the word (may be empty) |
| `kjv_most_in_one_verse_count` | Occurrences in that verse |
| `url_path` | Path of the matching page on the site |

## Notes

Which spellings count toward a word differs by translation (for example the KJV's loveth); each word's page lists the forms counted. Names are counted by the forms listed on their pages.

## Citation

Bible Says About (https://www.biblesaysabout.com). "Bible Says About: word counts in the KJV and World English Bible for 253 words and names." Built 2026-10-15. Licensed CC BY 4.0.
