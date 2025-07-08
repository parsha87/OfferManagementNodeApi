import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Inquiries } from "./Inquiries";

@Index("FK_VisitSection_Inquiry", ["inquiryId"], {})
@Entity("visitsection", { schema: "dbo" })
export class Visitsection {
  @PrimaryGeneratedColumn({ type: "int", name: "VisitSectionId" })
  visitSectionId: number;

  @Column("int", { name: "InquiryId", nullable: true })
  inquiryId: number | null;

  @Column("datetime", { name: "VisitDate", nullable: true })
  visitDate: Date | null;

  @Column("varchar", { name: "VisitReason", nullable: true, length: 255 })
  visitReason: string | null;

  @Column("varchar", { name: "VisitKeyPoints", nullable: true, length: 256 })
  visitKeyPoints: string | null;

  @ManyToOne(() => Inquiries, (inquiries) => inquiries.visitsections, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "InquiryId", referencedColumnName: "inquiryId" }])
  inquiry: Inquiries;
}
