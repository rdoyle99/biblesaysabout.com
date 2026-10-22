import BooksInOrder, { booksInOrderMetadata } from "@/components/BooksInOrder";

export const metadata = booksInOrderMetadata("all");

export default function Page() {
  return <BooksInOrder mode="all" />;
}
