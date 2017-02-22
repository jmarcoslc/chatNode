var user_name = "Anonymouse";
var state = "Not specified";
var logged = false;
var chats = {main_chat:[]};
var target_chat = "main_chat";
var target_chat_name = "";
var self_main_chat_name = "";
var users_online = new Array();

function addListeners(socket) {
	$(".modal-footer .btn").click(function() {
		user_name = $('.form_username_input').val();
		self_main_chat_name = user_name.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat";
		state = $("#form_state option:selected").text();
		$(".user-name").text(user_name);
		$("#modal1").modal("close");
		$(".login").css({
			display: 'none'
		});
		logged = true;
		keepAlive(socket);
	});

	$("#main_chat").click(function() {
		target_chat = "main_chat";
		target_chat_name = "Chat general";
		changeChat();
	});
}

function keepAlive(socket) {
	var func_ka = function(){
		if (logged) {
			socket.emit('keepAlive', {user: user_name, stat: state});
		}
	}

	func_ka();
	setInterval(func_ka, 10000);
}

function changeChat() {
	console.log("Changing to " + target_chat);
	$(".chat-active").removeClass("chat-active");
	$("#"+target_chat).addClass("chat-active");
	$("#current-chat-name").text(target_chat_name);
	$("#chat-content").text("");

	$.each(chats[target_chat], function(index, msg){
		console.log(msg);
		insertMessages(msg);
	});
}

function insertMessages(msg) {
	if (msg.target == target_chat) {
		var msg_class = "message";
		var wrap_right_class = "";
		
		if (msg.user == user_name) {
			msg_class = "self-message";
			wrap_right_class = " alg-right"
		}

	    $('#chat-content').append(
	    	'<div class="message-wrapp'+wrap_right_class+'">\
				<span class="'+msg_class+'">\
					<span class="message-header">\
						<span class="message-name">'+msg.user+'</span>\
					</span>\
					<div class="message-content">\
						<div class="message-text">'+msg.msg+'</div>\
					</div>\
				</span>\
			</div>');
	} else if (msg.target == self_main_chat_name) {
		var target = msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat";
		if (chats.hasOwnProperty(target)) {
			chats[target].push(msg);
		} else {
			chats[target] = new Array();
			chats[target].push(msg);
		}
		console.log(chats);
	} else if (msg.target == "main_chat") {
		var target = msg.target;
		if (chats.hasOwnProperty(target)) {
			chats[target].push(msg);
		} else {
			chats[target] = new Array();
			chats[target].push(msg);
		}
		console.log(chats);
	}
}

$(document).ready(function() {
	var socket = io();
	$('.modal').modal();
	$('#modal1').modal('open');
	$('select').material_select();
	addListeners(socket);

	$('form').submit(function() {
	    socket.emit('chat_message', {target: target_chat, msg:$('#input-message-content').val(), user:user_name});
	    $('#input-message-content').val('');
	    return false;
	});

	socket.on('chat_message', insertMessages);

	socket.on("keepAlive", function(msg) {
		if (msg.user != user_name && $.inArray(msg.user, users_online) == -1) {
			users_online.push(msg.user);
			$('.chats-wrapp').append('<div id="'+msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+'_chat" class="chat-pan-content">\
				<img class="circle chat-avatar" src="img/no-avatar.png">\
				<span class="chat-name">'+msg.user+'</span>\
				</div>'
			)
			$("#"+msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat").click(function(){
				target_chat = $(this).text().toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' ).trim()+"_chat";
				target_chat_name = msg.user;
				changeChat();
			});
			Materialize.toast(msg.user + ' se ha conectado', 3000, 'rounded')
		}
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