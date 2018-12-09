// Kafka configuration
var kafka = require('kafka-node')
var constants = require('./constants.js');
var Producer = kafka.Producer;
// instantiate client with as connectstring host:port for the ZooKeeper for the Kafka cluster
var client = new kafka.Client(constants.KAFKA_ZOOKEEPER);

var KafkaProducer = function() {
};

KeyedMessage = kafka.KeyedMessage,
producer = new Producer(client),
km = new KeyedMessage('key', 'message'),
producerReady = false ;

producer.on('ready', function () {
    console.log("Vehicle producer is ready");
    producerReady = true;
});

producer.on('error', function (err) {
  console.error("Vehicle producer generated an error: "+err);
});

KafkaProducer.prototype.produceCarMessage = function(deviceId, topic, data) {
    KeyedMessage = kafka.KeyedMessage,
    carKM = new KeyedMessage(deviceId, JSON.stringify(data)),
    payload = [
        { topic: topic, messages: carKM, partition: 0 },
    ];
    if (producerReady) {
         producer.send(payload, function (err, data) {
              if (err != null) {
                   console.log("Error = " + err);
                   if (err.toString().indexOf("BrokerNotAvailableError") >= 0) {
                        console.log("Broker Not Available - Stopping");;
                        process.exit(-1);
                   }
              }
         });
    } else {
        console.error("Sorry, the Producer is not ready yet, failed to produce message to Kafka.");
    }

}

module.exports = KafkaProducer;
