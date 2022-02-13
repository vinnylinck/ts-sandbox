import Book from '../models';

const booksResolvers = {
  Query: {
    books: () => Book.all(),
  },
};

export default booksResolvers;
