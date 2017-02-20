var app = require('express')();
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
    fs.writeFile(path.normalize(__dirname + "/../static/"+file.name),file.buffer, function(err){
      if(err){
        console.log('File could not be saved.');
      }else{
        console.log('File saved.');
      };
    });
  });
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat_message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat_message', msg);
  });
});
 
/*io.sockets.on('connection', function(socket){
  
  delivery.on('receive.success',function(file){
    var params = file.params;
    fs.writeFile(file.name,file.buffer, function(err){
      if(err){
        console.log('File could not be saved.');
      }else{
        console.log('File saved.');
      };
    });
  });
});*/

http.listen(port, function(){
  console.log('listening on *:'+port);
});