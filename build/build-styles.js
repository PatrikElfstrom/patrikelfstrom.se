const mkdirp        = require('mkdirp');
const fs            = require('fs');
const path          = require('path');
const cleanCss      = require('clean-css');
const sass          = require('node-sass');
const autoprefixer  = require('autoprefixer');
const postcss       = require('postcss');

const head      = path.join(__dirname, '..', 'app', 'styles', 'head.scss');
const index     = path.join(__dirname, '..', 'dist', 'index.html');
const inPath    = path.join(__dirname, '..', 'app', 'styles');
const outPath   = path.join(__dirname, '..', 'dist', 'styles');

const files = [
    {
        in: path.join(inPath, 'style.scss'),
        out: path.join(outPath, 'style.css')
    }
];

sass.render({
    file: head
}, (err, result) => {
    if (err) {
        throw err;
    }

    postcss([ autoprefixer ]).process(result.css).then(function (result) {
        result.warnings().forEach(function (warn) {
            console.warn(warn.toString());
        });
        let output = result.css;

        // output = new cleanCss().minify(output).styles;

        fs.readFile(index, 'utf8', (err, data) => {
            if (err) throw err;

            data = data.replace('{{head}}', output);

            fs.writeFile(index, data, 'utf8', () => {
                console.log('Injected head.scss into index.html');
            });
        });
    }).catch(error => console.warn(error));
});
