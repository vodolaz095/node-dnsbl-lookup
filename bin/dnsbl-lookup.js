#!/usr/bin/env node

var lookup =  require('../index'),
	address = process.argv[2],	
	list = process.argv[3],
	util = require('util'),
	limit = process.argv[4],
	fs = require('fs'),
	handle;

if(list){
	try{
		var data = fs.readFileSync(list,{encoding:'utf8'});
		list = data.split(/\n|\r\n/);		
	}
	catch(err){
		util.error(err);
		return;
	}
}

if(!lookup.isIP(address)){
	handle = lookup.uribl;
}
else{
	handle = lookup.dnsbl;
}

var inst = new handle(address,limit,list);
console.log('\n***** Starting Lookup ******\n')
inst.on('data',function(res,bl){
	var zone = bl.zone || bl;
	console.log(res.status, zone, res.TXT||'');
});
inst.on('error',function(err,bl){
	var zone = bl.zone || bl;
	console.log('error', zone, err.code);
});
inst.on('done',function(){
	console.log('\n***** Finished ******')
});