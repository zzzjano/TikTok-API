/* eslint-disable */
import crypto from 'crypto';

/* ── CONSTANTS ────────────────────────────────────────── */
const STANDARD_B64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const CUSTOM_B64_ALPHABET =
  'Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe';

/* standard → custom Base-64 translation map */
const ENC_TRANS = (() => {
  const map = new Map();
  for (let i = 0; i < STANDARD_B64_ALPHABET.length; i++) {
    map.set(STANDARD_B64_ALPHABET[i], CUSTOM_B64_ALPHABET[i]);
  }
  return map;
})();

/* ── HELPERS ───────────────────────────────────────────── */
function customB64Encode(buf) {
  const b64 = buf.toString('base64');
  let out = '';
  for (const ch of b64) out += ENC_TRANS.get(ch) ?? ch; // '=' / newlines pass through
  return out;
}
const stdMd5Enc = data => crypto.createHash('md5').update(data).digest();

/* pure-JS RC4 (KSA + PRGA) */
function rc4Enc(keyBuf, plaintextBuf) {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) s[i] = i;

  let j = 0;
  const keyLen = keyBuf.length;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + keyBuf[i % keyLen]) & 0xff;
    [s[i], s[j]] = [s[j], s[i]];
  }

  const out = Buffer.allocUnsafe(plaintextBuf.length);
  let i = 0;
  j = 0;
  for (let n = 0; n < plaintextBuf.length; n++) {
    i = (i + 1) & 0xff;
    j = (j + s[i]) & 0xff;
    [s[i], s[j]] = [s[j], s[i]];
    const k = s[(s[i] + s[j]) & 0xff];
    out[n] = plaintextBuf[n] ^ k;
  }
  return out;
}
const stdRc4Enc = rc4Enc;

const xorKey = buf => buf.reduce((acc, b) => acc ^ b, 0);

/* ── MAIN ENTRY POINT ──────────────────────────────────── */
/**
 * Replicates encrypt(params, postData, userAgent, timestamp) from Python.
 *
 * @param {string} params
 * @param {string} postData
 * @param {string} userAgent
 * @param {number} timestamp  Unix-epoch seconds (unsigned 32-bit)
 * @returns {string} custom-Base-64 signature
 */
function encrypt(params, postData, userAgent, timestamp) {
  const uaKey   = Buffer.from([0x00, 0x01, 0x0e]);
  const listKey = Buffer.from([0xff]);
  const fixedVal = 0x4a41279f; // 3845494467

  /* double-MD5s */
  const md5Params = stdMd5Enc(stdMd5Enc(Buffer.from(params, 'utf8')));
  const md5Post   = stdMd5Enc(stdMd5Enc(Buffer.from(postData, 'utf8')));

  /* UA → RC4 → Base64 → MD5 */
  const uaRc4 = stdRc4Enc(uaKey, Buffer.from(userAgent, 'utf8'));
  const uaB64 = Buffer.from(uaRc4).toString('base64');
  const md5Ua = stdMd5Enc(Buffer.from(uaB64, 'ascii'));

  /* build buffer exactly like Python */
  const parts = [
    Buffer.from([0x40]), // literal 64
    uaKey,
    md5Params.subarray(14, 16),
    md5Post.subarray(14, 16),
    md5Ua.subarray(14, 16),
    (() => { const b = Buffer.allocUnsafe(4); b.writeUInt32BE(timestamp >>> 0); return b; })(),
    (() => { const b = Buffer.allocUnsafe(4); b.writeUInt32BE(fixedVal);       return b; })(),
  ];
  let buffer = Buffer.concat(parts);            // 18 bytes (so far)

  /* ✅ FIX: append checksum safely */
  const checksum = xorKey(buffer);
  buffer = Buffer.concat([buffer, Buffer.from([checksum])]); // now 19 bytes

  /* final wrapper */
  const enc = Buffer.concat([
    Buffer.from([0x02]),
    listKey,
    stdRc4Enc(listKey, buffer),
  ]);

  return customB64Encode(enc);
}

/* ── EXPORTS ───────────────────────────────────────────── */
export { encrypt };
export default encrypt;
