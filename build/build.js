const shell = require('shelljs');

const cleanDist    = 'npm run clean-dist';
const copy         = 'npm run copy';
const buildHTML    = 'npm run build-html';
const buildStyles  = 'npm run build-styles';
const buildScripts = 'npm run build-scripts';
const buildImages  = 'npm run build-images';
const buildFonts   = 'npm run build-fonts';
const buildSw      = 'npm run build-sw';

var promises = [];

// Run cleanDist async
shell.exec(cleanDist, {async:true}, () => {

    // Run all tasks after cleanDist async
    // And push them in to the promises array
    promises.push(shellExec(copy, {async:true}));
    promises.push(shellExec(buildStyles, {async:true}));
    promises.push(shellExec(buildScripts, {async:true}));
    promises.push(shellExec(buildImages, {async:true}));
    promises.push(shellExec(buildFonts, {async:true}));

    // When all promises has been resolved run buildSw
    Promise.all(promises).then(() => {
        shellExec(buildHTML, {async:true});
        shell.exec(buildSw);
    });
});

// Run shell.exec and return a resolved promise when done
function shellExec(arguments) {
    return new Promise(resolve => {
        shell.exec(arguments, () => {
            resolve();
        });
    });
}
