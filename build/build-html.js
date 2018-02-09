const pify          = require('pify');
const path          = require('path');
const globby        = require('globby');
const fs            = pify(require('fs'));
const Handlebars    = require('handlebars');

module.exports = async (templateSource, partialSource, templateData) => {
    const templateStart = Date.now();
    const templates = await globby(templateSource);
    const partials = await globby(partialSource);

    console.log(`Optimizing ${templates.length} templates...`);

    // Register Helpers
    Handlebars.registerHelper('json', context => {
        return JSON.stringify(context);
    });

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
            .then(data => Handlebars.compile(data)(templateData))
            .then(() => {
                console.log(`${Date.now() - templateStart} ms, ${template}`);
            })
            .catch(error => console.warn(error))
    );

    return Promise.all(templatePromises).then(() => {
        console.log(`Optimized ${templatePromises.length} templates in ${Date.now() - templateStart} ms`)
    }).catch(error => console.warn(error));




    // console.log(`Optimizing ${styles.length} styles...`);

    // const stylePromises = styles.map(async stylePath => {
    //     const styleStart = Date.now();

    //     return sass.render({ file: stylePath })
    //         .then(style => postcss([ autoprefixer ]).process(style.css))
    //         .then(() => {
    //             console.log(`${Date.now() - stylesStart} ms, ${stylePath}`);
    //         })
    //         .catch(error => console.warn(error));
    // });

    // return Promise.all(stylePromises).then(() => {
    //     console.log(`Optimized ${styles.length} scripts in ${Date.now() - stylesStart} ms`)
    // }).catch(error => console.warn(error));
};
