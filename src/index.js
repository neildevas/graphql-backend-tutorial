const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createPost = async (parent, args, context) => {
  const { description, url } = args;
  return prisma.link.create({
    data: {
      description,
      url,
    }
  })
};

const findLinkById = async (parent, args, context) => {
  const { id } = args;
  return prisma.link.findOne({
    where: {
      id: parseInt(id, 10),
    }
  })
};

const updateLink = (parent, args, context) => {
  const { linkId, description, url } = args;
  console.log('LINK ID', linkId);
  console.log(typeof linkId);
  const updateData = {};
  if (description) {
    updateData.description = description;
  }
  if (url) {
    updateData.url = url;
  }
  return prisma.link.update({
    where: { id: parseInt(linkId) },
    data: updateData,
  });
};

const deleteLink = async (parent, args, context) => {
  const { linkId } = args;
  return prisma.link.delete({
    where: {
      id: parseInt(linkId)
    }
  });
};

const resolvers = { // functions that get data
  Query: {
    info: () => `Api for hackernews`,
    feed: async (parent, args, context) => prisma.link.findMany(),
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
  context: {
    prisma
  }
});
server.start(() => console.log('Server is running on port 4000'));