import { gql } from 'apollo-server-express';

const query = gql`
  type Query {
    books: [Book]
  }
`;

export default query;
