const spdy          = require('spdy');
const express       = require('express');
const compression   = require('compression');
const fs            = require('fs');
const http          = require('http');
const path          = require('path');
const bodyParser    = require('body-parser');
const uuid          = require('uuid');
const config        = require('./config');

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

// Enable compression
app.use(compression({
    threshold: 0
}));

// Generate nonce for CSP
app.use((req, res, next) => {
  res.locals.nonce = uuid.v4();
  next();
});

// Remove x-powered-by header
app.disable('x-powered-by')

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
            + "report-uri /report-csp-violation; "
            + "report-to /report-csp-violation; "
            + "script-src 'self' https://www.google-analytics.com; "
            + "style-src 'self' 'nonce-"+res.locals.nonce+"'; "
            + "img-src 'self' https://www.google-analytics.com; "
            + "font-src https://fonts.gstatic.com;");

    // Only connect to this site via HTTPS for the six months
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Enforce the Certificate Transparency policy
    res.setHeader('Expect-CT', 'enforce, max-age=30, report-uri="https://'+config.host+'/report-ect-violation"');

    // Don't send full url when cross-origin and send nothing when scheme downgrading
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
});

// Parse CSP report violation
app.use(bodyParser.json({
    type: [
        'json',
        'application/csp-report',
        'application/expect-ct-report+json'
    ]
}));

// Redirect all to config.host
app.use((req, res, next) => {
    if(req.headers.host !== config.host) {
        res.writeHead(301, { "Location": 'https://' + config.host + req.url });
        res.end();
    }

    next();
});

// Catch CSP report violation
app.post('/report-csp-violation', (req, res) => {
    if(req.body) {
        console.log('CSP Violation: ', req.body);
    } else {
        console.log('CSP Violation: No data received!');
    }

    res.status(204).end();
});

// Catch Expect-CT report violation
app.post('/report-ect-violation', (req, res) => {
    if(req.body) {
        console.log('Expect-CT Violation: ', req.body);
    } else {
        console.log('Expect-CT Violation: No data received!');
    }

    res.status(204).end();
});

// Serve Index
app.get(/([^/]*)(\/|\/index.html)$/, (req, res) => {
    let content = fs.readFileSync(path.join(__dirname, 'dist', 'index.html')).toString('utf-8');

    // Inject nonce
    content = content.replace('[nonce]', res.locals.nonce);

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

// Return 404
app.use((req, res) => {
    let content = fs.readFileSync('./dist/404.html').toString('utf-8');

    // Inject nonce
    content = content.replace('[nonce]', res.locals.nonce);

    res.status(404).send(content);
});

// Return 500
app.use((err, req, res, next) => {
    let content = fs.readFileSync('./dist/500.html').toString('utf-8');

    // Inject nonce
    content = content.replace('[nonce]', res.locals.nonce);

    res.status(500).send(content);
});

spdy.createServer(options, app).listen(config.port.https, error => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }

    console.log('Listening on port: ' + config.port.https + '.');
});

http.createServer((req, res) => {
    res.writeHead(301, { "Location": 'https://' + config.host + req.url });
    res.end();
}).listen(config.port.http, error => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }

    console.log('Listening on port: ' + config.port.http + '.');
});
