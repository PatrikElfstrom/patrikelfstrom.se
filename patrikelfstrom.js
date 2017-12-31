const spdy = require('spdy');
const express = require('express');
const compression = require('compression');
const fs = require('fs');
const http = require('http');
const path = require('path');
const config = require('./config');

const app = express();

const ciphers = [
        "ECDHE-ECDSA-AES256-GCM-SHA384",
        "ECDHE-RSA-AES256-GCM-SHA384",
        "ECDHE-ECDSA-CHACHA20-POLY1305",
        "ECDHE-RSA-CHACHA20-POLY1305",
        "ECDHE-ECDSA-AES128-GCM-SHA256",
        "ECDHE-RSA-AES128-GCM-SHA256",
        "ECDHE-ECDSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA384",
        "ECDHE-ECDSA-AES128-SHA256",
        "ECDHE-RSA-AES128-SHA256",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!3DES",
        "!MD5",
        "!PSK"
    ].join(':');

const options = {
    key: fs.readFileSync(config.tls.key),
    cert: fs.readFileSync(config.tls.cert),
    ca: fs.readFileSync(config.tls.ca),
    ciphers: ciphers,
    honorCipherOrder: true,
    secureOptions: 'tlsv12'
};

const stylehashFile = path.join(__dirname, '.stylehash');
const stylehash = 'sha256-' + fs.readFileSync(stylehashFile);
const scripthashFile = path.join(__dirname, '.scripthash');
const scripthash = 'sha256-' + fs.readFileSync(scripthashFile);

// Enable compression
app.use(compression({
    threshold: 0
}));

app.use(function(req, res, next) {
    // Block site from being framed with X-Frame-Options
    res.setHeader('X-Frame-Options', 'Deny');

    // Block pages from loading when they detect reflected XSS attacks
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Prevent browsers from incorrectly detecting non-scripts as scripts
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Deny access as default
    // Allow URLs from same origin to be loaded using script interfaces
    // Only load scripts from same origin and www.google-analytics.com (added hash for future CSP 3 support)
    // Only allow styles with hash
    // Only load images from same origin and www.google-analytics.com
    // Only load fonts from from fonts.gstatic.com
    // Disable the loading of any resources and disable framing
    // Disable use of <base>
    // Restrict where <form> contents may be submitted to
    res.setHeader('Content-Security-Policy',
              "default-src 'none'; "
            + "base-uri 'none'; "
            + "form-action 'none'; "
            + "frame-ancestors 'none'; "
            + "connect-src 'self'; "
            + "manifest-src 'self'; "
            + "worker-src 'self'; "
            + "script-src 'self' https://www.google-analytics.com; "
            + "style-src 'self' '"+stylehash+"'; "
            + "img-src 'self' https://www.google-analytics.com; "
            + "font-src https://fonts.gstatic.com;");

    // Only connect to this site via HTTPS for the six months
    res.setHeader('Strict-Transport-Security', 'max-age=15768000; includeSubDomains');

    next();
});

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
    maxage: '1y',
    setHeaders: res => {
        res.removeHeader('Content-Security-Policy')
    }
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
