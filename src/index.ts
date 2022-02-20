import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { context } from './context';
import sch from './schema';

async function startApolloServer(schema: GraphQLSchema) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context,
  });
  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen({ port: 5000 }, () => {
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
  });
}

startApolloServer(sch);
