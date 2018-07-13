const path          = require('path');
const shell         = require('shelljs');
const config        = require('../config');
const buildImages   = require('./build-images');
const buildScripts  = require('./build-scripts');
const buildStyles   = require('./build-styles');
const buildHtml     = require('./build-html');
const buildSw       = require('./build-sw');

// ========================================================
// Clean
shell.exec('npm run clean-dist');

(async () => {
    const buildStart = Date.now();

    // ========================================================
    // Copy root files
    shell.exec('npm run copy', { async: true });


    // ========================================================
    // Images
    const imagePromise = buildImages(config.imageSource, config.imageDestination)
        .catch(error => console.warn(error));


    // ========================================================
    // Scripts
    const scriptPromise = buildScripts(config.scriptSource, config.scriptDestination)
        .catch(error => console.warn(error));


    // ========================================================
    // Styles
    const stylePromise = buildStyles(config.styleSource, config.styleDestination)
        .catch(error => console.warn(error));


    // ========================================================
    // HTMl
    const templatePromise = buildHtml(config.templateSource, config.templateDestination, config.partialSource)
        .catch(error => console.warn(error));


    // ========================================================
    // Service Worker
    const serviceWorkerPromise = Promise.all([imagePromise, scriptPromise, stylePromise, templatePromise]).then(() =>
        buildSw(config.swSource, config.swDestination)
            .catch(error => console.warn(error)));

    Promise.all([imagePromise, scriptPromise, stylePromise, templatePromise, serviceWorkerPromise]).then(() => {
        console.log(`Built in ${Date.now() - buildStart} ms`);
    });
})();
