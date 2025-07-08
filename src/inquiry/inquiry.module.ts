import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visitsection } from 'src/entities/entities/Visitsection';
import { Inquiryattachmentsrecord } from 'src/entities/entities/Inquiryattachmentsrecord';
import { Technicaldetailsmappings } from 'src/entities/entities/Technicaldetailsmappings';
import { Inquiries } from 'src/entities/entities/Inquiries';

@Module({
    imports: [TypeOrmModule.forFeature([Inquiries,Technicaldetailsmappings,Inquiryattachmentsrecord,Visitsection])],
  
  controllers: [InquiryController],
  providers: [InquiryService]
})
export class InquiryModule {}
