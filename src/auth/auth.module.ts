import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JWT_COOKIE_EXPIRES, JWT_SECRET } from '../config/constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy, JwtStrategy } from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { MstMenus } from './MstMenus';
import { Aspnetusers } from 'src/entities/entities/Aspnetusers';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
     Aspnetusers, MstMenus
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(JWT_SECRET),
        signOptions: { expiresIn: config.get<string>(JWT_COOKIE_EXPIRES) },
      }),
    }),
    UserModule,
  ],

  controllers: [AuthController, CaptchaController],
  providers: [AuthService, CaptchaService, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
