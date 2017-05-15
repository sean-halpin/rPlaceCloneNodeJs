var http = require("http");
var fs = require('fs');
var indexHtml;
fs.readFile('./main.html', function (err, html) {
    if (err) {throw err;}
		indexHtml = html;
	})     

var data = 1;
var canvasData = [];

http.createServer(function (request, response) {
	console.log(request.url);
	response.writeHeader(200, {"Content-Type": "text/html"});  
	if(request.url == "/place"){    
        readPost(request,response);    
	}
	else if(request.url == "/canvas"){    
        response.write(JSON.stringify(canvasData));  
        response.end();     
	}
	else if(request.url == "/main.html"){    
        response.write(indexHtml);  
        response.end();    
	}
	else if(request.url == "/increment"){data++;}
	else if(request.url == "/decrement"){data--;}
   	response.end(data.toString());
}).listen(8081);

console.log('Server running at http://localhost:8081/');


function readPost(request, response) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {
			var json = JSON.parse(body);
			console.log(json.x);
			console.log(json.y);
			console.log(json.rgb);
			canvasData[canvasData.length] = json;
        });
    }
}