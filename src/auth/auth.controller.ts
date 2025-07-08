import { Controller, Post, Get, UseGuards, Body, Req, Res, Ip, Query, HttpCode, UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { User, Auth } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterUserDto } from './dtos/login.dto';
import { IResponseDto } from 'src/interfaces';

@ApiTags('Auth routes')
@Controller('api/Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Post('signup')
  // async signup(@Req() req, @Res() res) {
  //   console.log(req.body)
  //   const data = await this.authService.signup(req.body);
  //   return {
  //     message: 'Login Successful',
  //     data,
  //   };
  // }

  @Post('loginTest')
  async loginTest(@Req() req, @Res() res, @Body() user: any) {
    res.status(200).json(user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      console.error('Login error:', error.message);
      throw new UnauthorizedException('Invalid credentials or user not found.');
    }
  }




  // @UseGuards(LocalAuthGuard)
  @Post('login1')
  async login1(@Req() req, @Res() res, @Body() user: LoginDto) {

    // @Get('login')
    // async login(
    //   @Query('username') name: string,
    //   @Query('password') password: string,
    //   @Res() res,
    // ) {
    //   const user = { name, password };
    const data = await this.authService.verifyOTP(user);
    const respDto: IResponseDto = {
      isSuccess: data.isSuccess,
      status: data.status,
      // message: 'Login Successfully',
      message: data.message,
      data: data,
    };
    res.status(200).json(respDto);
  }

  // @Auth()
  // @Post('send-otp')
  // async sendOTP(@Req() req, @Res() res) { 
  //   // console.log(req.user);   
  //   // const data = await this.authService.sendOTP("hasanfateh50@gmail.com");
  //   const data = await this.authService.sendOTP(req.user);
  //   const respDto: IResponseDto = {
  //     isSuccess: true,
  //     status: 'success',
  //     message: 'OTP send Successfully',
  //     data: data,
  //   };
  //   res.status(200).json(respDto);
  // }

  // @Auth()
  // @Post('verify-otp')
  // async verifyOTP(@Ip() ip, @Req() req, @Res() res,@Body() body ) {
  //   const data = await this.authService.verifyOTP(body.userName,body.otp, ip);
  //   const respDto: IResponseDto = {
  //     isSuccess: data.isSuccess,
  //     status: data.status,
  //     message: data.message, 
  //     data: data,
  //   };
  //   delete respDto.data.status;
  //   delete respDto.data.message;
  //   delete respDto.data.isSuccess;
  //   res.status(200).json(respDto);
  // }

  // @Auth()
  // @Get('profile')
  // profile(@User() user: UserEntity) {
  //   return {
  //     message: 'Petición correcta',
  //     user,
  //   };
  // }

  // @Auth()
  // @Get('refresh')
  // refreshToken(@Req() req, @Res() res,@User() user: UserEntity) {
  //   const data = this.authService.login(user);
  //   const respDto: IResponseDto = {
  //     isSuccess: true,
  //     status: 'success',
  //     message: 'Refresh Token Successfully',
  //     data: data,
  //   };
  //   res.status(200).json(respDto);
  //   // return {
  //   //   message: 'Refresh Token',
  //   //   data,
  //   // };
  // }

  // @Post('logout')
  // async logout(@Req() req, @Res() res, @Body('userId')id : number) {    
  //   const data = await this.authService.logout(id);
  //   const respDto: IResponseDto = {
  //     isSuccess: true,
  //     status: 'success',
  //     data: data,
  //   };
  //   res.status(200).json(respDto);
  // }
}
