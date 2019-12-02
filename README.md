# deepstream.io-permission-ratelimiter
RPC call rate limiter extension for the default Valve Permission plugin.

## Basic setup
- Clone this into your deepstream server's /lib directory.
- npm i inside ./lib/permission-ratelimiter
- Customize ./lib/permission-ratelimiter/config/config.js

## deepstream.io config file
```yaml
permission:
  path: './permission-ratelimiter/dist/limiter.js'
  options:
    permissions: fileLoad(permissions.yml)
    maxRuleIterations: 3
    cacheEvacuationInterval: 60000
```

## Rate limiter config file
- Set the total limit and configure the frequency.
- Add your project's RPC names into the LIMITS object.

```js
// The duration of one round, after each round the limits are cleared
exports.FREQUENCY = 60000; // 1 min

// The total points a user can use in one round
exports.LIMIT = 300;

// different RPCs has different point costs
// { 'rpc-name': points }
exports.LIMITS = {
  'default': 1,
  'vote': 20,
  'comment.create': 120,
  'subcomment.create': 120,
  'post.create': 120
}
```
