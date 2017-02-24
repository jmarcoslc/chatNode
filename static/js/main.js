$.fn.scrollBottom = function() { 
    return $(document).height() - this.scrollTop() - this.height(); 
};

var user_name = "Anonymouse";
var state = "Not specified";
var avatar = "img/no-avatar.png";
var logged = false;
var chats = {main_chat:[]};
var target_chat = "main_chat";
var target_chat_name = "";
var self_main_chat_name = "";
var users_online = new Array();
var users_avatars = {"Chat general": "/img/no-avatar.png"};

function addListeners(socket) {
	$(".modal-footer .btn").click(function() {
		user_name = $('.form_username_input').val();
		self_main_chat_name = user_name.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat";
		state = $("#form_state").val();
		$(".section-header-l img").addClass(state);
		$(".user-name").text(user_name);
		$("#modal1").modal("close");
		$(".login").css({
			display: 'none'
		});
		logged = true;
		keepAlive(socket);
	});

	$('form').submit(function() {
		socket.emit('chat_message', {target: target_chat, msg:$('#input-message-content').val(), user:user_name, avtr:avatar});
		$('#input-message-content').val('');
		return false;
	});

	$('#input-message-content').keypress(function() {
		socket.emit('writing', {target: target_chat, user:user_name, avtr:avatar})
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
			socket.emit('keepAlive', {user: user_name, stat: state, avtr:avatar});
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
	$("#current-chat-image").attr("src", users_avatars[target_chat_name]);
	$("#chat-content").text("");

	$.each(chats[target_chat], function(index, msg){
		insertMessages(msg);
	});
}

function insertMessages(msg) {
	if (msg.target == target_chat || msg.target == self_main_chat_name) {
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
	}
}

$(document).ready(function() {

	var socket = io();
	$('.modal').modal();
	$('#modal1').modal('open');
	$('select').material_select();
	addListeners(socket);

	socket.on('connect', function(){
    	var delivery = new Delivery(socket);
 
	    delivery.on('delivery.connect',function(delivery){
	      $("#login_btn").click(function(evt){
	      	//"input[type=file]"
	        var file = $("input[type=file]")[0].files[0];
	        avatar = "img/avatars/"+file.name;
	        console.log(file);
	        delivery.send(file, {user:user_name});
	        evt.preventDefault();
	        return false;
	      });
	    });
 
	    delivery.on('send.success',function(fileUID){
	      console.log("Avatar seted.");
	      $("#self_avatar").attr("src", avatar);
	    });
	});

	socket.on('writing', function(msg) {
		if (target_chat == msg.target && msg.user != user_name) {
			$("#writing").text(msg.user + " está escribiendo...")
			setTimeout(function() {
				$("#writing").text("");
			}, 5000);
		}
	});

	socket.on('chat_message', function(msg){
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
			var targt = msg.target;
			if (chats.hasOwnProperty(targt)) {
				chats[targt].push(msg);
			} else {
				chats[targt] = new Array();
				chats[targt].push(msg);
			}
		} else if (msg.target == self_main_chat_name && msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat" == target_chat) {
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
			var target = msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat";
			if (chats.hasOwnProperty(target)) {
				chats[target].push(msg);
			} else {
				chats[target] = new Array();
				chats[target].push(msg);
			}
			/*console.log(chats);*/
		} else if (msg.target == self_main_chat_name && msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat" != target_chat) {
			var target = msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat";
			if (chats.hasOwnProperty(target)) {
				chats[target].push(msg);
			} else {
				chats[target] = new Array();
				chats[target].push(msg);
			}
		} else if (msg.target == "main_chat" && target_chat != "main_chat") {
			var targt = msg.target;
			if (chats.hasOwnProperty(targt)) {
				chats[targt].push(msg);
			} else {
				chats[targt] = new Array();
				chats[targt].push(msg);
			}
		}

		var container = $("#chat-content");
		container.animate({"scrollTop":container[0].scrollHeight}, 200);
	});

	socket.on("keepAlive", function(msg) {
		if (msg.user != user_name && $.inArray(msg.user, users_online) == -1) {
			users_online.push(msg.user);
			users_avatars[msg.user] = msg.avtr;
			$('.chats-wrapp').append('<div id="'+msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+'_chat" class="chat-pan-content">\
				<img class="circle chat-avatar '+msg.stat+'" src="'+msg.avtr+'">\
				<span class="chat-name">'+msg.user+'</span>\
				</div>'
				)
			$("#"+msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat").click(function(){
				target_chat = $(this).text().toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' ).trim()+"_chat";
				target_chat_name = msg.user;
				changeChat();
			});
			Materialize.toast(msg.user + ' se ha conectado', 3000, 'rounded');
		}
	});

	socket.on("user_disconected", function(msg) {
		delete chats[msg.user];
		console.log(chats);
		Materialize.toast(msg.user + ' se ha desconectado', 3000, 'rounded');
		$("#"+msg.user.toLowerCase().replace(/\s/g, '').replace( /[^-A-Za-z0-9]+/g, '-' )+"_chat").remove();
	});
});