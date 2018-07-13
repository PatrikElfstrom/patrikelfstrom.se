const globby            = require('globby');
const mkdirp            = require('mkdirp');
const imagemin          = require('imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminOptipng   = require('imagemin-optipng');
const imageminSvgo      = require('imagemin-svgo');
const config            = require('../config');

module.exports = images = async (
    source = config.imageSource,
    destination = config.imageDestination
) => new Promise(async (resolve, reject) => {
    const imagesStart = Date.now();
    const images = await globby(source);

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

    console.log(`Optimizing ${images.length} images...`);

    mkdirp(destination, err => {
        if (err) console.error(err)
    });

    const imagePromises = images.map(async imagePath => {
        const imageStart = Date.now();

        // Optimize image
        return imagemin([imagePath], destination, options)
            .then(files => console.log(`${Date.now() - imageStart} ms, ${imagePath}`))
            .catch(error => console.warn(error));
    });

    return Promise.all(imagePromises).then(() => {
        console.log(`Optimized ${imagePromises.length} images in ${Date.now() - imagesStart} ms`);
        resolve();
    }).catch(error => reject(error));
});

images();
