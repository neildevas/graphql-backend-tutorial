const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const linkResolvers = require('./resolvers/link');

const prisma = new PrismaClient();

const resolvers = { // functions that get data
  Query,
  Mutation,
  Link: linkResolvers,
  User,
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma
  })
});
server.start(() => console.log('Server is running on port 4000'));