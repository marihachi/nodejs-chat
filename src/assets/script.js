$(function(){
	var nowdate=new Date();
	var date_str=(("0"+(nowdate.getMonth()+1)).substr(-2))+(("0"+nowdate.getDate()).substr(-2));
	var dayevent=[];
	dayevent.forEach(function(day){
		if(day==date_str){
			$("body").append('<script src="/'+day+'.js"></script>');
		}
	});
	var sock=io();
	sock.on("chat message",function(mes){
		console.log(mes);
		$("#timeline").prepend('<div class="talk"><strong>'+h(mes.name)+'</strong> : '+h(mes.msg)+'</div>');
		if(mes.msg==="ping") sock.emit("chat message","pong");
		if(mes.msg==="unko") sock.emit("unko");
		if(mes.msg==="toilet"){
			$(".unko").removeClass("unko").addClass("toilet");
		}
	});
	sock.on("unko",function(name){
		$("#timeline").prepend('<div class="talk"><strong>'+name+'</strong> : <span class="unko"></div>');
	});
	sock.on("system",function(mes){
		$("#timeline").prepend('<div class="talk"><strong>'+h(mes)+'</strong></div>');
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
	});
	sock.on("join",function(){
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
