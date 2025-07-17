const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/", // Folder tempat menyimpan gambar
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Contoh: 1623403434.png
    },
});

const uploadImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});

module.exports = uploadImage;