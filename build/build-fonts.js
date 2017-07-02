const googWebfontDl = require('goog-webfont-dl');

googWebfontDl({
    font: 'Open Sans',
    formats: ['woff2'],
    destination: 'dist/fonts',
    styles: ['400', '800']
});
