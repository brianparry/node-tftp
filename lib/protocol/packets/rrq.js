"use strict";

var opcodes = require ("../opcodes");
var readRequest = require ("./read-request");
var writeRequest = require ("./write-request");

module.exports = {
	serialize: function (filename, globalOptions, opOptions){
		var bytes = 0;
	
		if (globalOptions){
			//tsize is 0
			//+1 because tsize length is 1
			//bytes = globalOptions.extensionsLength + 1;
			bytes = globalOptions.extensionsLength;
			if (globalOptions.useTsize) {
				globalOptions.extensionsString.tsize = "0";
				globalOptions.extensionsLength += 'tsize'.length + globalOptions.extensionsString.tsize.length + 2;
				bytes = globalOptions.extensionsLength;
			}
		}
		
		return writeRequest (opcodes.RRQ, filename, bytes, globalOptions,
				opOptions);
	},
	deserialize: function (buffer){
		return readRequest (buffer, true);
	}
};
