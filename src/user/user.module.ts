import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aspnetusers } from 'src/entities/entities/Aspnetusers';
import { Aspnetroles } from 'src/entities/entities/Aspnetroles';
import { Aspnetuserroles } from 'src/entities/entities/Aspnetuserroles';

@Module({
  imports: [TypeOrmModule.forFeature([Aspnetusers,Aspnetroles,Aspnetuserroles])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
