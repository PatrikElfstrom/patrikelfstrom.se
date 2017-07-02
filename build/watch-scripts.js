const watch     = require('watch');
const path      = require('path');
const shell     = require('shelljs');

const cleanScripts  = 'npm run clean-scripts';
const buildScripts  = 'npm run build-scripts';
const buildSw       = 'npm run build-sw';
const scriptsSource = path.join(__dirname, '..', 'app', 'scripts');
const files         = ['*.js'];

watch.createMonitor(scriptsSource, {
    interval: 0.5
}, monitor => {
    monitor.files = files;

    monitor.on("created", function (f, stat) {
        shell.exec(buildScripts);
        shell.exec(buildSw);
    });

    monitor.on("changed", function (f, curr, prev) {
        shell.exec(buildScripts);
        shell.exec(buildSw);
    });

    monitor.on("removed", function (f, stat) {
        shell.exec(cleanScripts);
        shell.exec(buildScripts);
        shell.exec(buildSw);
    });
});
