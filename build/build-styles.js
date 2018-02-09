
// const mkdirp        = require('mkdirp');
// const fs            = require('fs');
// const path          = require('path');
const pify          = require('pify');
const globby        = require('globby');
const sass          = pify(require('node-sass'));
const autoprefixer  = require('autoprefixer');
const postcss       = require('postcss');
// const cleanCss      = require('clean-css');

module.exports = async glob => {
    const stylesStart = Date.now();
    const styles = await globby(glob);

    console.log(`Optimizing ${styles.length} styles...`);

    const stylePromises = styles.map(async stylePath => {
        const styleStart = Date.now();

        return sass.render({ file: stylePath })
            .then(style => postcss([ autoprefixer ]).process(style.css))
            .then(() => {
                console.log(`${Date.now() - stylesStart} ms, ${stylePath}`);
            })
            .catch(error => console.warn(error));
    });

    return Promise.all(stylePromises).then(() => {
        console.log(`Optimized ${stylePromises.length} scripts in ${Date.now() - stylesStart} ms`)
    }).catch(error => console.warn(error));
};
