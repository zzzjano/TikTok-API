/**
 * Tor Proxy Configuration
 * 
 * Configures Tor proxy agent and control port to bypass IP blocking.
 * Settings are loaded from environment variables.
 * 
 * @module config/torConfig
 */

import { SocksProxyAgent } from 'socks-proxy-agent';
import tor_axios from 'tor-axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SOCKS proxy agent for Tor connections
 * @type {SocksProxyAgent}
 */
export const torProxyAgent = new SocksProxyAgent(
    `socks://${process.env.TOR_HOST || '127.0.0.1'}:${process.env.TOR_PORT || '9050'}`
);

const enableControlPort = (process.env.TOR_ENABLE_CONTROL_PORT || 'false').toLowerCase() === 'true';

/**
 * Tor control port instance for session rotation
 * Only initialized if TOR_ENABLE_CONTROL_PORT is true
 * @type {Object|null}
 */
export const tor_s = enableControlPort
    ? tor_axios.torSetup({
        ip: process.env.TOR_HOST || '127.0.0.1',
        port: process.env.TOR_PORT || '9050',
        controlPort: process.env.TOR_CONTROL_PORT || '9051',
        controlPassword: process.env.TOR_CONTROL_PASSWORD || ''
    })
    : null;

// Log Tor configuration status
if (enableControlPort && tor_s) {
    console.log('[Tor] Control port enabled - IP rotation available');
} else {
    console.log('[Tor] Control port disabled - using static Tor circuit');
}
