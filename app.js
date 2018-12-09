var SimulatorManager = require('./lib/simulatorManager.js');
var constants = require('./lib/constants.js');
var uuid = require('node-uuid');
var simManager = new SimulatorManager(5);

simManager.start();

var numberOfVehicles = 5;
var args = process.argv;

if (args.length > 2) {
     var helpLoc = 4 + args.indexOf("-?") + args.indexOf("--?") + args.indexOf("-help") + args.indexOf("--help");
     if (helpLoc > 0) {
          console.log("Simulates the output of an OBD2 port and publishes to Kafka topics.\nThree topics are used, information, location, and alert.\n\nUsage: app.js <carCount>\n\ncarCount is optional, defaults to 5 if not provided");
          process.exit(-1);
     }
     numberOfVehicles = args[2];
}
console.log("Number of Vehicles = " + numberOfVehicles);

//==============================================================================
// create some vehicles
//    pass the vehicle ids so we can connect them with other data feeds

var predefinedCount = constants.VEHICLE_IDS.length;

for (var i = 0; i < numberOfVehicles; i++)
     simManager.addSimCar("america.gpx",null, (i > predefinedCount? uuid.v4(): constants.VEHICLE_IDS[i]));

//==============================================================================
/* - The following are for reference, may be utilized in the future
     - none of this has been validated

function getUserSimulatedCar(deviceId) {
      return userSimulators.get(deviceId);
}

// delete a Car
function unregisterDevice(type) {
  log("delete device " + deviceId);
  if (userSimulators.has(deviceId)) {
    userSimulators.get(deviceId).stopInterval();
    userSimulators.remove(deviceId);
  } else {
    log("Failed to remove device " + deviceId);
  }
}

function changeTrackOfUserSimulatedCar(deviceId, newTrack) {
  userSimulators.get(deviceId).setTrack('./tracks/' + newTrack);
}

function startDevice(deviceId) {
  if (!userSimulators.get(deviceId).isRunning) {
    userSimulators.get(deviceId).startInterval();
  }
}

function stopDevice(deviceId) {
  if (userSimulators.get(deviceId).isRunning) {
    userSimulators.get(deviceId).stopInterval();
  }
}
*/
//==============================================================================
