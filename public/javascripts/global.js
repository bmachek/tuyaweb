$(document).ready(function() {
	createDeviceTable();
    
    setInterval(updateDeviceTable, 5000);
});


function createDeviceTable() {

	$.getJSON( 'devices/deviceList', function( list ) {

        var deviceTable = "";
        
		$.each(list, function() {
    
            var row = '<tr>';
            row += '<td><div id="' + this.devid + '-switch"></div></td>';
            row += '<td><div id="' + this.devid + '-name">' + this.name + '</div></td>';
            row += '<td><div id="' + this.devid + '-power"></div></td>';
            row += '</tr>';
            
            deviceTable += row;

		});
        
        $('#deviceList table tbody').html(deviceTable);
        
        updateDeviceTable();
	});

}

function updateDeviceTable() {

	$.getJSON( 'devices/deviceList', function( list ) {

		$.each(list, function() {

			var deviceData = [];
			deviceData['name'] = this.name;
			deviceData['devid'] = this.devid;

			$.getJSON( 'devices/deviceStatus/' + deviceData.devid, function( deviceStatus ) {

				var tableRow = '';
                
				if (deviceStatus.dps[1]) {
				    checked = ' checked ';
				    cmd = 'off';
				} else {
				    checked = ' ';
				    cmd = 'on';
				}
				
				$('#' + deviceData.devid + '-power').html((deviceStatus.dps[5] / 10) + ' W');
                $('#' + deviceData.devid + '-switch').html('<label class="switch"><input type="checkbox"' + checked + 'onclick="switchDevice(\'' + deviceData.devid + '\', \'' + cmd + '\')" /><span class="slider"></span></label>');
				
			});
		});
	});
}

function switchDevice(dev, cmd) {
	$.getJSON( 'devices/switch/' + dev + '/' + cmd, function( data ) {
		console.log(data);
	});

	setTimeout(updateDeviceTable, 1000);
}
