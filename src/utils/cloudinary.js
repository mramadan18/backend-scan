import { api_key,api_secret,cloud_name } from '../../config/config.js';

import cloudinary from 'cloudinary';

cloudinary.v2.config({
    api_key:api_key,
    api_secret:api_secret,
    cloud_name:cloud_name,
    secure: true
})

export default cloudinary.v2;