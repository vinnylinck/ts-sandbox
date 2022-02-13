import books, { BookRec } from '../data';

class Book {
  static all(): BookRec[] {
    return books;
  }
}

export default Book;
