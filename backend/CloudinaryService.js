const {v2: cloudinary} = require("cloudinary");

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

module.exports = {UploadToCloudinary};