const redis = require("redis");

// const redisUrl = "127.0.0.1:6379"
const client = redis.createClient();

client.on("error", function(error) {
    console.log(error);
});

module.exports = client;