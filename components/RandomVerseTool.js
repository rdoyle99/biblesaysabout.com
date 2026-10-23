/* Random Bible verse generator: draws from the encouraging verses, every topic list or the whole Bible through
 * /api/random-verse.
 * The first verse is rendered on the server, so the page reads without JavaScript. */

"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "w-full rounded-lg border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function RandomVerseTool({ initial, topics, books, everydaySize, poolSize, bibleSize }) {
  const [verse, setVerse] = useState(initial);
  const [source, setSource] = useState("everyday");
  const [topic, setTopic] = useState("");
  const [testament, setTestament] = useState("");
  const [book, setBook] = useState("");
  const [translation, setTranslation] = useState("web");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const shownBooks = books.filter((b) => !testament || b.testament === testament);

  async function draw() {
    setLoading(true);
    setError("");
    setCopied(false);
    const q = new URLSearchParams({ source });
    if (source === "topics" && topic) q.set("topic", topic);
    if (testament) q.set("testament", testament);
    if (book) q.set("book", book);
    try {
      const res = await fetch(`/api/random-verse?${q}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong. Try again.");
      else setVerse(data);
    } catch {
      setError("Could not reach the server. Try again.");
    }
    setLoading(false);
  }

  // A few verses (Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, Romans 16:25-27) are in the KJV but not in the WEB text
  const shown = translation === "kjv" || !verse.web ? "kjv" : "web";

  async function copy() {
    const text = `"${shown === "kjv" ? verse.kjv : verse.web}" ${verse.reference} (${shown.toUpperCase()})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const text = shown === "kjv" ? verse.kjv : verse.web;

  return (
    <div className="rounded-xl border bg-card p-5 md:p-6">
      <blockquote className="border-l-4 border-l-primary/60 pl-4" aria-live="polite">
        <p className="scripture-text text-xl md:text-2xl leading-relaxed">{text}</p>
        <footer className="mt-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{verse.reference}</span> (
          {shown === "kjv" ? "King James Version" : "World English Bible"})
          {shown !== translation ? <span> This verse is not in the World English Bible text.</span> : null}
          {verse.bookSlug ? (
            <>
              {" · "}
              <Link href={`/books/${verse.bookSlug}`} className="underline underline-offset-2 hover:text-foreground">
                About {verse.book}
              </Link>
            </>
          ) : null}
        </footer>
        {verse.topics && verse.topics.length ? (
          <p className="mt-2 text-sm text-muted-foreground">
            On our lists for:{" "}
            {verse.topics.slice(0, 6).map((t, i) => (
              <span key={t.slug}>
                {i ? ", " : ""}
                <Link href={`/verses/${t.slug}`} className="underline underline-offset-2 hover:text-foreground">
                  {t.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </blockquote>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={draw}
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 touch-manipulation"
        >
          {loading ? "Drawing..." : "Give me another verse"}
        </button>
        <button type="button" onClick={copy} className="rounded-lg border px-4 py-2.5 hover:bg-muted touch-manipulation">
          {copied ? "Copied" : "Copy verse"}
        </button>
        <div className="flex rounded-lg border overflow-hidden" role="group" aria-label="Translation">
          {["web", "kjv"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTranslation(t)}
              className={`px-3 py-2.5 text-sm touch-manipulation ${translation === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <label className="block text-sm font-medium">
          Draw from
          <select
            className={`${inputClass} mt-1`}
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setTopic("");
            }}
          >
            <option value="everyday">Encouraging verses ({everydaySize.toLocaleString("en-US")})</option>
            <option value="topics">All our topic lists ({poolSize.toLocaleString("en-US")} verses)</option>
            <option value="bible">The whole Bible ({bibleSize.toLocaleString("en-US")} verses)</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Topic {source === "everyday" ? <span className="font-normal text-muted-foreground">(choosing one draws from all topic lists)</span> : null}
          <select
            className={`${inputClass} mt-1`}
            value={topic}
            disabled={source === "bible"}
            onChange={(e) => {
              setTopic(e.target.value);
              if (e.target.value) setSource("topics");
            }}
          >
            <option value="">Any topic</option>
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title} ({t.count})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Testament
          <select
            className={`${inputClass} mt-1`}
            value={testament}
            onChange={(e) => {
              setTestament(e.target.value);
              setBook("");
            }}
          >
            <option value="">Old and New Testament</option>
            <option value="OT">Old Testament</option>
            <option value="NT">New Testament</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Book
          <select className={`${inputClass} mt-1`} value={book} onChange={(e) => setBook(e.target.value)}>
            <option value="">Any book</option>
            {shownBooks.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
