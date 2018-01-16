const watch     = require('watch');
const path      = require('path');
const shell     = require('shelljs');
const config    = require('../config');

const cleanRoot = 'npm run clean-root';
const copy      = 'npm run copy';
const buildSw   = 'npm run build-sw';
const source    = path.join(config.app);

watch.createMonitor(source, {
    interval: 0.5,
    ignoreDirectoryPattern: /scripts|images|styles/
}, monitor => {
    monitor.on("created", function (f, stat) {
        shell.exec(copy);
        shell.exec(buildSw);
    });

    monitor.on("changed", function (f, curr, prev) {
        shell.exec(copy);
        shell.exec(buildSw);
    });

    monitor.on("removed", function (f, stat) {
        shell.exec(cleanRoot);
        shell.exec(copy);
        shell.exec(buildSw);
    });
});
