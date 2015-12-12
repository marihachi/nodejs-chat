$(function(){
	var sock=io();
	sock.on("chat message",function(mes){
		console.log(mes);
		$("#timeline").prepend('<div><strong>'+h(mes.name)+'</strong> : '+h(mes.msg)+'</div>');
		if(mes.msg==="ping") sock.emit("chat message","pong");
	});
	sock.on("system",function(mes){
		$("#timeline").prepend('<div><strong>'+h(mes)+'</strong></div>');
	});
	sock.on("reload",function(){
		location.reload();
	});
	sock.on("updateinfo",function(){
		$.get("/count").done(function(data){
			$("title").html("ROM:"+data.rom+" 入室:"+data.join);
		});
	});
	$("#a").submit(function(ev){
		ev.preventDefault();
		sock.emit("join",$("#name").val());
		$("#name").val("");
		$("#a").hide();
		$("#b").show();
	});
	$("#b").submit(function(ev){
		ev.preventDefault();
		var mes=$("#body").val();
		if(mes==="") return;
		if(mes==="/clear") $("#timeline").html("");
		sock.emit("chat message",mes);
		$("#body").val("");
	});
	$("#taisitu").click(function(){
		location.reload();
	});
	function h(a){
		return a.split("<").join("&lt;");
	}
});
