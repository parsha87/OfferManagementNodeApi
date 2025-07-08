import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JWT_SECRET } from 'src/config/constants';

@Injectable()
export class  JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(JWT_SECRET),
      passReqToCallback: true
    });
  }

  async validate(payload: any) {
    const rawToken = payload.headers['authorization'].split(' ')[1];
    const userObj = await this.userService.getUserByToken(rawToken);
    if(!userObj)
      throw new NotFoundException('Multiple login detected : For security reasons, you cannot have multiple active sessions at the same time. Please log out!!');

    return userObj;
  }
}
