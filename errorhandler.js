//--------------------
// NODE
//--------------------

const express = require('express');
const errorHandler = express.Router();

//--------------------
// LOGGING
//--------------------

const { getDate, logOutput, logError } = require('./logger');

//--------------------
// ROUTER
//--------------------

errorHandler.use(function (req, res) {
	let id = req.ip;
	let url = req.url;

	// Import 

	let nonce = req.const.nonce;
	let publicRoot = req.const.publicRoot;

	// Cookies 

	let insultor = "Samuel L Jackson says";
	let insults = ['Motherfucker!!!', 'Son_of_a_bitch!!!', 'Asshole!!!', 'Punkass_motherfucker!!!', 'Whiny_little_bitch!!!', 'You_deserve_to_die_and_I_hope_you_burn_in_hell!!!', 'Web_motherfucker_do_you_speak_it?'];
	let number = Math.floor(Math.random() * insults.length);
	let insulted = false;

	for (let [key, value] of Object.entries(req.cookies)) {
  		if (key.toString() == insultor) {
			value = value.toString() + "_-_" + insults[number];
			res.cookie(insultor, value);
			insulted = true;
		}
	}

	if (!insulted) {
		res.cookie(insultor, insults[number]);
	}

	res.statusCode = 500;
	let status = res.statusCode;

	try {
		let localPath = path.join(publicRoot, req.path);
		fs.accessSync(localPath);
	} catch (err) {
		status = 404;
	};

	if (req.accepts('html')) {
		try {
			res.render('system/error', { title: status.toString(), description: 'This is an error, Motherfucker!', nonce: 'nonceValue' }, function(err, html) {
				html = html.replace("nonceValue", nonce);
				res.send(html);
			});
		} catch (err) {
			logError(id, status, req.url, err)
		};
	} else if (req.accepts('json')) {
		res.send({ error: status.toString() });
	} else {
		res.type('txt').send("error: " + status.toString());
	}

	logError(id, status, req.url);
});

module.exports = errorHandler;