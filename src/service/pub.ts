import { PubSub, Message, AckError } from '@google-cloud/pubsub';
import config from '../utils/config';

const { googleProjectId, googleKeyFilename, googleTopicName, googleSubscriptionName } = config

// Creates a client; cache this for further use
const pubSubClient = new PubSub({
    projectId: googleProjectId,
    keyFilename: googleKeyFilename
});

// configure subscription to listen for messages
function getsubscription(
    subscriptionNameOrId: string,
) {
    // References an existing subscription
    const subscription = pubSubClient.subscription(subscriptionNameOrId);
    subscription.setMaxListeners(1)
    subscription.setOptions({
        flowControl: {
            maxMessages: 2,
        },
    });

    console.log(`Listening for messages on ${subscriptionNameOrId}`);

    return subscription;
};

// message handler to process messages
async function messageHandler(message: Message) {
    console.log(`Received message ${message.id}:`);
    console.log(`Data: ${JSON.stringify(message.data.toString())}`);
    console.log(`Attributes: ${JSON.stringify(message.attributes)}`);

    // Use `ackWithResponse()` instead of `ack()` to get a Promise that tracks
    // the result of the acknowledge call. When exactly-once delivery is enabled
    // on the subscription, the message is guaranteed not to be delivered again
    // if the ack Promise resolves.
    try {
        await new Promise((resolve) => setTimeout(resolve, 12 * 60 * 1000));

        await message.ackWithResponse();
        console.log(`Ack for message ${message.id} successful.`);
    } catch (e) {
        // In all other cases, the error passed on reject will explain why. This
        // is only for permanent failures; transient errors are retried automatically.
        const ackError = e as AckError;
        console.log(
            `Ack for message ${message.id} failed with error: ${ackError.errorCode}`
        );
    }
}

// push message to topic
export async function pushMessage(message: string) {
    const dataBuffer = Buffer.from(message);

    const messageId = await pubSubClient.topic(googleTopicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
}

// start consumer to listen for messages
export async function startConsumer() {
    const subscription = getsubscription(googleSubscriptionName)
    subscription.on("message", messageHandler)
}
