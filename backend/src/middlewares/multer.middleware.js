import multer from 'multer';

// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

// Initialize upload
const upload = multer({
    storage: storage
})

export {upload}