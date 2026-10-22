import BooksInOrder, { booksInOrderMetadata } from "@/components/BooksInOrder";

export const metadata = booksInOrderMetadata("ot");

export default function Page() {
  return <BooksInOrder mode="ot" />;
}
