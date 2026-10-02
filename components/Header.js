/* Header - Site navigation with search and mobile menu
 * Server wrapper: reads the topic list on the server and passes slug + icon to
 * the client header, so lib/verses.js never ships to the browser.
 * The interactive UI lives in components/HeaderClient.js.
 */

import HeaderClient from "@/components/HeaderClient";
import { getTopicList } from "@/lib/topic-index";

export default function Header() {
  return <HeaderClient topics={getTopicList()} />;
}
