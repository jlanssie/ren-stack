function getDate() {
	let now = Date.now();
	let date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium' }).format(now).replace(",", " -");
	return date
}

function logOutput(arg1,arg2,arg3,arg4) {
	console.log(getDate() + " - " + arg1 + (arg2?(" - " + arg2):("")) + (arg3?(" - " + arg3):("")) + (arg4?(" - " + arg4):("")) + '\n');
}

function logError(arg1,arg2,arg3,arg4) {
	console.error(getDate() + " - " + arg1 + (arg2?(" - " + arg2):("")) + (arg3?(" - " + arg3):("")) + (arg4?(" - " + arg4):("")) + '\n');
}

module.exports = { getDate, logOutput, logError };