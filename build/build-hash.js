const crypto        = require('crypto');
const fs            = require('fs');
const path          = require('path');

module.exports = (data, filename) => {
    const hashFile = path.join(__dirname, '..', filename);

    const hash = crypto.createHash('sha256').update(data).digest('base64');

    fs.writeFile(hashFile, hash, 'utf8', () => {
        console.log('Generated ' + filename);
    });
};
