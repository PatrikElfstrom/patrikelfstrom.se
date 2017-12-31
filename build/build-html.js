const fs            = require('fs');
const path          = require('path');
const minify        = require('html-minifier').minify;
const handlebars    = require('handlebars');
const config        = require('../config');

const index = path.join(__dirname, '..', 'dist', 'index.html');

fs.readFile(index, 'utf8', (err, data) => {
    if (err) throw err;

    const template = handlebars.compile(data);
    data = template(config);

    data = minify(data, {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        sortAttributes: true,
        sortClassName: true,
        removeAttributeQuotes: true
    });

    fs.writeFile(index, data, 'utf8', () => {
        console.log('Minified index.html');
    });
});
