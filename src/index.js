var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var romcount = 0;
var joincount = 0;

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
	res.render("index.jade");
});

app.get('/old', function (req, res) {
	res.render("old-index.jade");
});

app.get('/count', function (req, res) {
	res.writeHeader(200, { "content-type": "text/json" });
	res.end(JSON.stringify({ rom: romcount - joincount, join: joincount }));
});

app.get('/script.js', function (req, res) {
	fs.readFile(__dirname + "/script.js", function (a, b) {
		res.writeHeader(200, { "content-type": "text/javascript" });
		res.end(b);
	});
});
app.get('/style.css', function (req, res) {
	fs.readFile(__dirname + "/style.css", function (a, b) {
		res.writeHeader(200, { "content-type": "text/css" });
		res.end(b);
	});
});
app.get('/common.css', function (req, res) {
	fs.readFile(__dirname + "/common.css", function (a, b) {
		res.writeHeader(200, { "content-type": "text/css" });
		res.end(b);
	});
});
setTimeout(function () {
	io.emit("reload");
}, 5000);
var nameList = [];
io.on('connection', function (socket) {
	console.log('a user connected');
	romcount++;
	io.emit("updateinfo");
	var name = "";
	socket.on("join", function (_name) {
		if (nameList.indexOf(_name) !== -1) {
			sock.emit("system", _name + "という名前はすでに使われています。");
			return;
		}
		if (name !== "") {
			io.emit("system", name + "さんが" + _name + "として入ろうとしましたが、すでに入室していました。");
			return;
		}
		if (_name.length > 20) {
			socket.emit("system", "名前は３０文字までです");
			return;
		}
		name = _name;
		nameList.push(name);
		joincount++;
		socket.emit("join");
		console.log("join",name,socket.handshake.address);
		io.emit("system",name+"さんが入室しました");
		io.emit("updateinfo");
		socket.on("chat message", function (msg) {
			console.log(msg);
			io.emit("updateinfo");
			io.emit("chat message", { name, msg });
		});
		socket.on("disconnect", function () {
			nameList.pop(name);
			joincount--;
			io.emit("updateinfo");
			io.emit("system", name + "さんが退室したようです");
		});
		socket.on("unko", function () {
			io.emit("unko", name);
		});
	});
	socket.on("disconnect", function () {
		romcount--;
		io.emit("updateinfo");
	});
});

http.listen(2000, function () {
	console.log('listening on *:2000');
});
