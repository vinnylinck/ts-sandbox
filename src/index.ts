import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { DocumentNode } from 'graphql';
import { IResolvers } from '@graphql-tools/utils';
import tdfs from './typeDefs';
import rslvrs from './resolvers';

async function startApolloServer(typeDefs: DocumentNode[], resolvers: IResolvers[]) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen({ port: 5000 }, () => {
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
  });
}

startApolloServer(tdfs, rslvrs);
