import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("frequency", { schema: "dbo" })
export class Frequency {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "FrequencyValue", nullable: true, length: 255 })
  frequencyValue: string | null;
}
