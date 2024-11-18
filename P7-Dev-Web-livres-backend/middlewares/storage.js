const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "temp");
    },
    filename: function (req, file, callback) {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + Date.now() + '.webp')
    }
});

module.exports = { storage };