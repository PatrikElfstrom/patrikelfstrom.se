const watch     = require('watch');
const path      = require('path');
const shell     = require('shelljs');
const config    = require('../config');

const cleanImages  = 'npm run clean-images';
const buildImages  = 'npm run build-images';
const buildSw      = 'npm run build-sw';
const imagesSource = path.join(config.app, 'images');
const files        = ['*.{jpg,png,svg,ico}'];

watch.createMonitor(imagesSource, {
    interval: 0.5
}, monitor => {
    monitor.files = files;

    monitor.on("created", function (f, stat) {
        shell.exec(buildImages);
        shell.exec(buildSw);
    });

    monitor.on("changed", function (f, curr, prev) {
        shell.exec(buildImages);
        shell.exec(buildSw);
    });

    monitor.on("removed", function (f, stat) {
        shell.exec(cleanImages);
        shell.exec(buildImages);
        shell.exec(buildSw);
    });
});
