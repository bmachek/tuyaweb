var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var configData = require('/etc/tuyaweb/config.json');
	
	var renderData = configData;
	var gotData = [];
	
	res.render('index', { title: 'Device List', renderData: renderData });
});

module.exports = router;
