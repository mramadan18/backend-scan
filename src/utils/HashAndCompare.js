import bcrypt from 'bcryptjs'
import { SALT_ROUNDS } from '../../config/config.js'

export const hash = ({ plaintext, salt = SALT_ROUNDS } = {}) => {
    const hashResult = bcrypt.hashSync(plaintext, parseInt(salt))
    return hashResult
}


export const compare = ({ plaintext, hashValue } = {}) => {
    const match = bcrypt.compareSync(plaintext, hashValue)
    return match
}