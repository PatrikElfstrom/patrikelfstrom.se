const imagemin          = require('imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminOptipng   = require('imagemin-optipng');
const imageminSvgo      = require('imagemin-svgo');
const path              = require('path');
const config            = require('../config');

const options = {
    plugins: [
        imageminJpegoptim({
            progressive: true,
            max: 70
        }),
        imageminOptipng({
            optimizationLevel: 5
        }),
        imageminSvgo({
            plugins: [
                {
                    removeViewBox: false
                }
            ]
        })
    ]
};

imagemin([path.join(config.app, 'images', '*.{jpg,png,svg}')], path.join(config.public, 'images'), options).then(files => {
    console.log('images has been transformed');
}).catch(err => {
    console.log(err)
});

imagemin([path.join(config.app, 'images', 'icons', '*.{jpg,png,svg,ico}')], path.join(config.public, 'images', 'icons'), options).then(files => {
    console.log('images/icons has been transformed');
}).catch(err => {
    console.log(err)
});
