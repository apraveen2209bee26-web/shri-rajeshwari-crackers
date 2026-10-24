import streamifier from 'streamifier';

import cloudinary, { configureCloudinary, hasCloudinaryCredentials } from '../config/cloudinary.js';

const uploadBufferToCloudinary = (buffer, folder = 'crackers/products') =>
  new Promise((resolve, reject) => {
    if (!hasCloudinaryCredentials()) {
      reject(
        new Error(
          'Cloudinary credentials are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env',
        ),
      );
      return;
    }

    configureCloudinary();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const removeCloudinaryAsset = async (publicId) => {
  if (!publicId) {
    return;
  }

  configureCloudinary();
  await cloudinary.uploader.destroy(publicId);
};

export { uploadBufferToCloudinary, removeCloudinaryAsset };
