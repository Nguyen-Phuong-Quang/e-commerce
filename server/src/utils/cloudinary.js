const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

exports.destroyFileCloudinary = async (PublicId) => {
    await cloudinary.uploader.destroy(PublicId);
}

exports.uploadFileCloudinary = (buffer, folderName) => {
    return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: `${config.cloudinary.project}/${folderName}`,
                format: 'png',
                eager: {
                    crop: 'fit'
                }
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
    });
};
