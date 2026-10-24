import { v2 as cloudinary } from 'cloudinary';

const hasCloudinaryCredentials = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );

const configureCloudinary = () => {
  if (!hasCloudinaryCredentials()) {
    throw new Error(
      'Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env',
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export default cloudinary;
export { configureCloudinary, hasCloudinaryCredentials };
