importScripts('/scripts/workbox-sw.prod.v2.1.2.js');
importScripts('/scripts/workbox-google-analytics.prod.v2.1.1.js');

workbox.googleAnalytics.initialize();

const workboxSW = new self.WorkboxSW({
    skipWaiting: true,
    clientsClaim: true
});

workboxSW.precache([
    '/?utm_source=homescreen'
]);

workboxSW.precache([]);
