import { IsBoolean, IsDate, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class AspnetusersDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @Length(0, 256)
  userName?: string;

  @IsOptional()
  @IsString()
  normalizedUserName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  normalizedEmail?: string;

  @IsBoolean()
  emailConfirmed: boolean;

  @IsOptional()
  @IsString()
  passwordHash?: string;

  @IsOptional()
  @IsString()
  securityStamp?: string;

  @IsOptional()
  @IsString()
  concurrencyStamp?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsBoolean()
  phoneNumberConfirmed: boolean;

  @IsBoolean()
  twoFactorEnabled: boolean;

  @IsOptional()
  @IsDate()
  lockoutEnd?: Date;

  @IsBoolean()
  lockoutEnabled: boolean;

  accessFailedCount: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
