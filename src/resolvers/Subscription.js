// The actual resolver needs to be assigned as the value for the 'subscibe' field
function newLinkSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator('NEW_LINK');
}

function newVoteSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_VOTE")
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => payload, // returns the value returned by the resolver
};

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: payload => payload,
};

module.exports = {
  newLink,
  newVote,
};