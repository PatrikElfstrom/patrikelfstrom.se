const pify          = require('pify');
const path          = require('path');
const globby        = require('globby');
const mkdirp        = require('mkdirp');
const fs            = pify(require('fs'));
const config        = require('../config');
const Handlebars    = require('handlebars');


module.exports = html = (
    templateSource = config.templateSource,
    destination = config.templateDestination,
    partialSource = config.partialSource
) => new Promise(async (resolve, reject) => {
    const templateStart = Date.now();
    const templates = await globby(templateSource);
    const partials = await globby(partialSource);

    console.log(`Optimizing ${templates.length} templates...`);

    mkdirp(destination, err => {
        if (err) console.error(err)
    });

    // Register Helpers
    Handlebars.registerHelper('json', context => JSON.stringify(context));

    // Register Partials
    partials.map(async partial => {
        return fs.readFile(partial, 'utf8')
        .then(data => Handlebars.registerPartial(
            path.basename(partial, path.extname(partial)),
            data
        ))
        .catch(error => console.warn(error));
    });

    // Compile Templates
    const templatePromises = templates.map(async template =>
        fs.readFile(template, 'utf8')
            .then(data => Handlebars.compile(data)(config))
            .then(data => {
                fs.writeFile(`${path.join(destination, path.basename(template, path.extname(template)))}.html`, data, 'utf8')
                .then(() => {
                    console.log(`${Date.now() - templateStart} ms, ${template}`);
                })
                .catch(error => console.warn(error));
            })
            .catch(error => console.warn(error))
    );

    return Promise.all(templatePromises).then(() => {
        console.log(`Optimized ${templatePromises.length} templates in ${Date.now() - templateStart} ms`);
        resolve();
    }).catch(error => reject(error));
});

html();
