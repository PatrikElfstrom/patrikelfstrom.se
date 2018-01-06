module.exports = (() => {

    let config = {
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
            },
            ecosystem: {
                apps: [{
                    name: 'patrikelfstrom.se',
                    script: 'patrikelfstrom.js',
                    cwd: '/var/www/live/patrikelfstrom.se',
                    watch: false,
                    out_file: 'log/pm2-out.log',
                    error_file: 'log/pm2-error.log',
                    log_date_format: 'YYYY-MM-DD HH:mm',
                    env: {
                        NODE_ENV: 'production',
                    },
                    env_production : {
                        NODE_ENV: 'production'
                    }
                }]
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
            },
            ecosystem: {
                apps: [{
                    name: 'dev.patrikelfstrom.se',
                    script: 'patrikelfstrom.js',
                    cwd: '/var/www/dev/patrikelfstrom.se',
                    watch: true,
                    ignore_watch: [
                        'dist',
                        'node_modules',
                        'log',
                    ],
                    out_file: 'log/pm2-out.log',
                    error_file: 'log/pm2-error.log',
                    log_date_format: 'YYYY-MM-DD HH:mm',
                    env: {
                        NODE_ENV: 'development',
                    },
                    env_production : {
                        NODE_ENV: 'production'
                    }
                }]
            }
        }
    };

    const structuredData = {
        structuredData: {
            "@context": "http://schema.org",
            "@type": "Person",
            "name": "Patrik Elfström",
            "jobTitle": "Front-end Developer",
            "url": "https://patrikelfstrom.se",
            "sameAs": [
                "https://github.com/PatrikElfstrom",
                "https://linkedin.com/in/PatrikElfstrom",
                "https://google.com/+PatrikElfström",
                "https://youtube.com/PatrikElfström",
                "https://soundcloud.com/PatrikElfstrom",
                "https://twitter.com/PatrikElfstrom"
            ],
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://patrikelfstrom.se",
                "name": "Patrik Elfström",
                "description": "Patrik Elfström is a Web Developer in Gothenburg, Sweden currently working as a Front-end Developer focusing on user experience and performance.",
                "primaryImageOfPage": "https://patrikelfstrom.se/images/icons/patrikelfstrom-logo-1200x1200.png"
            }
        }
    };

    config = process.env.NODE_ENV === 'production' ? config.prod : config.dev

    Object.assign(config, structuredData);

    return config;
})();
