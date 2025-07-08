import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from "bcryptjs";
import { AspnetusersDto } from 'src/user/dto/create-user.dto';


export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user && user[data] : user;
  },
);

export function createDefaultValue(user:AspnetusersDto) {
  return {
    createdBy: user.id,
    createdOn:  new Date()
  }
}
export function updateDefaultValue(user:AspnetusersDto) {
  return {
    modifiedBy: user.id,
    modifiedOn:  new Date()
  }
}

export function encryptData(data: String) {
  return CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_KEY).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function sameEncryptData(data: String) {
    // var message = dto.gstNo;

    // var key = "6Le0DgMTAAAAANokdEEial"; //length=22
    // var iv  = "mHGFxENnZLbienLyANoi.e"; //length=22
    
    const key = CryptoJS.enc.Base64.parse(process.env.SAME_ENCRYPTION_KEY_VALUE);
    //key is now e8b7b40e031300000000da247441226a, length=32
    const iv = CryptoJS.enc.Base64.parse(process.env.IV);
    //iv is now 987185c4436764b6e27a72f2fffffffd, length=32
    
    return CryptoJS.AES.encrypt(data, key, { iv: iv }).toString();
}

export function sameDecryptData(encryptedData: string): string {
  const key = CryptoJS.enc.Base64.parse(process.env.SAME_ENCRYPTION_KEY_VALUE);
  //key is now e8b7b40e031300000000da247441226a, length=32
  const iv = CryptoJS.enc.Base64.parse(process.env.IV);
  
  return CryptoJS.AES.decrypt(encryptedData, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
}

export async function correctPassword(enteredPassword, userPassword) {
  const t = await bcrypt.compare(enteredPassword, userPassword);
  return t

}