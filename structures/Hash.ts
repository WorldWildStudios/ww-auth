import crypto from 'crypto';
import config from '../config.js';

const secret = config.hashSecret;

export default function hash(value: string) {
    const hashM = crypto.createHmac('sha256', secret);
    return hashM.update(value).digest('hex');
};