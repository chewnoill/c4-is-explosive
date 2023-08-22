import session from "express-session";
import RedisStore from "connect-redis"
const SESSION_SECRET = process.env.SESSION_SECRET || "big secret";
import Redis from "ioredis";
import { REDIS_CONFIG } from "./env";

export const redisClient = new Redis(REDIS_CONFIG.connection);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient.client,
  prefix: "session:",
})

const Session = session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: SESSION_SECRET,
});

export default Session;


