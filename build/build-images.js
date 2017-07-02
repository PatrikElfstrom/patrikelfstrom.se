const imagemin = require('imagemin');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

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

imagemin(['app/images/*.{jpg,png,svg}'], 'dist/images', options).then(files => {
    console.log('app/images has been transformed');
}).catch(err => {
    console.log(err)
});

imagemin(['app/images/icons/*.{jpg,png,svg,ico}'], 'dist/images/icons', options).then(files => {
    console.log('app/images/icons has been transformed');
}).catch(err => {
    console.log(err)
});
