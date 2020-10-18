const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('graphql-yoga');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const linkResolvers = require('./resolvers/link');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Link: linkResolvers,
  User,
  Subscription,
  Vote,
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma,
    pubsub,
  })
});

server.start(() => console.log('Server is running on port 4000'));