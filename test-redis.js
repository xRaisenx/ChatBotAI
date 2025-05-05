require('dotenv').config({ path: '.env.local' });
const { createClient } = require('redis');

async function testRedisConnection() {
  const redisUrl = process.env.AICHATBOTZ_KV_URL;

  if (!redisUrl) {
    console.error('Error: AICHATBOTZ_KV_URL environment variable not found. Please check your .env.local file.');
    process.exit(1);
  }

  const redisClient = createClient({
    url: redisUrl,
  });

  redisClient.on('error', (err) => console.error('Redis Client Error:', err));

  try {
    await redisClient.connect();
    console.log('Successfully connected to Redis!');

    await redisClient.ping();
    console.log('Successfully pinged Redis!');

    await redisClient.quit();
    console.log('Successfully closed Redis connection!');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1);
  }
}

testRedisConnection();
