var user_name = "Anonymouse";

function addListeners() {
	$(".modal-footer .btn").click(function() {
		user_name = $('.form_username_input').val();
		alert(user_name);
		$(".user-name").text(user_name);
		$("#modal1").modal("close");
		$(".login").css({
			display: 'none'
		});
	});
}

$(document).ready(function() {
	$('.modal').modal();
	$('#modal1').modal('open');
	addListeners();
	var socket = io();

	$('form').submit(function() {
	    socket.emit('chat_message', {msg:$('#input-message-content').val(), user:user_name});
	    $('#input-message-content').val('');
	    return false;
	  });

	  socket.on('chat_message', function(msg){
	    $('.chat-content').append(
	    	'<div class="message-wrapp">\
				<span class="message">\
					<span class="message-header">\
						<span class="message-name">'+msg.user+'</span>\
					</span>\
					<div class="message-content">\
						<div class="message-text">'+msg.msg+'</div>\
					</div>\
				</span>\
			</div>');
	});
/*	  socket.on('connect', function(){
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
		});*/
});