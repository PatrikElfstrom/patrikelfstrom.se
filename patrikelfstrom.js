const spdy = require('spdy');
const express = require('express');
const compression = require('compression');
const fs = require('fs');
const http = require('http');
const path = require('path');
let config = require('./config');

const app = express();
config = process.env.NODE_ENV === 'production' ? config.prod : config.dev;

const options = {
    key: fs.readFileSync(config.tls.key),
    cert: fs.readFileSync(config.tls.cert),
    ca: fs.readFileSync(config.tls.ca)
};

// Enable compression
app.use(compression());

// Serve Index
app.get(/([^/]*)(\/|\/index.html)$/, (req, res) => {
    const content = fs.readFileSync('./dist/index.html').toString('utf-8');

    res.status(200).send(content);
});

// Serve Service Worker
app.get('/sw.js', function(req, res, next) {
    res.set({'cache-control': 'public, max-age=7200'});
    req.url = path.join('/scripts', 'sw.js');
    next();
});

// Serve Static Files
app.use('/', express.static(__dirname + '/dist', {
    maxage: '1y'
}));

app.use((req, res) => {
    const content = fs.readFileSync('./dist/404.html').toString('utf-8');

    res.status(404).send(content);
});

spdy.createServer(options, app).listen(config.port.https, error => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }

    console.log('Listening on port: ' + config.port.https + '.');
});

http.createServer((req, res) => {
    res.writeHead(301, { "Location": 'https://' + req.headers.host + req.url });
    res.end();
}).listen(config.port.http, error => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }

    console.log('Listening on port: ' + config.port.http + '.');
});
