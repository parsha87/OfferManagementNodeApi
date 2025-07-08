import { Module } from '@nestjs/common';
import { ListofvaluesService } from './listofvalues.service';
import { ListofvaluesController } from './listofvalues.controller';
import { Listofvalues } from 'src/entities/entities/Listofvalues';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Listofvalues])],
  controllers: [ListofvaluesController],
  providers: [ListofvaluesService]
})
export class ListofvaluesModule {}
