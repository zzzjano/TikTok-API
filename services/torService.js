import { tor_s, torProxyAgent } from '../config/torConfig.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const useTor = (process.env.USE_TOR || 'true').toLowerCase() === 'true';

export const tor = useTor ? axios.create({
    httpsAgent: torProxyAgent,
    httpAgent: torProxyAgent
}) : axios.create();

export const createNewTorSession = async () => {
    // If Tor is disabled or control port is disabled, skip IP change
    if (!useTor || !tor_s || typeof tor_s.torNewSession !== 'function') {
        return;
    }

    await tor_s.torNewSession();
};
