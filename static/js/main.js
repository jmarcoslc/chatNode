var socket = io();
	  $(document).ready(function() {
		$('form').submit(function() {
		    socket.emit('chat_message', $('#m').val());
		    $('#m').val('');
		    return false;
		  });
		  socket.on('chat_message', function(msg){
		    $('#messages').append($('<li>').text(msg));
		});

		  socket.on('connect', function(){
		    var delivery = new Delivery(socket);
		    alert("conecta socket files")
		 
		    delivery.on('delivery.connect',function(delivery){
		      $("#btn_fich").click(function(evt){
		      	//"input[type=file]"
		        var file = $(this)[0].files[0];
		        var extraParams = {foo: 'bar'};
		        console.log(file, extraParams);
		        delivery.send(file, extraParams);
		        evt.preventDefault();
		      });
		    });
		 
		    delivery.on('send.success',function(fileUID){
		      console.log("file was successfully sent.");
		    });
  		});
	  }); 
