import * as map from "lib0/map";
import logger from "../logger";
import { pub, sub } from "../pubsub";

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

const topics = new Map();


/**
 * Map froms topic-name to set of subscribed clients.
 * @type {Map<string, Set<any>>}
 */

const pingTimeout = 30000;

/**
 * @param {any} conn
 * @param {object} message
 */
const sendSignal = (conn, message) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close();
  }
  try {
    conn.send(message);
  } catch (e) {
    conn.close();
  }
};

function broadcast(topic){
  return (data)=>{
    logger({level:'info', service: 'broadcast', body:data, topic})
    const connections = topics.get(topic)
    connections.forEach(conn => {
      sendSignal(conn, data)
    });
  }
}

const signalerMessageResolver = (conn, message, subscribedTopics) => {
  logger({
    level: "info",
    service: "signal",
    message_type: message.type,
    data: message,
  });
  switch (message.type) {
    case "subscribe":
      /** @type {Array<string>} */ (message.topics || []).forEach(
        (topicName) => {
          if (typeof topicName === "string") {
            // add conn to topic
            const topic = map.setIfUndefined(topics, topicName, () => {
              sub.subscribe(topicName).then(broadcast(topicName));
              return new Set([conn]);
            });
            topic.add(conn);
            // add topic to conn
            subscribedTopics.add(topicName);
          }
        }
      );
      break;
    case "unsubscribe":
      /** @type {Array<string>} */ (message.topics || []).forEach(
        (topicName) => {
          const subs = topics.get(topicName);
          if (subs) {
            subs.delete(conn);
          }
        }
      );
      break;
    case "publish":
      if (message.topic) {
        pub.publish(message.topic, JSON.stringify(message));
      }
      break;
    case "ping":
      sendSignal(conn, JSON.stringify({ type: "pong" }));
  }
};

sub.on("message", (topic, message) => {
  const receivers = topics.get(topic);
  if (receivers) {
    receivers.forEach((receiver) => sendSignal(receiver, message));
  }
});

/**
 * Setup a new client
 * @param {any} conn
 */
const setupSignalingConnection = (conn) => {
  /**
   * @type {Set<string>}
   */
  const subscribedTopics = new Set();

  let closed = false;

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        conn.close();
      }
    }
  }, pingTimeout);

  conn.on("pong", () => {
    pongReceived = true;
  });

  conn.on("close", () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set();
      subs.delete(conn);
      if (subs.size === 0) {
        topics.delete(topicName);
      }
    });
    subscribedTopics.clear();
    closed = true;
  });

  conn.on(
    "message",
    /** @param {object} message */ (message) => {
      if (message && !closed) {
        signalerMessageResolver(conn, JSON.parse(message), subscribedTopics);
      }
    }
  );
};

export default setupSignalingConnection;
