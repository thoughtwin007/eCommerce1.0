// The most straightforward way to delete keys by pattern is using keys command to get the keys matching the pattern and then deleting them one by one, which is similar to the command line example you provided. Here's an example implemented with ioredis:

import Redis from "ioredis"
var redis = new Redis();
redis.keys('sample_pattern:*').then(function (keys) {
    // Use pipeline instead of sending
    // one command each time to improve the
    // performance.
    var pipeline = redis.pipeline();
    keys.forEach(function (key) {
        pipeline.del(key);
    });
    return pipeline.exec();
});
// However when your database has a large set of keys (say a million), keys will block the database for several seconds. In that case, scan is more useful. ioredis has scanStream feature to help you iterate over the database easily:

// var Redis = require('ioredis');
var redis = new Redis();
// Create a readable stream (object mode)
var stream = redis.scanStream({
    match: 'sample_pattern:*'
});
stream.on('data', function (keys) {
    // `keys` is an array of strings representing key names
    if (keys.length) {
        var pipeline = redis.pipeline();
        keys.forEach(function (key) {
            pipeline.del(key);
        });
        pipeline.exec();
    }
});
stream.on('end', function () {
    console.log('done');
});
// Don't forget to check out the official documentation of scan command for more information: http://redis.io/commands/scan.