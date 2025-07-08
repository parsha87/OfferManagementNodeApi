// inquiry.service.ts (NestJS version)

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { Inquiryattachmentsrecord } from 'src/entities/entities/Inquiryattachmentsrecord';
import { Visitsection } from 'src/entities/entities/Visitsection';
import { Technicaldetailsmappings } from 'src/entities/entities/Technicaldetailsmappings';
import { Inquiries } from 'src/entities/entities/Inquiries';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiries) private inquiryRepo: Repository<Inquiries>,
    @InjectRepository(Technicaldetailsmappings) private techDetailsRepo: Repository<Technicaldetailsmappings>,
    @InjectRepository(Inquiryattachmentsrecord) private attachmentRepo: Repository<Inquiryattachmentsrecord>,
    @InjectRepository(Visitsection) private visitRepo: Repository<Visitsection>,
  ) { }

  // async saveInquiry(dto: any) {
  //   const today = moment.utc().startOf('day');
  //   const countToday = await this.inquiryRepo.count({
  //     where: qb => {
  //       qb.where('DATE(createdOn) = :today', { today: today.format('YYYY-MM-DD') });
  //     },
  //   });

  //   const seq = (countToday + 1).toString().padStart(2, '0');
  //   const datePart = today.format('DD-MM-YY');
  //   // Create inquiry instance
  //   const inquiry = this.inquiryRepo.create({
  //     ...dto,
  //     enquiryNo: `INQ-${datePart}-${seq}`,
  //     rfqNo: `RFQ-${datePart}-${seq}`,
  //     createdOn: new Date(),
  //     updatedOn: new Date(),
  //   });

  //   // Map and associate technical details
  //   inquiry['technicaldetailsmappings'] = Array.isArray(dto.technicaldetailsmappings)
  //     ? dto.technicaldetailsmappings.map(d =>
  //       this.techDetailsRepo.create({
  //         ...d,
  //         inquiry, // associate to parent
  //       })
  //     )
  //     : [];

  //   // Map and associate visit sections
  //   inquiry['visitsections'] = Array.isArray(dto.visitsections)
  //     ? dto.visitsections.map(v =>
  //       this.visitRepo.create({
  //         ...v,
  //         inquiry, // associate to parent
  //       })
  //     )
  //     : [];
  //   const saved = await this.inquiryRepo.save(inquiry);

  //   saved['technicaldetailsmappings'].forEach(async element => {
  //     element.inquiryId  = saved['inquiryId'];
  //     await this.techDetailsRepo.save(element);
  //   });

  //   saved['visitsections'].forEach(async element => {
  //     element.inquiryId  = saved['inquiryId'];
  //     await this.visitRepo.save(element);
  //   });
  //   return saved['inquiryId'];
  // }

  // async updateInquiry(dto: any) {
  //   const inquiry = await this.inquiryRepo.findOne({
  //     where: { inquiryId: dto.inquiryId },
  //     relations: ['technicaldetailsmappings', 'visitsections'], // 💡 Use correct property names
  //   });

  //   if (!inquiry) {
  //     throw new NotFoundException('Inquiry not found');
  //   }

  //   // ⚠️ First remove old children to avoid duplicates
  //   await this.techDetailsRepo.remove(inquiry.technicaldetailsmappings || []);
  //   await this.visitRepo.remove(inquiry.visitsections || []);

  //   // 👇 Create new relations
  //   const newTechDetails = dto.techicalDetailsMapping?.map(d =>
  //     this.techDetailsRepo.create({ ...d, inquiry })
  //   ) || [];

  //   const newVisitSections = dto.visitSection?.map(v =>
  //     this.visitRepo.create({ ...v, inquiry })
  //   ) || [];

  //   // 👇 Update main inquiry fields
  //   Object.assign(inquiry, {
  //     ...dto,
  //     updatedOn: new Date(),
  //     technicaldetailsmappings: newTechDetails,
  //     visitsections: newVisitSections,
  //   });

  //   await this.inquiryRepo.save(inquiry);
  //   // await this.techDetailsRepo.save(newTechDetails);
  //   // await this.visitRepo.save(newVisitSections);
  // }

  async saveInquiry(dto: any) {
    const today = moment.utc().startOf('day');

    // Generate enquiryNo and rfqNo
    const countToday = await this.inquiryRepo.count({
      where: qb => {
        qb.where('DATE(createdOn) = :today', { today: today.format('YYYY-MM-DD') });
      },
    });

    const seq = (countToday + 1).toString().padStart(2, '0');
    const datePart = today.format('DD-MM-YY');

    // Create empty inquiry first
    const inquiry = this.inquiryRepo.create({
      customerType: dto.customerType,
      customerName: dto.customerName,
      customerId: dto.customerId,
      custPhoneNo: dto.custPhoneNo,
      custAddress: dto.custAddress,
      custEmail: dto.custEmail,
      region: dto.region,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      salutation: dto.salutation,
      cpfirstName: dto.cpfirstName,
      cplastName: dto.cplastName,
      enquiryDate: dto.enquiryDate,
      rfqDate: dto.rfqDate,
      stdPaymentTerms: dto.stdPaymentTerms,
      stdIncoTerms: dto.stdIncoTerms,
      listPrice: dto.listPrice,
      discount: dto.discount,
      netPriceWithoutGst: dto.netPriceWithoutGST,
      totalPackage: dto.totalPackage,
      status: dto.status,
      offerStatus: dto.offerStatus,
      customerRfqdate: dto.customerRfqdate,
      customerRfqno: dto.customerRfqno,
      offerDueDate: dto.offerDueDate,
      lostReason: dto.lostReason,
      createdBy: dto.createdBy,
      updatedBy: dto.updatedBy,
      createdOn: new Date(),
      updatedOn: new Date(),
      enquiryNo: `INQ-${datePart}-${seq}`,
      rfqNo: `RFQ-${datePart}-${seq}`,
      allocatedto: dto.allocatedto,
      selectedCurrency:dto.selectedCurrency

    });

    // Save the inquiry first to get the ID
    const savedInquiry = await this.inquiryRepo.save(inquiry);

    // Now create associated technical details
    const techDetails = dto.technicaldetailsmappings?.map((x) =>
      this.techDetailsRepo.create({
        motorType: x.motorType,
        kw: x.kW,
        hp: x.hP,
        phase: x.phase,
        pole: x.pole,
        frameSize: x.frameSize,
        dop: x.dop,
        insulationClass: x.insulationClass,
        efficiency: x.efficiency,
        voltage: x.voltage,
        frequency: x.frequency,
        quantity: x.quantity,
        mounting: x.mounting,
        safeAreaHazardousArea: x.safeAreaHazardousArea,
        brand: x.brand,
        nonStandardFeatures: x.nonStandardFeatures,
        ifHazardousArea: x.ifHazardousArea,
        tempClass: x.tempClass,
        gasGroup: x.gasGroup,
        zone: x.zone,
        hardadousDescription: x.hardadousDescription,
        duty: x.duty,
        startsPerHour: x.startsPerHour,
        cdf: x.cdf,
        ambientTemp: x.ambientTemp,
        tempRise: x.tempRise,
        accessories: Array.isArray(x.accessories) ? x.accessories.join(',') : null,
        brake: x.brake,
        encoderMounting: x.encoderMounting,
        encoderMountingIfYes: x.encoderMountingIfYes,
        application: x.application,
        segment: x.segment,
        narration: x.narration,
        amount: x.amount,
        deliveryTime: x.deliveryTime,
        startType: x.startType,
        techDetailsListPrice: x.techDetailsListPrice,
        techDetailsDiscount: x.techDetailsDiscount,
        inquiry: savedInquiry,
      })
    ) || [];

    const visitSections = dto.visitsections?.map((vs) =>
      this.visitRepo.create({
        visitDate: vs.visitDate,
        visitReason: vs.visitReason,
        visitKeyPoints: vs.visitKeyPoints,
        inquiry: savedInquiry,
      })
    ) || [];

    // Save child data
    if (techDetails.length > 0) await this.techDetailsRepo.save(techDetails);
    if (visitSections.length > 0) await this.visitRepo.save(visitSections);

    return savedInquiry['inquiryId'];
  }


  // async updateInquiry(dto: any): Promise<void> {
  //   const inquiry = await this.inquiryRepo.findOne({
  //     where: { inquiryId: dto.inquiryId },
  //     relations: ['technicaldetailsmappings', 'visitsections'],
  //   });

  //   if (!inquiry) {
  //     throw new NotFoundException('Inquiry not found');
  //   }

  //   // 🧹 Remove old child entries first
  //   await this.techDetailsRepo.remove(inquiry.technicaldetailsmappings || []);
  //   await this.visitRepo.remove(inquiry.visitsections || []);

  //   // 🎯 Map new technical details
  //   const techDetails = dto.technicaldetailsmappings?.map((x) =>
  //     this.techDetailsRepo.create({
  //       motorType: x.motorType,
  //       kw: x.kW,
  //       hp: x.hP,
  //       phase: x.phase,
  //       pole: x.pole,
  //       frameSize: x.frameSize,
  //       dop: x.dop,
  //       insulationClass: x.insulationClass,
  //       efficiency: x.efficiency,
  //       voltage: x.voltage,
  //       frequency: x.frequency,
  //       quantity: x.quantity,
  //       mounting: x.mounting,
  //       safeAreaHazardousArea: x.safeAreaHazardousArea,
  //       brand: x.brand,
  //       nonStandardFeatures: x.nonStandardFeatures,
  //       ifHazardousArea: x.ifHazardousArea,
  //       tempClass: x.tempClass,
  //       gasGroup: x.gasGroup,
  //       zone: x.zone,
  //       hardadousDescription: x.hardadousDescription,
  //       duty: x.duty,
  //       startsPerHour: x.startsPerHour,
  //       cdf: x.cdf,
  //       ambientTemp: x.ambientTemp,
  //       tempRise: x.tempRise,
  //       accessories: x.accessories?.join(',') || null,
  //       brake: x.brake,
  //       encoderMounting: x.encoderMounting,
  //       encoderMountingIfYes: x.encoderMountingIfYes,
  //       application: x.application,
  //       segment: x.segment,
  //       narration: x.narration,
  //       amount: x.amount,
  //       deliveryTime: x.deliveryTime,
  //       startType: x.startType,
  //       techDetailsListPrice: x.techDetailsListPrice,
  //       techDetailsDiscount: x.techDetailsDiscount,
  //       inquiry, // associate to parent
  //     }),
  //   ) || [];

  //   // 🎯 Map new visit sections
  //   const visitSections = dto.visitsections?.map((vs) =>
  //     this.visitRepo.create({
  //       visitSectionId: vs.visitSectionId,
  //       inquiryId: vs.inquiryId,
  //       visitDate: vs.visitDate,
  //       visitReason: vs.visitReason,
  //       visitKeyPoints: vs.visitKeyPoints,
  //       inquiry,
  //     }),
  //   ) || [];

  //   // 📝 Update Inquiry main fields
  //   Object.assign(inquiry, {
  //     customerType: dto.customerType,
  //     customerName: dto.customerName,
  //     customerId: dto.customerId,
  //     custPhoneNo: dto.custPhoneNo,
  //     custAddress: dto.custAddress,
  //     custEmail: dto.custEmail,
  //     region: dto.region,
  //     city: dto.city,
  //     state: dto.state,
  //     country: dto.country,
  //     salutation: dto.salutation,
  //     cpfirstName: dto.cpfirstName,
  //     cplastName: dto.cplastName,
  //     enquiryNo: dto.enquiryNo,
  //     enquiryDate: dto.enquiryDate,
  //     rfqNo: dto.rfqNo,
  //     rfqDate: dto.rfqDate,
  //     stdPaymentTerms: dto.stdPaymentTerms,
  //     stdIncoTerms: dto.stdIncoTerms,
  //     listPrice: dto.listPrice,
  //     discount: dto.discount,
  //     netPriceWithoutGst: dto.netPriceWithoutGST,
  //     totalPackage: dto.totalPackage,
  //     status: dto.status,
  //     offerStatus: dto.offerStatus,
  //     customerRfqDate: dto.customerRfqdate,
  //     customerRfqNo: dto.customerRfqno,
  //     offerDueDate: dto.offerDueDate,
  //     lostReason: dto.lostReason,
  //     updatedBy: dto.updatedBy,
  //     updatedOn: new Date(),
  //     technicaldetailsmappings: techDetails,
  //     CPFirstName: dto.CPFirstName,
  //   });

  //   // 💾 Save all
  //   await this.inquiryRepo.save(inquiry);

  //   techDetails.forEach(async element => {
  //     await this.techDetailsRepo.save(element);
  //   });
  //   visitSections.forEach(async element => {
  //     await this.visitRepo.save(element);
  //   });
  // }

  async updateInquiry(dto: any): Promise<void> {
    const inquiry = await this.inquiryRepo.findOne({
      where: { inquiryId: dto.inquiryId },
      relations: ['technicaldetailsmappings', 'visitsections'],
    });

    if (!inquiry) throw new NotFoundException('Inquiry not found');

    // 🧹 Soft-delete or prepare old child entities for update
    const updatedTechDetails = [];
    for (const x of dto.technicaldetailsmappings || []) {
      let techDetail = x.id
        ? await this.techDetailsRepo.findOne({ where: { id: x.id } })
        : this.techDetailsRepo.create();

      if (!techDetail) continue;

      Object.assign(techDetail, {
        motorType: x.motorType,
        kw: x.kw,
        kw2: x.kw2,
        hp: x.hp,
        hp2: x.hp2,
        phase: x.phase,
        pole: x.pole,
        frameSize: x.frameSize,
        dop: x.dop,
        insulationClass: x.insulationClass,
        efficiency: x.efficiency,
        voltage: x.voltage,
        frequency: x.frequency,
        quantity: x.quantity,
        mounting: x.mounting,
        safeAreaHazardousArea: x.safeAreaHazardousArea,
        brand: x.brand,
        nonStandardFeatures: x.nonStandardFeatures,
        ifHazardousArea: x.ifHazardousArea,
        tempClass: x.tempClass,
        gasGroup: x.gasGroup,
        zone: x.zone,
        hardadousDescription: x.hardadousDescription,
        duty: x.duty,
        startsPerHour: x.startsPerHour,
        cdf: x.cdf,
        ambientTemp: x.ambientTemp,
        tempRise: x.tempRise,
        accessories: x.accessories,
        brake: x.brake,
        encoderMounting: x.encoderMounting,
        encoderMountingIfYes: x.encoderMountingIfYes,
        application: x.application,
        segment: x.segment,
        narration: x.narration,
        amount: x.amount,
        deliveryTime: x.deliveryTime,
        startType: x.startType,
        techDetailsListPrice: x.techDetailsListPrice,
        techDetailsDiscount: x.techDetailsDiscount,
        inquiry,
      });

      updatedTechDetails.push(techDetail);
    }

    const updatedVisitSections = [];
    for (const vs of dto.visitsections || []) {
      let visit = vs.visitSectionId
        ? await this.visitRepo.findOne({ where: { visitSectionId: vs.visitSectionId } })
        : this.visitRepo.create();

      if (!visit) continue;

      Object.assign(visit, {
        visitSectionId: vs.visitSectionId,
        inquiryId: vs.inquiryId,
        visitDate: vs.visitDate,
        visitReason: vs.visitReason,
        visitKeyPoints: vs.visitKeyPoints,
        inquiry,
      });

      updatedVisitSections.push(visit);
    }

    // ✏️ Update inquiry main fields
    Object.assign(inquiry, {
      customerType: dto.customerType,
      customerName: dto.customerName,
      customerId: dto.customerId,
      custPhoneNo: dto.custPhoneNo,
      custAddress: dto.custAddress,
      custEmail: dto.custEmail,
      region: dto.region,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      salutation: dto.salutation,
      cpfirstName: dto.cpfirstName,
      cplastName: dto.cplastName,
      enquiryNo: dto.enquiryNo,
      enquiryDate: dto.enquiryDate,
      rfqNo: dto.rfqNo,
      rfqDate: dto.rfqDate,
      stdPaymentTerms: dto.stdPaymentTerms,
      stdIncoTerms: dto.stdIncoTerms,
      listPrice: dto.listPrice,
      discount: dto.discount,
      netPriceWithoutGst: dto.netPriceWithoutGST,
      totalPackage: dto.totalPackage,
      status: dto.status,
      offerStatus: dto.offerStatus,
      customerRfqdate: dto.customerRfqdate,
      customerRfqno: dto.customerRfqno ,
      offerDueDate: dto.offerDueDate,
      lostReason: dto.lostReason,
      updatedBy: dto.updatedBy,
      updatedOn: new Date(),
      CPFirstName: dto.CPFirstName,
      technicaldetailsmappings: updatedTechDetails,
      visitsections: updatedVisitSections,
      allocatedto: dto.allocatedto,
      selectedCurrency : dto.selectedCurrency,

    });

    // 💾 Save parent and cascaded children
    await this.inquiryRepo.save(inquiry);

    // 2. Save technical details
    for (const td of updatedTechDetails) {
      await this.techDetailsRepo.save(td);
    }

    // 3. Save visit sections
    for (const vs of updatedVisitSections) {
      await this.visitRepo.save(vs);
    }
  }




  async getAllInquiries() {
    const inquiries = await this.inquiryRepo.find({
      relations: ['technicaldetailsmappings', 'visitsections', 'inquiryattachmentsrecords'],
    });


    if (!inquiries || inquiries.length === 0) {
      return []; // or throw an exception if needed
    }

    return inquiries.map(i => ({ ...i }));
  }


  async getInquiryById(id: number) {
    const inquiry = await this.inquiryRepo.findOne({
      where: { inquiryId: id },
      relations: [
        'technicaldetailsmappings',
        'visitsections',
        'inquiryattachmentsrecords',
      ],
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');

    return {
      ...inquiry,
      uploadedFiles: inquiry.inquiryattachmentsrecords, // rename field in response if needed
    };
  }


  async deleteInquiry(id: number): Promise<void> {
    const inquiry = await this.inquiryRepo.findOne({ where: { inquiryId: id }, relations: ['technicalDetailsMappings', 'visitSections'] });
    if (!inquiry) throw new NotFoundException('Inquiry not found');

    await this.techDetailsRepo.remove(inquiry.technicaldetailsmappings);
    await this.visitRepo.remove(inquiry.visitsections);
    await this.inquiryRepo.remove(inquiry);
  }

  async saveAttachmentRecord(dto: any): Promise<void> {
    const attachment = this.attachmentRepo.create({ ...dto, uploadedOn: new Date() });
    await this.attachmentRepo.save(attachment);
  }

  async getAttachmentById(id: number) {
    const attachment = await this.attachmentRepo.findOne({ where: { attachmentId: id } });
    if (!attachment) throw new NotFoundException('Attachment not found');
    return attachment;
  }

  async deleteAttachmentById(id: number): Promise<boolean> {
    const attachment = await this.attachmentRepo.findOne({ where: { attachmentId: id } });
    if (!attachment) return false;

    // const fullPath = path.join(fileStoragePath, attachment.uniqueFileName);
    // if (fs.existsSync(fullPath)) {
    //   fs.unlinkSync(fullPath);
    // }

    await this.attachmentRepo.remove(attachment);
    return true;
  }
}
