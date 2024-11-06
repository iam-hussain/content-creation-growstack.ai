import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';

import env from '@/providers/env-config';
import logger from '@/utils/logger';

import resolvers from './gql/resolvers';
import schema from './gql/schema';
import { connect, disconnect } from './providers/database';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  csrfPrevention: false,
  introspection: true,
  nodeEnv: env.NODE_ENV,
  cache: new InMemoryLRUCache({
    // ~100MiB
    maxSize: Math.pow(2, 20) * 100,
    // 5 minutes (in milliseconds)
    ttl: 300_000,
  }),
});

startStandaloneServer(server, {
  listen: { port: env.PORT },
}).then(({ url }) => {
  logger.info(`🚀 GraphQL ready at ${url}  ✅ ✅ ✅`);
  connect();
});

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');
  disconnect();
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
