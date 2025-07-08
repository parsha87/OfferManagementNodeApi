import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("voltage", { schema: "dbo" })
export class Voltage {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "VoltageValue", nullable: true, length: 255 })
  voltageValue: string | null;
}
