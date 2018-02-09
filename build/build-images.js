const globby            = require('globby');
const imagemin          = require('imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminOptipng   = require('imagemin-optipng');
const imageminSvgo      = require('imagemin-svgo');

module.exports = async (glob, destination) => {
    const imagesStart = Date.now();
    const images = await globby(glob);

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

    const imagePromises = images.map(async imagePath => {
        const imageStart = Date.now();

        // Optimize image
        return imagemin([imagePath], destination, options)
            .then(files => console.log(`${Date.now() - imageStart} ms, ${imagePath}`))
            .catch(error => console.warn(error));
    });

    return Promise.all(imagePromises).then(() => {
        console.log(`Optimized ${imagePromises.length} images in ${Date.now() - imagesStart} ms`);
    }).catch(error => console.warn(error));
};
