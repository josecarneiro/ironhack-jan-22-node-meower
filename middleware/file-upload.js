const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

// If we have set the CLOUDINARY_URL environment variable on our project
// this requires no additional configuration
const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});

const upload = multer({ storage });

module.exports = upload;

// const handleFileUpload = (name) => {
//   return (req, res, next) => {
//     return upload.single(name).catch((error) => next(error));
//   };
// };

// const handleFileUpload = (name) => (req, res, next) =>
//   upload.single(name).catch((error) => next(error));

// module.exports = handleFileUpload;
