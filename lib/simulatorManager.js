var Simulator = require('./carSimulator.js');
var math = require("math");
var Chance = require('chance');
var HashMap = require('hashmap');
var fs = require('fs');
var Kafka = require("./kafka.js");
var constants = require('./constants.js');
var mySeed = math.random();
var chance = new Chance(mySeed);

//var Client = require("ibmiotf");
var uuid = require('node-uuid');

var deviceType = "Simulated-Car";
var userSimulators = new HashMap();
var connected;
var self;

var kafkaProducer = new Kafka(constants.KAFKA_ZOOKEEPER);

var availableCars = {
    manufacturers: [{
        manufacturer: "BMW",
        models: [
            "3er",
            "7er",
            "M6",
            "Z4"
        ]
    }]
};

var SimulatorManager = function() {
 self = this;
};

SimulatorManager.prototype.start = function() {
  console.log("Starting SimulatorManager");
  connected = 0;
  // handle the connection
    connected++;
    if (connected == 1) {
          //self.doDevicesExist(function onSuccess(err,response){
        //    self.simulateDevices();
        //});
    }
}


// add a simulated Car
SimulatorManager.prototype.addSimCar = function(track, airbagChance, deviceId) {
     var track = track;
     var airbagChance = airbagChance;
     console.log("Add Sim Car with track " + track + " and airbag chance of " + airbagChance);
     if (track == null) {
     throw ("Track is Required");
     }
     if (airbagChance == null) {
          airbagChance = 0;
     }
     if (airbagChance > 100) {
          airbagChance = 100;
     }
     var type = "User-Simulated-Car";
     if (deviceId == null) {
          deviceId = uuid.v4();
     }
     var serialNumber = uuid.v4();
     var selectedManufactrurer = chance.integer({
          min: 0,
          max: availableCars.manufacturers.length - 1
     })
     var manufacturer = availableCars.manufacturers[selectedManufactrurer].manufacturer;
     var selectedModel = chance.integer({
          min: 0,
          max: availableCars.manufacturers[selectedManufactrurer].models.length - 1
     })
     var model = availableCars.manufacturers[selectedManufactrurer].models[selectedModel];
     var fwVersion = "1.0.0";
     var hwVersion = "1.0.0";
     var devInfo = {
          "serialNumber": serialNumber,
          "manufacturer": manufacturer,
          "model": model,
          "fwVersion": fwVersion,
          "hwVersion": hwVersion
     };
     console.log("register new device " + deviceId);
     self.addSimulator(deviceId, type, track, airbagChance);
}

SimulatorManager.prototype.addSimulator = function(deviceId, type, track, airbagChance) {
    userSimulators.set(deviceId, new Simulator(deviceId, false, './tracks/' + track, airbagChance));
    userSimulators.get(deviceId).on('CarInformation', function(data) {
          // publish to Kafka
          kafkaProducer.produceCarMessage(deviceId, constants.VEHICLE_INFO, data);
          console.log("[" + deviceId + "] CarInformation emitted.".green);
          //console.log(JSON.stringify(data));
    });
    userSimulators.get(deviceId).on('Airbag', function(data) {
          // publish to Kafka
          kafkaProducer.produceCarMessage(deviceId, constants.VEHICLE_ALERT, data);
          console.log("[" + deviceId + "] Airbag data emitted.".green);
    });
    userSimulators.get(deviceId).on('Telemetry', function(data) {
          // publish to Kafka
          kafkaProducer.produceCarMessage(deviceId, constants.VEHICLE_LOCATION, data);
          console.log("[" + deviceId + "] Telemetry data emitted.".green);
    });
};

// Simulate all devices of type 'Simulated-Car'
SimulatorManager.prototype.simulateDevices = function() {
          console.log("Begin loading up devices of type '"+ deviceType + "'".yellow);
          console.log("Finished loading up devices of type 'Simulated-Car'".yellow);
};

module.exports = SimulatorManager;
