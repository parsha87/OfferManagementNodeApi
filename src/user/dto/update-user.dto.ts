import { PartialType } from '@nestjs/mapped-types';
import { AspnetusersDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(AspnetusersDto) {}
