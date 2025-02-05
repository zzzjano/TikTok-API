import { SocksProxyAgent } from 'socks-proxy-agent';
import tor_axios from 'tor-axios';
import dotenv from 'dotenv';

dotenv.config();

export const torProxyAgent = new SocksProxyAgent(`socks://${process.env.TOR_HOST}:${process.env.TOR_PORT}`);

export const tor_s = tor_axios.torSetup({
    ip: process.env.TOR_HOST,
    port: process.env.TOR_PORT,
    controlPort: process.env.TOR_CONTROL_PORT,
    controlPassword: process.env.TOR_CONTROL_PASSWORD
});
