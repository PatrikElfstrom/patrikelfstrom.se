const rollup    = require('rollup');
// const hash      = require('./plugins/hash').findHashes;
const babel     = require('rollup-plugin-babel');
const buildHash = require('./build-hash');


const entries = [
    'app/scripts/main.js'
];

let cache;
entries.forEach(entry => {
    rollup.rollup({
        entry: `${entry}`,
        cache,
        plugins: [
            // hash(),
            babel()
        ]
    }).then(bundle => {
        const destinationPath = 'dist/scripts/' + entry.match(/[a-z.]+$/);
        cache = bundle;

        const { code, map } = bundle.generate({
            format: 'iife',
            dest: destinationPath
        });

        buildHash(code, '.scripthash');

        bundle.write({
            format: 'iife',
            dest: destinationPath
        });

    }).catch(error => console.warn(error));
});
