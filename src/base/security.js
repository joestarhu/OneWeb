// 先要安装引入
// npm install --save crypto-js
// npm install --save js-base64
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import { DMSETTINGS } from "./dm"


function encryptString(value) {
    // 加密字符串
    let sk = "0f35268f93594811b1fb81e772a9e256";
    let key = CryptoJS.enc.Utf8.parse(sk);
    let srcs = CryptoJS.enc.Utf8.parse(value);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}


function getLoginInfo(token = null) {
    let jwt = token || localStorage.getItem(DMSETTINGS.jwt)
    if (jwt == null) {
        return jwt
    }
    let payload = JSON.parse(Base64.decode(jwt.split('.')[1]))
    return payload
}

export { encryptString, getLoginInfo }