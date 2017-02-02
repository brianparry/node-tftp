"use strict";

var sanitizeNumber = function (n){
	n = ~~n;
	return n < 1 ? 1 : n;
};

module.exports = function (opts, server){
	opts = opts || {};

	var options = {
		address: opts.host || "localhost",
		port: sanitizeNumber (opts.port || 69),
		retries: sanitizeNumber (opts.retries || 3)
	};
	
	if (server){
		options.root = opts.root || ".";
		options.denyGET = opts.denyGET;
		options.denyPUT = opts.denyPUT;
	}
	
	//Default window size 4: https://github.com/joyent/node/issues/6696
	var windowSize = sanitizeNumber (opts.windowSize || 4);
	if (windowSize > 65535) windowSize = 4;
	
	//Maximum block size before IP packet fragmentation on Ethernet networks
	var blockSize = sanitizeNumber (opts.blockSize || 1468);
	if (blockSize < 8 || blockSize > 65464) blockSize = 1468;

	var timeout = sanitizeNumber (opts.timeout || 3000);

	var tsize = sanitizeNumber (opts.tSize || 0);
	
	options.extensions = {
		blksize: blockSize,
		timeout: timeout,
		windowsize: windowSize,
		//This option is not strictly required because it is not necessary when
		//receiving a file and it is only used to inform the server when sending a
		//file. Most servers won't care about it and will simply ignore it
		rollover: 0
	};

	options.extensionsString = {};
	if (opts.tsize) {
		// flag to force use of option
		options.useTsize = true;
	}
	if (opts.blockSize) {
		options.extensionsString.blksize = blockSize + "";
	}
	if (opts.timeout) {
		options.extensionsString.timeout = timeout + "";
	}
	if (opts.windowSize) {
		options.extensionsString.windowsize = windowSize + "";
	}	

        options.extensionsLength = 0;	
	for (var p in options.extensionsString) {
		options.extensionsLength += p.length + options.extensionsString[p].length + 2;
	}
	
	return options;
};
