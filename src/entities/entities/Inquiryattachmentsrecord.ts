import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Inquiries } from "./Inquiries";

@Index("FK_Inquiry_Attachments", ["inquiryId"], {})
@Entity("inquiryattachmentsrecord", { schema: "dbo" })
export class Inquiryattachmentsrecord {
  @PrimaryGeneratedColumn({ type: "int", name: "AttachmentId" })
  attachmentId: number;

  @Column("int", { name: "InquiryId" })
  inquiryId: number;

  @Column("varchar", { name: "OriginalFileName", nullable: true, length: 255 })
  originalFileName: string | null;

  @Column("varchar", { name: "UniqueFileName", nullable: true, length: 255 })
  uniqueFileName: string | null;

  @Column("timestamp", {
    name: "UploadedOn",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  uploadedOn: Date | null;

  @ManyToOne(
    () => Inquiries,
    (inquiries) => inquiries.inquiryattachmentsrecords,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "InquiryId", referencedColumnName: "inquiryId" }])
  inquiry: Inquiries;
}
