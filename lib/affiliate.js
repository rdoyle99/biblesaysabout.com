/* Amazon Associates links. The tracking tag comes from AMAZON_ASSOCIATES_TAG (Vercel env). Until it is set,
 * links open plain Amazon search results and the earnings disclosure stays hidden (there is nothing to disclose).
 * Search-result links only: no product ASINs are typed by hand.
 */

export const AMAZON_TAG = process.env.AMAZON_ASSOCIATES_TAG || "";

export function amazonSearch(query) {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", query);
  if (AMAZON_TAG) url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}

export const AMAZON_DISCLOSURE = "As an Amazon Associate, Bible Says About earns from qualifying purchases.";
