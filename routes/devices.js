var express = require('express');
var router = express.Router();
var configData = require('/etc/tuyaweb/config.json');

var deviceStatusData = [];
var tuyaDevices = [];

const TuyaDevice = require('tuyapi');

router.get('/deviceList', function(req, res, next) {
	var result = [];
    
	Object.keys(configData).sort().forEach(function(device) {
		var exportDevice = {};
		exportDevice['name'] = configData[device].name;
		exportDevice['devid'] = device;
		exportDevice['host'] =  configData[device].host;
		result.push(exportDevice);
    });
	
	res.json(result);
	
});


router.get('/deviceStatus/:id', function(request, response, next) {
	var deviceid = request.params.id;
	if (deviceid != null) {
		if ( deviceid.length == 20 ) {
            if (deviceStatusData[deviceid] != null) {
                return response.json(deviceStatusData[deviceid]);
            } else {
                response.send("No status data here");
            }
		} else {
			response.send("Invalid device id length.");
		}
	} else {
		response.send("No device id");
	}
	
});

router.get('/switch/:id/:cmd', function(req, res, next) {
	var command = req.params.cmd;
	var deviceid = req.params.id;
	
	if (command != null && deviceid != null) {
		command = command.toUpperCase();
		if ( deviceid.length == 20 && ( command == "ON" || command == "OFF" ) ) {
            if (switchDevice(deviceid, command)) res.send('OK');
            else res.send('NOK');
		}
	}
});

module.exports = router;

initTuyaDevices();
setInterval(getAllDevicesStatusData, 1000);

function getAllDevicesStatusData() {
    Object.keys(configData).sort().forEach(function(deviceid) {
           
        tuyaDevices[deviceid].get({schema: true}).then(data => {
            deviceStatusData[deviceid] = data;
            console.log("Success: " + configData[deviceid].host);
        }, reason => {
            deviceStatusData[deviceid] = null;
            // console.log("Error getting device (" + configData[deviceid].host + ") state: " + reason);
            return null;
        })
    });
}

function initTuyaDevices() {
    Object.keys(configData).sort().forEach(function(deviceid) {
        tuyaDevices[deviceid] = new TuyaDevice({
                type: 'outlet',
                ip: configData[deviceid].host,
                id: deviceid,
                key: configData[deviceid].devkey
            });
    });

}

function switchDevice(deviceid, command) {
    
    var newState = false;
    
    if (command == "ON") {
        newState = true;
    } else {
        newState = false;
    }
    
    var result;
    
    tuyaDevices[deviceid].set({ set: newState }).then(result => {
        return true;
    }, reason => {
        console.log(reason.toString());
        return false;
    });

}
