const feed = async (parent, args, context) => context.prisma.link.findMany();

const link = async (parent, args, context) => context.prisma.link.findOne({ where: { id: parseInt(args.id) } });

module.exports = {
  feed,
  link,
};