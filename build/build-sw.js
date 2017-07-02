const swBuild = require('workbox-build');
const copy = require('copy');
const resolve = require('resolve');

// Inject manifest in sw
swBuild.injectManifest({
    globDirectory: './dist/',
    globPatterns: ['**\/*.{html,json,jpg,png,svg,ico,woff2,js,css}'],
    swSrc: './app/scripts/sw.js',
    swDest: './dist/scripts/sw.js',
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

    copy.one(res, './dist/scripts', {flatten: true}, () => {
        console.log('Workbox-sw has been copied');
    });
});

// Copy workbox-google-analytics
resolve('workbox-google-analytics', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    copy.one(res, './dist/scripts', {flatten: true}, () => {
        console.log('Workbox-google-analytics has been copied');
    });
});
