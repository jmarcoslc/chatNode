var app = require('express')();
var http = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(path.normalize(__dirname + "/../static/index.html"));
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat_message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat_message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});