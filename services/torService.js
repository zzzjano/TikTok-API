/**
 * Tor Service
 * 
 * Manages Tor network integration to bypass IP blocking.
 * Handles Tor proxy configuration and IP rotation.
 * 
 * @module services/torService
 */

import { tor_s, torProxyAgent } from '../config/torConfig.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const useTor = (process.env.USE_TOR || 'false').toLowerCase() === 'true';

/**
 * Axios instance with optional Tor proxy
 * 
 * If USE_TOR is enabled, requests go through Tor to bypass IP blocks.
 * Otherwise, uses standard axios without proxy.
 * 
 * @type {axios.AxiosInstance}
 */
export const tor = useTor ? axios.create({
    httpsAgent: torProxyAgent,
    httpAgent: torProxyAgent
}) : axios.create();

/**
 * Create a new Tor session (rotate IP)
 * 
 * Requests a new Tor circuit to change the exit IP address.
 * Only works if Tor control port is enabled in configuration.
 * 
 * @returns {Promise<void>}
 */
export const createNewTorSession = async () => {
    // If Tor is disabled or control port is disabled, skip IP change
    if (!useTor || !tor_s || typeof tor_s.torNewSession !== 'function') {
        return;
    }

    try {
        await tor_s.torNewSession();
        console.log('[Tor] New session created - IP rotated');
    } catch (error) {
        console.error('[Tor] Failed to create new session:', error.message);
    }
};
