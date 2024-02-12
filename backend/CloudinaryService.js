const {v2: cloudinary} = require("cloudinary");
const util = require('util');
const destroyAsync = util.promisify(cloudinary.uploader.destroy);

// METHOD FOR UPLOAD IMAGE TO CLOUD
async function UploadToCloudinary(fileBuffer) {
    try {
        const {imageUrl, publicId} = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type: 'auto'}, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    // console.log('File uploaded successfully to Cloudinary:', result);
                    const imageUrl = result.secure_url;
                    const publicId = result.public_id;
                    resolve({imageUrl, publicId});
                }
            }).end(fileBuffer);
        });
        return {imageUrl, publicId};
    } catch (error) {
        console.error('ERROR UPLOADING FILE TO CLOUDINARY:', error);
    }
}

async function DeleteImage(publicId) {
    try {
        if (publicId) {
            // Delete existing image from Cloudinary
            const result = await destroyAsync(publicId);
            console.log('IMAGE DELETED SUCCESSFULLY:', result);
        }
    } catch (error) {
        console.error('ERROR DELETING IMAGE:', error);
    }
}

module.exports = {UploadToCloudinary, DeleteImage};