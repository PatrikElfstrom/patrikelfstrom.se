const path      = require('path');
const globby    = require('globby');
const mkdirp    = require('mkdirp');
const rollup    = require('rollup');
const babel     = require('rollup-plugin-babel');
const uglify    = require('rollup-plugin-uglify');
const eslint    = require('rollup-plugin-eslint');
const uglifyES  = require('uglify-es');
const config    = require('../config');

module.exports = scripts = async (
    source = config.scriptSource,
    destination = config.scriptDestination
) => new Promise(async (resolve, reject) => {
    const scriptsStart = Date.now();
    const scripts = await globby(source);

    console.log(`Compiling ${scripts.length} scripts...`);

    const scriptPromises = scripts.map(async scriptPath => {
        const scriptStart = Date.now();
        const filename = path.basename(scriptPath);
        const destinationPath = path.join(destination, filename);

        rollup.rollup({
            input: scriptPath,
            plugins: [
                babel(),
                // eslint(),
                uglify({}, uglifyES.minify)
                // tests
            ]
        })
        .catch(error => console.warn(error))
        .then(bundle => {
            bundle.write({
                format: 'iife',
                file: destinationPath
            })
            .then(() => {
                console.log(`${Date.now() - scriptStart} ms, ${scriptPath}`);
            })
            .catch(error => console.warn(error))
        });
    });

    return Promise.all(scriptPromises).then(() => {
        console.log(`Compiled ${scriptPromises.length} scripts in ${Date.now() - scriptsStart} ms`);
        resolve();
    }).catch(error => reject(error));
});

scripts();
