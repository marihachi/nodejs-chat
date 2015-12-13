var postcss = require("postcss");
var autoprefixer = require("autoprefixer");
var fs=require("fs");

var cleaner  = postcss([ autoprefixer({ browsers: ['last 5 versions','ios 6','ie 9'] }) ]);
var prefixer = postcss([ autoprefixer ]);

compile("style.css");
compile("common.css");

function compile(filename){
	cleaner.process(fs.readFileSync(__dirname+"/"+filename)).then(function (cleaned) {
		fs.writeFileSync(__dirname+"/build."+filename,cleaned.css);
	});
}
