# deepstream.io-permission-ratelimiter
RPC call rate limiter extension for the default Valve Permission plugin.

## Use case
### Protect against DoS attacks
Defense against DoS attacks on the network level is always better than on the application level, but WebSocket protection costs a lot, so this plugin can be useful.

A WebSocket attack is easy to do, any user can run this code in the browser's console:
```js
while (true) {
  deepstream.rpc.make('comment.create', {}, (err, res) => {});
}
```
A deepstream server might handle this load (1-2 million req/s) but the RPC providers certainly won't, especially if RPCs do Database operations.

### Protect against spam
With this plugin you can prevent server crash if you limit every user to 100 RPC/min, but 100 new comment every minute is still too much.

To prevent spamming you can set higher costs for the `comment.create` RPC, and limit it to 1-2 call/min.

## Basic setup
- Clone this into your deepstream server's /lib directory.
- Customize ./lib/permission-ratelimiter/config/config.js
- inside ./lib/permission-ratelimiter
```sh
$ npm i
$ tsc
```

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
