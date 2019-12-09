// The duration of one round, after each round the limits are cleared
exports.FREQUENCY = 60000; // 1 min

// The total points a user can use in one round
exports.LIMIT = 300;

// different RPCs has different point costs
// { 'rpc-name': points }
exports.LIMITS = {
  'default': 1,
  'vote': 45,
  'post.create': 120,
  'comment.create': 120,
  'subcomment.create': 120
}
