import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Inquiryattachmentsrecord } from "./Inquiryattachmentsrecord";
import { Technicaldetailsmappings } from "./Technicaldetailsmappings";
import { Visitsection } from "./Visitsection";

@Entity("inquiries", { schema: "dbo" })
export class Inquiries {
  @PrimaryGeneratedColumn({ type: "int", name: "InquiryId" })
  inquiryId: number;

  @Column("varchar", { name: "CustomerType", nullable: true, length: 100 })
  customerType: string | null;

  @Column("varchar", { name: "CustomerName", nullable: true, length: 200 })
  customerName: string | null;

  @Column("varchar", { name: "CustPhoneNo", nullable: true, length: 100 })
  custPhoneNo: string | null;

  @Column("varchar", { name: "CustAddress", nullable: true, length: 100 })
  custAddress: string | null;

  @Column("int", { name: "CustomerId", nullable: true })
  customerId: number | null;

  @Column("varchar", { name: "CustEmail", nullable: true, length: 100 })
  custEmail: string | null;

  @Column("varchar", { name: "Region", nullable: true, length: 100 })
  region: string | null;

  @Column("varchar", { name: "City", nullable: true, length: 100 })
  city: string | null;

  @Column("varchar", { name: "State", nullable: true, length: 100 })
  state: string | null;

  @Column("varchar", { name: "Country", nullable: true, length: 100 })
  country: string | null;

  @Column("varchar", { name: "Salutation", nullable: true, length: 100 })
  salutation: string | null;

  @Column("varchar", { name: "cpfirstName", nullable: true, length: 100 })
  cpfirstName: string | null;

  @Column("varchar", { name: "cplastName", nullable: true, length: 100 })
  cplastName: string | null;

  @Column("varchar", { name: "EnquiryNo", nullable: true, length: 100 })
  enquiryNo: string | null;

  @Column("datetime", { name: "EnquiryDate", nullable: true })
  enquiryDate: Date | null;

  @Column("varchar", { name: "RfqNo", nullable: true, length: 100 })
  rfqNo: string | null;

  @Column("datetime", { name: "RfqDate", nullable: true })
  rfqDate: Date | null;

  @Column("varchar", { name: "StdPaymentTerms", nullable: true, length: 200 })
  stdPaymentTerms: string | null;

  @Column("varchar", { name: "StdIncoTerms", nullable: true, length: 200 })
  stdIncoTerms: string | null;

  @Column("decimal", {
    name: "ListPrice",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  listPrice: string | null;

  @Column("decimal", {
    name: "Discount",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  discount: string | null;

  @Column("decimal", {
    name: "NetPriceWithoutGST",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  netPriceWithoutGst: string | null;

  @Column("decimal", {
    name: "TotalPackage",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  totalPackage: string | null;

  @Column("varchar", { name: "Status", nullable: true, length: 100 })
  status: string | null;

  @Column("varchar", { name: "OfferStatus", nullable: true, length: 100 })
  offerStatus: string | null;

  @Column("datetime", { name: "CreatedOn", nullable: true })
  createdOn: Date | null;

  @Column("varchar", { name: "CreatedBy", nullable: true, length: 100 })
  createdBy: string | null;

  @Column("datetime", { name: "UpdatedOn", nullable: true })
  updatedOn: Date | null;

  @Column("varchar", { name: "UpdatedBy", nullable: true, length: 100 })
  updatedBy: string | null;

  @Column("varchar", { name: "customerRfqno", nullable: true, length: 100 })
  customerRfqno: string | null;

  @Column("datetime", { name: "customerRfqdate", nullable: true })
  customerRfqdate: Date | null;

  @Column("datetime", { name: "OfferDueDate", nullable: true })
  offerDueDate: Date | null;

  @Column("varchar", { name: "LostReason", nullable: true, length: 1000 })
  lostReason: string | null;

  @Column("varchar", { name: "allocatedto", nullable: true, length: 100 })
  allocatedto: string | null;

  @Column("varchar", { name: "selectedCurrency", nullable: true, length: 45 })
  selectedCurrency: string | null;

  @OneToMany(
    () => Inquiryattachmentsrecord,
    (inquiryattachmentsrecord) => inquiryattachmentsrecord.inquiry
  )
  inquiryattachmentsrecords: Inquiryattachmentsrecord[];

  @OneToMany(
    () => Technicaldetailsmappings,
    (technicaldetailsmappings) => technicaldetailsmappings.inquiry
  )
  technicaldetailsmappings: Technicaldetailsmappings[];

  @OneToMany(() => Visitsection, (visitsection) => visitsection.inquiry)
  visitsections: Visitsection[];
}
