import { join } from 'path';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

import resolvers from '../resolvers';

const schema: GraphQLSchema = loadSchemaSync(
  join(__dirname, 'schema.graphql'),
  { loaders: [new GraphQLFileLoader()] },
);

export default addResolversToSchema({
  schema,
  resolvers,
});
