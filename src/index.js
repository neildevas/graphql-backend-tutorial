const { GraphQLServer } = require('graphql-yoga');

// Schema
// Written in Schema Definition Language (SDL)
// SDL allows you to define types
// Three root types: Query, Mutation, Subscription
// Each root type can take fields (called root fields) which will define the available API operations

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL',
  is_deleted: false,
}, {
  id: 'foo',
  description: 'bar',
  url: 'baz.com',
  is_deleted: false,
}];

let getIdCount = () => links.length;
const createPost = (parent, args) => {
  console.log('PARENT', parent);
  console.log('ARGS', args);
  const newPost = {
    id: `id-${getIdCount()}`,
    description: args.description,
    url: args.url,
  };
  links.push(newPost);
  return newPost;
};

const findLink = (id) => {
  const link = links.find(link => link.id === id);
  if (!link) {
    throw new Error('Could not find link');
  }
  return link
};

const findLinkById = (parent, args) => {
  const { id } = args;
  return links.find(link => link.id === id);
};

const updateLink = (parent, args) => {
  const { linkId, description, url } = args;
  const link = findLink(linkId);
  if (description) {
    link.description = description;
  }
  if (url) {
    link.url = url;
  }
  return link
};

const deleteLink = (parent, args) => {
  const { linkId } = args;
  const linkToDelete = findLink(linkId);
  linkToDelete.is_deleted = true;
  links = links.map(link => {
    if (link.id === linkToDelete.id) {
      return linkToDelete;
    }
    return link;
  });
  return linkToDelete
};

const resolvers = { // functions that get data
  Query: {
    info: () => `Api for hackernews`,
    feed: () => links,
    link: findLinkById,
  },
  Mutation: {
    createPost,
    updateLink,
    deleteLink
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});
server.start(() => console.log('Server is running on port 4000'));