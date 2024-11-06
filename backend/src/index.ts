import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { WebSocketServer } from 'ws';

import env from '@/providers/env-config';
import logger from '@/utils/logger';

import resolvers from './gql/resolvers';
import schema from './gql/schema';
import typeDefs from './gql/typeDefs';
import { connect, disconnect } from './providers/database';

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());

const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  csrfPrevention: false,
  introspection: true,
  nodeEnv: env.NODE_ENV,
  cache: new InMemoryLRUCache({
    maxSize: Math.pow(2, 20) * 100, // ~100MiB
    ttl: 300_000, // 5 minutes in milliseconds
  }),
});

// Start Apollo Server
server.start().then(() => {
  // Apply Apollo Server as middleware on `/graphql` endpoint
  app.use('/graphql', expressMiddleware(server));

  // Create an HTTP server using Express
  const httpServer = http.createServer(app);

  // Set up WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Use `graphql-ws` to handle subscriptions
  useServer({ schema }, wsServer);

  // Start the HTTP server
  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 HTTP Server ready at http://localhost:${env.PORT}/graphql`);
    logger.info(`🚀 WebSocket Server ready at ws://localhost:${env.PORT}/graphql`);
    connect(); // Connect to the database
  });

  // Graceful Shutdown
  const onCloseSignal = () => {
    logger.info('SIGINT received, shutting down');
    disconnect();
    wsServer.close(() => {
      httpServer.close(() => process.exit(0));
    });
  };

  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);
});
