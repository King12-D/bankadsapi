import Redis from "ioredis";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 200, 2000);
    console.warn(`[redis] Reconnect attempt ${times}, delay: ${delay}ms`);
    return delay;
  },
  lazyConnect: false,
  enableReadyCheck: true,
});

let redisAvailable = false;

redis.on("connect", () => {
  redisAvailable = true;
  console.log("[redis] Connected");
});

redis.on("ready", () => {
  redisAvailable = true;
  console.log("[redis] Ready");
});

redis.on("error", (err: Error) => {
  console.error("[redis] Error:", err.message);
});

redis.on("close", () => {
  redisAvailable = false;
  console.warn("[redis] Connection closed");
});

/**
 * Check if Redis is currently connected and responsive.
 * Use this before non-critical Redis operations to avoid timeouts.
 */
export const isRedisAvailable = (): boolean => redisAvailable;
