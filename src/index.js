const { GraphQLServer } = require('graphql-yoga');

// Schema
// Written in Schema Definition Language (SDL)
// SDL allows you to define types
// Three root types: Query, Mutation, Subscription
// Each root type can take fields (called root fields) which will define the available API operations
const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }
  
  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

const links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}, {
  id: 'foo',
  description: 'bar',
  url: 'baz.com',
}];

const resolvers = { // functions that get data
  Query: {
    info: () => `Api for hackernews`,
    feed: () => links
  },
  Link: {
    id: (parent) => parent.id,
    description: parent => parent.description,
    url: parent => parent.url,
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});
server.start(() => console.log('Server is running on port 4000'));