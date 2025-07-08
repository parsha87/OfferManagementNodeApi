import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ApiTags } from '@nestjs/swagger';
import { CaptchaDto } from './dtos/login.dto';
import { IResponseDto } from 'src/interfaces';

@ApiTags('Captcha routes')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  // @Get()
  // async generate(@Req() req, @Res() res) {
  //   const data = await this.captchaService.generateCaptcha();
  //   const respDto: IResponseDto = {
  //     isSuccess: true,
  //     status: 'success',
  //     message: 'Captcha Created',
  //     data: data,
  //   };
  //   res.status(200).json(respDto);
  // }

  // @Post()
  // async validate(@Req() req, @Res() res, @Body() dto: CaptchaDto) {
  //   const data = this.captchaService.validateCaptcha(
  //     dto.userCaptcha,
  //     dto.actualCaptcha,
  //   );
  //   const respDto: IResponseDto = {
  //     isSuccess: true,
  //     status: 'success',
  //     message: 'Verified Captcha',
  //     data: data,
  //   };
  //   res.status(200).json(respDto);
  // }
}
