var url = require("url");
var path = require("path");
var fs = require("fs");

module.exports = HttpServerWrapper = function (httpPort) {
	this.httpServer = require("http");

	this.httpServer.createServer(function(request,response){  
		var urlPath = url.parse(request.url.replace(/\.\./g, "")).pathname;  

		var fullPath = path.join(process.cwd(),urlPath);  
		var baseClientPath = __dirname + "/../client/";
		urlPath = urlPath.replace(/common\//g, "../common/");
		var requestedPath = baseClientPath + urlPath;

		if (urlPath.indexOf("index.html") == 0 || urlPath === "/") {
			fs.readFile(baseClientPath + 'index.html',
				function (err, data) {
					response.writeHead(200);
					response.end(data);
				}
			);
	    }
		else {
			fs.exists(requestedPath,function(exists){  
				if(!exists){  
					response.writeHeader(404, {"Content-Type": "text/plain"});    
					response.write("This sure is a 404 error!\n");    
					response.end();  
				}  
				else{  
					fs.readFile(requestedPath, "binary", function(err, file) {    
						if(err) {    
							response.writeHeader(500, {"Content-Type": "text/plain"});    
							response.write(err + "\n");    
							response.end();                     
		                 }    
		                 else{  
							response.writeHeader(200);    
							response.write(file, "binary");    
							response.end();  
						}  
					});  
				}  
			});  
		}
	}).listen(httpPort);  
}