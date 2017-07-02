const watch     = require('watch');
const path      = require('path');
const shell     = require('shelljs');

const cleanStyles   = 'npm run clean-styles';
const buildStyles   = 'npm run build-styles';
const buildSw       = 'npm run build-sw';
const copy          = 'npm run copy';
const stylesSource  = path.join(__dirname, '..', 'app', 'styles');
const files         = ['*.scss'];

watch.createMonitor(stylesSource, {
    interval: 0.5
}, monitor => {
    monitor.files = files;

    monitor.on("created", function (f, stat) {
        shell.exec(copy);
        shell.exec(buildStyles);
        shell.exec(buildSw);
    });

    monitor.on("changed", function (f, curr, prev) {
        shell.exec(copy);
        shell.exec(buildStyles);
        shell.exec(buildSw);
    });

    monitor.on("removed", function (f, stat) {
        shell.exec(copy);
        shell.exec(cleanStyles);
        shell.exec(buildStyles);
        shell.exec(buildSw);
    });
});
