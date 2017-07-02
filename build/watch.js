const shell = require('shelljs');

const watchScripts = 'npm run watch-scripts';
const watchStyles  = 'npm run watch-styles';
const watchImages  = 'npm run watch-images';
const watchRoot    = 'npm run watch-root';

shell.exec(watchScripts, {async:true});
shell.exec(watchStyles, {async:true});
shell.exec(watchImages, {async:true});
shell.exec(watchRoot, {async:true});
