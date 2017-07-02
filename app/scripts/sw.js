importScripts('/scripts/workbox-sw.prod.v1.0.1.js');
importScripts('/scripts/workbox-google-analytics.prod.v1.0.0.js');

workbox.googleAnalytics.initialize();

const workboxSW = new self.WorkboxSW({
    skipWaiting: true,
    clientsClaim: true
});

workboxSW.precache([
    '/?utm_source=homescreen'
]);

workboxSW.precache([]);
