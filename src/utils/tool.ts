import CryptoJS from "crypto-js";
import FingerprintJS from '@fingerprintjs/fingerprintjs'
export const aes = {
    encode(data: string, secretKey: string) {
      const result = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(secretKey),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      return result.toString();
    },
    decode(cipher:string, secretKey:string) {
      const result = CryptoJS.AES.decrypt(
        cipher,
        CryptoJS.enc.Utf8.parse(secretKey),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      return CryptoJS.enc.Utf8.stringify(result);
    },
}

export const createFPToken = async () => {
    // Initialize an agent at application startup.
    const fb_token = sessionStorage.getItem('fb_token')
    if(!fb_token){
      try {
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        console.log(result.visitorId)
        sessionStorage.setItem('fb_token', result.visitorId)
        return result.visitorId
      } catch (error) {
        console.error(error)
        return ''
      }
    }
    return fb_token
  }
