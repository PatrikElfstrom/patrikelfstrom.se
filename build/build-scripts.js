const rollup    = require('rollup');
const babel     = require('rollup-plugin-babel');
const uglify    = require('rollup-plugin-uglify');
const resolve   = require('rollup-plugin-node-resolve');
const uglifyES  = require('uglify-es');
const path      = require('path');
const config    = require('../config');

const entries = [
    path.join(config.app, 'scripts', 'main.js'),
    path.join(config.app, 'scripts', 'triangulr.js')
];

let cache;
entries.forEach(entry => {
    rollup.rollup({
        input: `${entry}`,
        cache,
        plugins: [
            resolve(),
            uglify({}, uglifyES.minify),
            babel()
        ]
    }).then(bundle => {
        const filename = entry.match(/[a-z.]+$/)[0];
        const destinationPath = path.join(config.public, 'scripts', filename);
        cache = bundle;

        bundle.generate({
            format: 'iife',
            file: destinationPath
        }).catch(error => console.warn(error));

        bundle.write({
            format: 'iife',
            file: destinationPath
        });

    }).catch(error => console.warn(error));
});
