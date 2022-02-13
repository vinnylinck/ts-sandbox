import { gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';

const bookType: DocumentNode = gql`
  type Book {
    title: String
    author: String
  }
`;

export default bookType;
