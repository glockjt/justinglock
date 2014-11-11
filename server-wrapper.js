var http = require('http'),
    httpProxy = require('http-proxy');
//
// Create a basic proxy server in one line of code...
//
// This listens on port 8000 for incoming HTTP requests 
// and proxies them to port 9000
httpProxy.createServer(3000, 'localhost').listen(80);
