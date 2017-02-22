var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(http);
var dl = require('delivery');
var fs  = require('fs');

var port = process.env.PORT || '3000';

app.use(express.static('static'));
app.get('/', function(req, res) {
  res.sendFile(path.normalize(__dirname + "/../static/index.html"));
});

io.on('connection', function(socket){
  var delivery = dl.listen(socket);
  delivery.on('receive.success',function(file){
    var params = file.params;
    fs.writeFile(path.normalize(__dirname + "/../static/img/avatars/"+file.name),file.buffer, function(err){
      if(err) {
        console.log('File could not be saved.');
      } else {
        console.log('File saved.');
      };
    });
  });
  console.log('User conected');
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
  socket.on('chat_message', function(msg){
    console.log('Message from: ' + msg.user + " - " + msg.msg);
    io.emit('chat_message', msg);
  });
  socket.on('keepAlive', function(msg){
    console.log('keepAlive: ' + msg.user);
    io.emit('keepAlive', msg);
  });
  socket.on('writing', function(msg){
    console.log('Writing: ' + msg.user);
    io.emit('writing', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});