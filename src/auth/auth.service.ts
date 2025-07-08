import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import {
  JWT_COOKIE_EXPIRES_IN_MS,
  SMTP_AUTH_USER,
  SMTP_AUTH_PASS,
  USE_SMTP,
  MAX_PASSWORD_RETRY,
  SENDER_EMAIL,
  SMTP_HOST,
  SMTP_PORT,
} from 'src/config/constants';
import * as speakeasy from 'speakeasy';
import * as nodeMailer from 'nodemailer';
import { correctPassword, decryptData, encryptData } from 'src/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcryptjs";
import { MstMenus } from './MstMenus';
import { Aspnetusers } from 'src/entities/entities/Aspnetusers';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
  private otpSecret = speakeasy.generateSecret({ length: 6 });
  private otpMap: Map<string, string> = new Map(); // Map to store email-otp pairs

  constructor(
    @InjectRepository(Aspnetusers)
    private readonly userRepository: Repository<Aspnetusers>,
    @InjectRepository(MstMenus)
    private readonly menuRepository: Repository<MstMenus>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }




  async login(loginDto: any) {
    const UserName = loginDto.email
    const user = await this.userService.findOne(UserName);


    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive.');
    }

    const userRole = await this.userService.getUserRole(user.userId); // Assume this returns string like 'Admin'

    const payload = {
      sub: user.userId,
      username: user.userName,
      role: userRole,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      expiration: new Date(Date.now() + 3 * 60 * 60 * 1000),
      name: `${user.firstName} ${user.lastName}`,
      role: userRole,
    };
  }

  async validateUser(name: string, pass: string): Promise<any> {
    const email = name;
    const user = await this.userService.findOne({ email });

    if (user == undefined)
      throw new BadRequestException(
        `User Not Found, Please Contact Administrator!!!`,
      );
    // if (user && (await compare(pass, user.password))) { // TODO
    // if (user && user.password === pass) {
    // if (user.isActive == false)
    //   throw new BadRequestException(`User InActive, Pls contact Administrator`);
    // if (user.isLocked)
    //   throw new BadRequestException(
    //     `Your Account is Lock,Please Contact Administrator!!!`,
    //   );

    // if (user && (await correctPassword(pass, user.password))) {
    // TODO
    // if (user && user.password === pass){
    // const { password, ...rest } = user;
    // user.otpRetryCount = 0;
    // user.isLocked = false;




    // await this.userRepository.save(user);





    // if (!user.email)
    //   throw new BadRequestException(
    //     `Please configure Email in User to sent OTP, Please Contact Administrator!!!`,
    //   );
    // this.sendOTP(user);
    // return rest;
    // } else {
    //   user.otpRetryCount = Number(user.otpRetryCount ?? 0) + 1;
    //   if (user.otpRetryCount >= this.config.get<number>(MAX_PASSWORD_RETRY)) {
    //     // user.isLocked = true;
    //     await this.userRepository.save(user);
    //     throw new BadRequestException(
    //       `Your Account is Lock,Please Contact Administrator!!!`,
    //     );
    // }
    //   await this.userRepository.save(user);
    //   throw new BadRequestException(
    //     `Please Enter Correct Password \n ${this.config.get<number>(
    //       MAX_PASSWORD_RETRY,
    //     ) - user.otpRetryCount} Attempts Remaining`,
    //   );
    // }
  }

  async verifyOTP(name) {
    try {
      const userLoginId = name.name
      const user = await this.userService.findOne({ userLoginId });
      if (!user) {
        throw new BadRequestException(`${'User not found.'}`);
      }

      // if (user.isLocked == 1) {
      //   return {
      //     message: 'Account locked. Please Contact Admin.',
      //     isSuccess: false,
      //     status: 'error',

      //   }
      // }
      // if (user.loginFailAttempts > 2) {
      //   return {
      //     message: 'Account locked. Please Contact Admin.',
      //     isSuccess: false,
      //     status: 'error',

      //   }
      // }
      // if (user.statusId != 3) {
      //   return {
      //     message: 'User Inactive. Please Contact Admin.',
      //     isSuccess: false,
      //     status: 'error'
      //   }
      // }




      const b = user.passwordHash.trimEnd();
      const isMatch = bcrypt.compareSync(name.password, b);
      if (isMatch) {
        console.log('Password is correct!');
        const { userId, ...rest } = user;
        const payload = { sub: userId };
        const time = Number(this.config.get<number>(JWT_COOKIE_EXPIRES_IN_MS));
        const expires = new Date(Date.now() + time);
        const accessToken = this.jwtService.sign(payload)
        await this.userRepository.save(user);
        delete user.passwordHash;
        // const menus = await this.menuRepository.find({
        //   where: {
        //     menuRoleId: user.userTypeId,
        //     isActive: 1
        //   }
        // });





        //   var a = menus;
        return {
          accessToken,
          expires: expires.getTime(),
          message: 'Login Successfully',
          isSuccess: true,
          status: 'success',
          data: { user },
        }


      }





      // else {
      //   user.loginFailAttempts = (user.loginFailAttempts || 0) + 1;
      //   if (user.loginFailAttempts >= 3) {
      //     user.isLocked = 1;
      //     await this.userRepository.save(user);
      //   }
      //   else {
      //     await this.userRepository.save(user);
      //   }

      //   return {
      //     message: 'Please try again',
      //     isSuccess: false,
      //     status: 'error'
      //   }
      // }
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  // async sendOTP(user: any): Promise<void> {
  //   try {
  //     const useEmail = this.config.get<string>(USE_SMTP);
  //     if (useEmail.toLowerCase() === 'false') {
  //       true;
  //     } else {
  //       const otp = speakeasy.totp({
  //         secret: this.otpSecret.base32,
  //         encoding: 'base32',
  //       });
  //       const transporter = nodeMailer.createTransport({
  //         host: this.config.get<string>(SMTP_HOST),
  //         port: this.config.get<string>(SMTP_PORT),
  //         auth: {
  //           user: this.config.get<string>(SMTP_AUTH_USER),
  //           pass: this.config.get<string>(SMTP_AUTH_PASS),
  //         },
  //       });

  //       const mailOptions = {
  //         from: this.config.get<string>(SENDER_EMAIL),
  //         to: user.email,
  //         subject: 'Your PolicyAdmin app login OTP',
  //         text: `Dear Customer,
  //               ${otp} is the One Time Password (OTP) for your login to the PolicyAdmin App.`,
  //       };

  //       // this.otpMap.set(email, otp);
  //       user.otp = otp.toString();
  //       await this.userRepository.save(user);
  //       await transporter.sendMail(mailOptions);
  //     }
  //   } catch (error) {
  //     throw new BadRequestException(`${error.message}`);
  //   }
  // }

  // async signup(registerUserDto: CreateDowUserDto) {
  //   try {
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // login(user: DowUsers) {
  //   try {
  //     return {
  //       message: 'OTP Sent On Register Email',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(`${error.message}`);
  //   }
  // }

  // async logout(id: number) {
  //   try {
  //     let userobj = await this.userRepository.findOne(id);
  //     //  userobj.sessionId = null;
  //     return await this.userRepository.save(userobj);

  //   } catch (error) {
  //     throw new BadRequestException(`${error.message}`);
  //   }
  // }
}
