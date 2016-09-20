// HTTP Portion
// var http = require('http');
// var fs = require('fs'); // Using the filesystem module
// var httpServer = http.createServer(requestHandler);
// var url = require('url');
// httpServer.listen(8080);

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(8080, function(){
  console.log(' Server starts on 8080');
  //GetLocalIPAddr();
});

app.use(express.static('public'));


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(msg) {
			// Data comes in as whatever was sent, including objects
			// Send it to all of the clients
			var data = {
				msg : msg,
				user : socket.userID
			}

			//socket.broadcast.emit('chatmessage', data);
			io.sockets.emit('chatmessage',data);
		});

		socket.on("getID",function(userID){
			socket.userID = userID;
			console.log("got userID " + socket.userID);
		});
		
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);
	