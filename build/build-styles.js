
// const mkdirp        = require('mkdirp');
const path          = require('path');
const pify          = require('pify');
const fs            = pify(require('fs'));
const globby        = require('globby');
const mkdirp        = require('mkdirp');
const sass          = pify(require('node-sass'));
const autoprefixer  = require('autoprefixer');
const postcss       = require('postcss');
const config        = require('../config');
// const cleanCss      = require('clean-css');

module.exports = styles = async (
    source = config.styleSource,
    destination = config.styleDestination
) => {
    const stylesStart = Date.now();
    const styles = await globby(source);

    console.log(`Transpiling ${styles.length} styles...`);

    mkdirp(destination, err => {
        if (err) console.error(err)
    });

    const stylePromises = styles.map(async stylePath => {
        const styleStart = Date.now();

        return sass.render({ file: stylePath })
            .then(style => postcss([ autoprefixer ]).process(style.css, { from: undefined }))
            .then(css => {
                // Don't know why this is necessary
                mkdirp(destination, err => {
                    if (err) console.error(err)
                });

                fs.writeFile(`${path.join(destination, path.basename(stylePath, path.extname(stylePath)))}.css`, css, 'utf8')
                .then(() => {
                    console.log(`${Date.now() - stylesStart} ms, ${stylePath}`);
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.warn(error));
    });

    return Promise.all(stylePromises).then(() => {
        console.log(`Transpiled ${stylePromises.length} styles in ${Date.now() - stylesStart} ms`)
    }).catch(error => console.warn(error));
};

styles();
