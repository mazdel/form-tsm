import Cryptr from "cryptr";
import globalConfig from "@/configs/global";

const cryptr = new Cryptr(globalConfig.encryption.secret, {
  saltLength: globalConfig.encryption.saltLength,
  encoding: "base64",
  pbkdf2Iterations: 1,
});

/**
 * Symmetric encrypt string
 * @param {string} string string to be encrypted
 * @returns {string} encrypted string
 */
export const encrypt = (string) => {
  return btoa(cryptr.encrypt(string)).replace(/=/gim, "");
};

/**
 * Decrypt the encrypted string
 * @param {string} encrypted encrypted string
 * @returns {string} decrypted string
 */
export const decrypt = (encrypted) => {
  return cryptr.decrypt(atob(encrypted));
};
