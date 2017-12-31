module.exports = (() => {

    const config = {
        prod: {
            host: 'patrikelfstrom.se',
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
            host: 'dev.patrikelfstrom.se',
            tls: {
                key: '/etc/letsencrypt/live/dev.patrikelfstrom.se/privkey.pem',
                cert: '/etc/letsencrypt/live/dev.patrikelfstrom.se/cert.pem',
                ca: '/etc/letsencrypt/live/dev.patrikelfstrom.se/chain.pem'
            },
            port: {
                https: 8012,
                http: 8013
            }
        }
    };

    return process.env.NODE_ENV === 'production' ? config.prod : config.dev;
})();
