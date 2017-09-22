module.exports = {
    prod: {
        tls: {
            key: '/etc/letsencrypt/live/patrikelfstrom.se/privkey.pem',
            cert: '/etc/letsencrypt/live/patrikelfstrom.se/cert.pem',
            ca: '/etc/letsencrypt/live/patrikelfstrom.se/chain.pem'
        },
        port: {
            https: 8010,
            http: 8011
        }
    },
    dev: {
        tls: {
            key: '/etc/letsencrypt/live/dev.patrikelfstrom.se/privkey.pem',
            cert: '/etc/letsencrypt/live/dev.patrikelfstrom.se/cert.pem'
        },
        port: {
            https: 8012,
            http: 8013
        }
    }
};
