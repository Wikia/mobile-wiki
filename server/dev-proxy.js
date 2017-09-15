/**
Proxy allowing to develop locally while using wikia-dev domain
To make it work run `npm run dev-proxy` and set proxy auto-config in your browser as in the gist:
https://gist.github.com/rogatty/151a29205420f23f54138ca1b2dc92a7
*/

const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const port = 7002;

const server = http.createServer((req, res) => {
	proxy.web(req, res, {target: 'http://127.0.0.1:7001'});
});

console.log(`proxy listening on port ${port}`);
server.listen(port);
