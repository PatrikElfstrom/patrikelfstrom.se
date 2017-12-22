const rollup    = require('rollup');
// const hash      = require('./plugins/hash').findHashes;
const babel     = require('rollup-plugin-babel');
const uglify    = require('rollup-plugin-uglify');
const uglifyES  = require('uglify-es');
const buildHash = require('./build-hash');

const entries = [
    'app/scripts/main.js'
];

let cache;
entries.forEach(entry => {
    rollup.rollup({
        input: `${entry}`,
        cache,
        plugins: [
            // hash(),
            uglify({}, uglifyES.minify),
            babel()
        ]
    }).then(bundle => {
        const destinationPath = 'dist/scripts/' + entry.match(/[a-z.]+$/);
        cache = bundle;

        bundle.generate({
            format: 'iife',
            file: destinationPath
        }).then(data => {
            buildHash(data.code, '.scripthash');
        }).catch(error => console.warn(error));

        bundle.write({
            format: 'iife',
            file: destinationPath
        });

    }).catch(error => console.warn(error));
});
