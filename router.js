//--------------------
// NODE
//--------------------

const express = require('express');
const router = express.Router();


//--------------------
// LOGGING
//--------------------

const { getDate, logOutput, logError } = require('./logger');


//--------------------
// CONTENT
//--------------------

const pagetitle = "";
const pagedescription = "";


//--------------------
// ROUTER
//--------------------

router.get('/', function (req, res) {

	let responseTimerStart = new Date().getTime();
	let requestServer;

	let id = req.ip;
	let url = req.url;
	let nonce = req.const.nonce;

	var promise = function(req, res) {

		let id = req.ip;
		let url = req.url;
		let nonce = req.const.nonce;

		const publicRoot = req.const.publicRoot;
		const client = req.const.client;
		const cachelifespan = req.const.cachelifespan;

		let redisResponse = false;
		const waitingTime = 1000;

		return new Promise((resolve, reject) => {
		    setTimeout(
		    	function() {
		    		if (!redisResponse) { 
			    		reject("timeout");
					};
		    	}, 
		    waitingTime);
		    	
		    client.get(url, function (err, value) {

				redisResponse = true;

				if (err) throw "Redis error";

				// If value exists for key, send value
				// Else render requested URL, store in Redis and send

				if (value) {
					let redisHTML = JSON.parse(value);
					redisHTML = redisHTML.replace("nonceValue", nonce);
					res.send(redisHTML);

					logOutput(id, url, "Request served by Redis");
				} else {
					res.render('home', { title: pagetitle, description: pagedescription, nonce: 'nonceValue' }, function(err, html) {
						client.setex(url, cachelifespan, JSON.stringify(html));
						html = html.replace("nonceValue", nonce);
						res.send(html);
						
						logOutput(id, url, "Request served by Node");
					});
				}
			});
		    
		});
	}

	promise(req, res).catch(err=> {
		logError(id, url, "Redis error",err) 

		res.render('home', { title: pagetitle, description: pagedescription, nonce: 'nonceValue' }, function(err, html) {
			html = html.replace("nonceValue", nonce);
			res.send(html);
		});

		logOutput(id, url, "Request served by Node");
	});

	let responseTimerEnd = new Date().getTime();
	let responseTime = responseTimerEnd - responseTimerStart;
	let responseMessage = "Request served by " + requestServer + " within " + responseTime.toString() + " ms";
	logOutput(id, url, responseMessage);
});

module.exports = router;