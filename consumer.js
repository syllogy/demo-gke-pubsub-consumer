const {PubSub} = require('@google-cloud/pubsub');

const messageHandler = message => {
    console.log('messageHandler start')
    console.log(`Message: ${message.data.toString()}`);

    // TODO: do something with the message

    // after TODO-ing something, "Ack" (acknowledge receipt of) the message and remove it from the queue
    message.ack();
    console.log('messageHandler end')
};

const errorHandler = error => {
    console.log('errorHandler start')
    // Do something with the error
    console.error(`ERROR: ${error}`);
    console.log('errorHandler throw')
    throw error;
};

const createSubscripton = async (projectId, topic, subscriptionName) => {
    console.log('createSubscripton started...');
    const pubSubClient = new PubSub({ projectId });
    subscription = await pubSubClient.topic(topic).createSubscription(subscriptionName);
    return subscription;
}

const getSubscription = async (projectId, topic, subscriptionName) => {
    console.log('getSubscription started...');
    const pubSubClient = new PubSub({ projectId });
    const exists = await pubSubClient.subscription(subscriptionName).exists();
    if (!exists[0]) createSubscripton(projectId, topic, subscriptionName);
    return pubSubClient.subscription(subscriptionName);
}

const initListeners = async (projectId, topic, subscriptionName) => {
    console.log('initListeners started...');
    const subscription = await getSubscription(projectId, topic, subscriptionName);
    subscription.on('message', messageHandler);
    subscription.on('error', errorHandler);
    console.log('initListeners finished')
};
// projectId = 'andy-playground-264516', subscriptionName = 'demo-producer-sub'
const shutdownListeners = (projectId, subscriptionName) => {
    console.log('shutdownListeners started...');
    const pubSubClient = new PubSub({ projectId });
    const subscription = pubSubClient.subscription(subscriptionName);
    subscription.removeListener('message', messageHandler);
    subscription.removeListener('error', errorHandler);
    console.log('shutdownListeners finished')
}

exports.initListeners = initListeners;
exports.shutdownListeners = shutdownListeners;

// simple message in JSON
// { 'foo': 'test' }
