const fs = require('fs');
const http = require('http');

let server = null;

const startServer = () => {
    server = http.createServer((req, res) => {
        switch (req.url) {
            case '/code.css':
                fs.readFile(__dirname + req.url, (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Opening CSS Error.")
                        return;
                    }
                    res.writeHead(200);
                    res.end(data);
                });
                break;
            
            case '/code.js':
                fs.readFile(__dirname + req.url, (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Opening JS Error.")
                        return;
                    }
                    res.writeHead(200);
                    res.end(data);
                });
                break;
        
            default:
                fs.readFile(__dirname + '/code.html', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Opening HTML Error.");
                        return;
                    }
                    res.writeHead(200);
                    res.end(data);
                });
                break;
        }
    }).listen(8085);
}

const endServer = () => {
    if (!server) throw Error("Server has not started");
    server.close(() => {});
    setImmediate(() => { server.emit('close') });
}

module.exports = {
    startServer,
    endServer
}