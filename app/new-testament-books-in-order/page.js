import BooksInOrder, { booksInOrderMetadata } from "@/components/BooksInOrder";

export const metadata = booksInOrderMetadata("nt");

export default function Page() {
  return <BooksInOrder mode="nt" />;
}
