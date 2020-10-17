// The actual resolver needs to be assigned as the value for the 'subscibe' field
function newLinkSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => payload, // returns the value returned by the resolver
};

module.exports = {
  newLink,
};