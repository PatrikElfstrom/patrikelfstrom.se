const mkdirp        = require('mkdirp');
const fs            = require('fs');
const path          = require('path');
const cleanCss      = require('clean-css');
const sass          = require('node-sass');
const autoprefixer  = require('autoprefixer');
const postcss       = require('postcss');
const config        = require('../config');

const headSCSSFile  = path.join(config.app, 'styles', 'head.scss');
const indexHTMLFile = path.join(config.public, 'index.html');

sass.render({
    file: headSCSSFile
}, (err, result) => {
    if (err) {
        throw err;
    }

    postcss([ autoprefixer ]).process(result.css).then(function (result) {
        result.warnings().forEach(function (warn) {
            console.warn(warn.toString());
        });
        let output = result.css;

        output = new cleanCss().minify(output).styles;

        fs.readFile(indexHTMLFile, 'utf8', (err, data) => {
            if (err) throw err;

            data = data.replace('{{head}}', output);

            fs.writeFile(indexHTMLFile, data, 'utf8', () => {
                console.log('Injected head.scss into index.html');
            });
        });
    }).catch(error => console.warn(error));
});
