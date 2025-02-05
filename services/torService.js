import { tor_s } from '../config/torConfig.js';
import { SocksProxyAgent } from "socks-proxy-agent";
import axios from 'axios';
const torProxyAgent = new SocksProxyAgent("socks://127.0.0.1:9050");

export const tor = axios.create({
    httpsAgent: torProxyAgent,
    httpAgent: torProxyAgent
});

export const createNewTorSession = async () => {
    await tor_s.torNewSession();
};
