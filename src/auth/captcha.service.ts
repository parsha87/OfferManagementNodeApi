import { BadRequestException, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  async generateCaptcha(): Promise<{ data: string; text: string }> {
    try {
      const captcha = await svgCaptcha.create();
      return { data: captcha.data, text: captcha.text };
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  validateCaptcha(userCaptcha: string, actualCaptcha: string): boolean {
    try {
      return userCaptcha === actualCaptcha;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }
}
