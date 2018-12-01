var SimulatorManager = require('./lib/simulatorManager.js');

var simManager = new SimulatorManager(5);
simManager.start();

//==============================================================================
//create some vehicles
simManager.addSimCar("america.gpx",null);

simManager.addSimCar("Scotch.gpx",null);

simManager.addSimCar("america.gpx",null);

simManager.addSimCar("Europe1.gpx",80);


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
