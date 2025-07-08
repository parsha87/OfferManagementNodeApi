import { IsOptional, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  email: string;
}

export class RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export class CaptchaDto {
  @IsString()
  @MaxLength(100)
  userCaptcha: string;

  @IsString()
  @MaxLength(100)
  actualCaptcha: string;
}
