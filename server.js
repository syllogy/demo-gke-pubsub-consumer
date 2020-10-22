const http = require('http');
const { initListeners, shutdownListeners } =  require('./consumer');

const project = process.env.GCP_PROJECT;
const subscription = process.env.PUBSUB_SUBSCRIPTION;
const topic = process.env.PUBSUB_TOPIC;

console.log(`project: ${project}  subscription: ${subscription}  topic: ${topic}`);

initListeners(project, topic, subscription);

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('ok');
    res.end();
}).listen(8080);

process.on('exit', code => {
    console.log(`About to exit with code ${code}`);
});

process.on('SIGINT', async (code) => {
    console.log('SIGINT received');
    shutdownListeners(project, topic, subscription);
    setTimeout( () => {
        process.exit(0);
    }, 3000);
});

process.on('SIGTERM', async (code) => {
    console.log('SIGTERM received');
    shutdownListeners(project, topic, subscription);
    setTimeout( () => {
        process.exit(0);
    }, 3000);
});

console.log('running http listening on port 8080');