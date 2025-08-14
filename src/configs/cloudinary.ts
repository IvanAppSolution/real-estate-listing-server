// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2

const connectCloudinary = async (): Promise<void> => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
}

export default connectCloudinary
