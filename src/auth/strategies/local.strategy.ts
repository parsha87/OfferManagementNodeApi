import { Strategy } from 'passport-local';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { decryptData } from 'src/common/decorators/user.decorator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'name', // 'username'
      passwordField: 'password', // 'passport'
    });
  }

  async validate(name: string, password: string) {
    const decryptedPassword = decryptData(password);
    const user = await this.authService.validateUser(name, decryptedPassword);
    if (!user)
      throw new UnauthorizedException('Login user or password does not match.');
    return user;
  }
}
