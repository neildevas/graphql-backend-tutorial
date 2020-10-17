function postedBy(parent, args, context) {
  return context.prisma.link.findOne({ where: { id: parent.id } }).postedBy(); // Get the associated User of the found Link
}



module.exports = {
  postedBy,
};