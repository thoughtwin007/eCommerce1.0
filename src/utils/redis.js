import Redis from "ioredis";

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379
});

// (async () => {
//     await redis.set('key', 'value');
//     const value = await redis.get('key');
//     console.log(value); // → "value"
//     redis.disconnect();
// })();
export default redis;