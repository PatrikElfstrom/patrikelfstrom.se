const swBuild   = require('workbox-build');
const copy      = require('copy');
const resolve   = require('resolve');
const path      = require('path');
const config    = require('../config');

module.exports = sw = async (
    source = config.swSource,
    destination = config.swDestination
) => {
    const swStart = Date.now();

    // Inject manifest in sw
    const swBuildPromise = swBuild.injectManifest({
        globDirectory: config.public,
        globPatterns: ['**\/*.{json,jpg,png,svg,ico,woff2,js,css}', 'index.html'],
        swSrc: path.join(source, 'sw.js'),
        swDest: path.join(destination, 'sw.js'),
    })
    .then(() => {
        console.log('The service worker has been injected with a precache list.');
    });

    // Copy workbox-sw
    const workboxPromise = new Promise((pResolve, reject) => {
        resolve('workbox-sw', (err, res) => {
            if (err) {
                console.error(err);
                reject();
                return;
            }

            copy.one(res, path.join(config.public, 'scripts'), {flatten: true}, () => {
                console.log('Workbox-sw has been copied');
                pResolve();
            });
        });
    });

    // Copy workbox-google-analytics
    const workboxGaPromise = new Promise((pResolve, reject) => {
        resolve('workbox-google-analytics', (err, res) => {
            if (err) {
                console.error(err);
                reject();
                return;
            }

            copy.one(res, path.join(config.public, 'scripts'), {flatten: true}, () => {
                console.log('Workbox-google-analytics has been copied');
                pResolve();
            });
        });
    });


    return Promise.all([swBuildPromise, workboxPromise, workboxGaPromise]).then(() => {
        console.log(`Service Worker complete in ${Date.now() - swStart} ms`);
    }).catch(error => console.warn(error));
}

sw(config.swSource, config.swDestination);
