const swBuild   = require('workbox-build');
const copy      = require('copy');
const resolve   = require('resolve');
const path      = require('path');
const config    = require('../config');

// Inject manifest in sw
swBuild.injectManifest({
    globDirectory: config.public,
    globPatterns: ['**\/*.{json,jpg,png,svg,ico,woff2,js,css}', 'index.html'],
    swSrc: path.join(config.app, 'scripts', 'sw.js'),
    swDest: path.join(config.public, 'sw.js'),
})
.then(() => {
    console.log('The service worker has been injected with a precache list.');
});

// Copy workbox-sw
resolve('workbox-sw', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    copy.one(res, path.join(config.public, 'scripts'), {flatten: true}, () => {
        console.log('Workbox-sw has been copied');
    });
});

// Copy workbox-google-analytics
resolve('workbox-google-analytics', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    copy.one(res, path.join(config.public, 'scripts'), {flatten: true}, () => {
        console.log('Workbox-google-analytics has been copied');
    });
});
