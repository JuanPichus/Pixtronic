import crypto from 'crypto';

export function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicExponent: 0x10001,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  return { publicKey, privateKey };
}

export function encryptWithRSA(publicKeyPem, plaintext) {
  const buffer = Buffer.from(plaintext, 'utf8');
  const encrypted = crypto.publicEncrypt(
    { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    buffer
  );
  return encrypted.toString('base64');
}

export function decryptWithRSA(privateKeyPem, ciphertextBase64) {
  const buffer = Buffer.from(ciphertextBase64, 'base64');
  const decrypted = crypto.privateDecrypt(
    { key: privateKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    buffer
  );
  return decrypted.toString('utf8');
}

export function generateAESKeyBase64() {
  return crypto.randomBytes(32).toString('base64'); // 256-bit key
}

export function encryptWithAES(keyBase64, plaintext) {
  const key = Buffer.from(keyBase64, 'base64');
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, encrypted, tag]).toString('base64'); // iv || ciphertext || tag
}

export function decryptWithAES(keyBase64, dataBase64) {
  const buf = Buffer.from(dataBase64, 'base64');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(buf.length - 16);
  const encrypted = buf.slice(12, buf.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(keyBase64, 'base64'), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}