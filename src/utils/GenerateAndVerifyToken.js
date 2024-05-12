import jwt from 'jsonwebtoken'
import { TOKEN_SIGNATURE } from '../../config/config.js';

export const tokenGeneration = ({ payload = {}, signature = TOKEN_SIGNATURE, expiresIn = '1hour' } = {}) => {
    const token = jwt.sign(payload, signature, { expiresIn });
    return token
}

export const tokenDecode = ({ payload = '', signature = TOKEN_SIGNATURE } = {}) => {
    const decoded = jwt.verify(payload, signature);
    return decoded
}

