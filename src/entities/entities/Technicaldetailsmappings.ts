import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Inquiries } from "./Inquiries";

@Index("FK__Technical__Inqui__0A9D95DB_idx", ["inquiryId"], {})
@Entity("technicaldetailsmappings", { schema: "dbo" })
export class Technicaldetailsmappings {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "InquiryId", nullable: true })
  inquiryId: number | null;

  @Column("varchar", { name: "MotorType", nullable: true, length: 100 })
  motorType: string | null;

  @Column("varchar", { name: "Pole", nullable: true, length: 50 })
  pole: string | null;

  @Column("varchar", { name: "kw", nullable: true, length: 50 })
  kw: string | null;

  @Column("varchar", { name: "kw2", nullable: true, length: 45 })
  kw2: string | null;

  @Column("varchar", { name: "hp", nullable: true, length: 50 })
  hp: string | null;

  @Column("varchar", { name: "hp2", nullable: true, length: 45 })
  hp2: string | null;

  @Column("varchar", { name: "Phase", nullable: true, length: 50 })
  phase: string | null;

  @Column("varchar", { name: "FrameSize", nullable: true, length: 50 })
  frameSize: string | null;

  @Column("varchar", { name: "DOP", nullable: true, length: 50 })
  dop: string | null;

  @Column("varchar", { name: "InsulationClass", nullable: true, length: 50 })
  insulationClass: string | null;

  @Column("varchar", { name: "Efficiency", nullable: true, length: 50 })
  efficiency: string | null;

  @Column("varchar", { name: "Voltage", nullable: true, length: 50 })
  voltage: string | null;

  @Column("varchar", { name: "Frequency", nullable: true, length: 50 })
  frequency: string | null;

  @Column("varchar", { name: "Quantity", nullable: true, length: 50 })
  quantity: string | null;

  @Column("varchar", { name: "Mounting", nullable: true, length: 50 })
  mounting: string | null;

  @Column("varchar", {
    name: "SafeAreaHazardousArea",
    nullable: true,
    length: 100,
  })
  safeAreaHazardousArea: string | null;

  @Column("varchar", { name: "Brand", nullable: true, length: 100 })
  brand: string | null;

  @Column("varchar", { name: "IfHazardousArea", nullable: true, length: 50 })
  ifHazardousArea: string | null;

  @Column("varchar", { name: "TempClass", nullable: true, length: 50 })
  tempClass: string | null;

  @Column("varchar", { name: "GasGroup", nullable: true, length: 50 })
  gasGroup: string | null;

  @Column("varchar", { name: "Zone", nullable: true, length: 50 })
  zone: string | null;

  @Column("varchar", {
    name: "HardadousDescription",
    nullable: true,
    length: 500,
  })
  hardadousDescription: string | null;

  @Column("varchar", { name: "Duty", nullable: true, length: 100 })
  duty: string | null;

  @Column("varchar", { name: "StartsPerHour", nullable: true, length: 50 })
  startsPerHour: string | null;

  @Column("varchar", { name: "CDF", nullable: true, length: 50 })
  cdf: string | null;

  @Column("varchar", { name: "AmbientTemp", nullable: true, length: 50 })
  ambientTemp: string | null;

  @Column("varchar", { name: "TempRise", nullable: true, length: 50 })
  tempRise: string | null;

  @Column("varchar", { name: "Accessories", nullable: true, length: 200 })
  accessories: string | null;

  @Column("varchar", { name: "Brake", nullable: true, length: 100 })
  brake: string | null;

  @Column("varchar", { name: "EncoderMounting", nullable: true, length: 100 })
  encoderMounting: string | null;

  @Column("varchar", {
    name: "EncoderMountingIfYes",
    nullable: true,
    length: 100,
  })
  encoderMountingIfYes: string | null;

  @Column("varchar", { name: "Application", nullable: true, length: 200 })
  application: string | null;

  @Column("varchar", { name: "Segment", nullable: true, length: 100 })
  segment: string | null;

  @Column("varchar", { name: "Narration", nullable: true, length: 100 })
  narration: string | null;

  @Column("varchar", { name: "Amount", nullable: true, length: 100 })
  amount: string | null;

  @Column("varchar", { name: "DeliveryTime", nullable: true, length: 100 })
  deliveryTime: string | null;

  @Column("varchar", { name: "StartType", nullable: true, length: 100 })
  startType: string | null;

  @Column("varchar", {
    name: "TechDetailsListPrice",
    nullable: true,
    length: 100,
  })
  techDetailsListPrice: string | null;

  @Column("varchar", {
    name: "TechDetailsDiscount",
    nullable: true,
    length: 100,
  })
  techDetailsDiscount: string | null;

  @Column("varchar", {
    name: "NonStandardFeatures",
    nullable: true,
    length: 100,
  })
  nonStandardFeatures: string | null;

  @ManyToOne(
    () => Inquiries,
    (inquiries) => inquiries.technicaldetailsmappings,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "InquiryId", referencedColumnName: "inquiryId" }])
  inquiry: Inquiries;
}
