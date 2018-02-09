const path      = require('path');
const globby    = require('globby');
const rollup    = require('rollup');
const babel     = require('rollup-plugin-babel');
const uglify    = require('rollup-plugin-uglify');
const eslint    = require('rollup-plugin-eslint');
const uglifyES  = require('uglify-es');

module.exports = async (glob, destination) => {
    const scriptsStart = Date.now();
    const scripts = await globby(glob);

    console.log(`Optimizing ${scripts.length} scripts...`);

    const scriptPromises = scripts.map(async scriptPath => {

        return new Promise(async (resolve, reject) => {
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
                bundle.generate({
                    format: 'iife',
                    file: destinationPath
                })
                .catch(error => console.warn(error))
                .then(code => {
                    const scriptSize = Buffer.byteLength(code.code);

                    console.log(`${Date.now() - scriptStart} ms, ${scriptPath}`);

                    resolve({ code, bundle, filename:filename, size:scriptSize });
                })
            });
        });
    });

    return Promise.all(scriptPromises).then(() => {
        console.log(`Optimized ${scriptPromises.length} scripts in ${Date.now() - scriptsStart} ms`);
    }).catch(error => console.warn(error));
};
