const fs            = require('fs');
const path          = require('path');
const glob          = require('glob');
const minify        = require('html-minifier').minify;
const Handlebars    = require('handlebars');
const config        = require('../config');

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

glob("dist/**/*.html", function (er, files) {
    files.forEach(file => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) throw err;

            const template = Handlebars.compile(data);
            data = template(config);

            data = minify(data, {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                sortAttributes: true,
                sortClassName: true,
                removeAttributeQuotes: true
            });

            fs.writeFile(file, data, 'utf8', () => {
                console.log('Transformed ' + file);
            });
        });
    });
})
