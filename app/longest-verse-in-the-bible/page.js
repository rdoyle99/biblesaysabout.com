import RankPage, { rankMetadata } from "@/components/RankPage";

const SLUG = "longest-verse-in-the-bible";
export const metadata = rankMetadata(SLUG);

export default function Page() {
  return <RankPage slug={SLUG} />;
}
