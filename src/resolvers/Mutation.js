const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({ data: { ...args, password } });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  }
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findOne({ where: { email: args.email } });
  if (!user) {
    throw new Error('No such user found')
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password')
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  }
}

async function createLink(parent, args, context) {
  const userId = getUserId(context);
  const newLink = context.prisma.link.create({
    data: {
      ...args,
      postedBy: {
        connect: { id: userId },
      }
    }
  });
  context.pubsub.publish('NEW_LINK', newLink);
  return newLink
}

async function updateLink(parent, args, context) {
  const { linkId, description, url } = args;
  const parsedLinkId = parseInt(linkId);
  const userId = getUserId(context);
  const link = context.prisma.link.findFirst({
    where: {
      AND: [{ postedById: userId }, { id: parsedLinkId }]
    }
  });
  if (!link) {
    throw new Error('Could not find link');
  }
  return context.prisma.link.update({
    data: { description, url },
    where: {
      id: parsedLinkId
    }
  })
}

async function deleteLink(parent, args, context) {
  const { linkId } = args;
  const parsedLinkId = parseInt(linkId);
  getUserId(context);
  return context.prisma.link.delete({
    where: {
      id: parsedLinkId,
    }
  })
}

async function vote(parent, args, context) {
  const { linkId } = args;
  const userId = getUserId(context);
  const vote = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId
      }
    }
  });
}

module.exports = {
  signup,
  login,
  createLink,
  updateLink,
  deleteLink,
};