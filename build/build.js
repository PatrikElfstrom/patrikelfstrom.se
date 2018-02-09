const path          = require('path');
const config        = require('../config');
const buildImages   = require('./build-images');
const buildScripts  = require('./build-scripts');
const buildStyles   = require('./build-styles');
const buildHtml     = require('./build-html');

(async () => {
    const promises = [];
    const buildStart = Date.now();

    // ========================================================
    // Images
    const imageSource = path.join(config.app, 'images/**/*.{png,jpg,gif}');
    const imageDestination = path.join(config.public, 'images');

    const imagePromise = buildImages(imageSource, imageDestination)
        .catch(error => console.warn(error));


    // ========================================================
    // Scripts
    const scriptSource = path.join(config.app, 'scripts/**/*.js');
    const scriptDestination = path.join(config.public, 'scripts');

    const scriptPromise = buildScripts(scriptSource, scriptDestination)
        .catch(error => console.warn(error));


    // ========================================================
    // Styles
    const styleSource = path.join(config.app, 'styles/**/*.scss');
    const styleDestination = path.join(config.public, 'styles');

    const stylePromise = buildStyles(styleSource)
        .catch(error => console.warn(error));


    // ========================================================
    // HTMl
    const partialSource = path.join(config.app, 'templates/partials/**/*.hbs');
    const templateSource = path.join(config.app, 'templates/*.hbs');
    const templateDestination = config.public;

    const templatePromise = buildHtml(templateSource, partialSource, config)
        .catch(error => console.warn(error));


})();
