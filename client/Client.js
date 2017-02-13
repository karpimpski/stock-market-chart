const $ = require('jquery');

function get(query, cb) {
  $.get( query, function( data ) {
    cb(JSON.parse(data));
  });
}

function patch(query, d, cb){
  $.ajax({
    url: query,
    type: 'PATCH',
    data: d,
    success: function(data) {
      cb(JSON.parse(data));
    }
  });
} 

function post(query, d, cb){
  $.ajax({
    url: query,
    type: 'POST',
    data: d,
    success: function(data) {
      cb(JSON.parse(data));
    }
  });
}

function del(query, d, cb){
  $.ajax({
    url: query,
    type: 'DELETE',
    data: d,
    success: function(data) {
      cb(JSON.parse(data));
    }
  });
}

const Client = { get, patch, post, del };
export default Client;