const steem = require('steem');
var config = require('config.json')('./config.json');
var Store = require("jfs");
var db = new Store("data");


exports.failover = function() {
	console.log("failover")
  if(config.rpc_nodes && config.rpc_nodes.length > 1) {
    var cur_node_index = config.rpc_nodes.indexOf(steem.api.options.url) + 1;

    if(cur_node_index == config.rpc_nodes.length)
      cur_node_index = 0;

    var rpc_node = config.rpc_nodes[cur_node_index];

    steem.api.setOptions({ transport: 'http', uri: rpc_node, url: rpc_node });
    console.log('');
    console.log('***********************************************');
    console.log('Failing over to: ' + rpc_node);
    console.log(steem.api.options.url)
    console.log('***********************************************');
    console.log('');
  }
}

	
exports.ifExistInDB = function(input,callback) {
  
  db.get("metadata_store", function(err, metadata_store){
    if(!err)
    {
      
      if(metadata_store.some(function(r){return r.pinset===input.pinset})) {
        console.log(input.pinset + " already stored")
        exist=true;
      }
      else
      {
        console.log(input.pinset + " not already stored");
        exist=false;
      }
    }
    else
    {
      //console.log(err);
      console.log("database empty... continue")
      exist=false;
    }
    callback(null,input,exist);
  });
}