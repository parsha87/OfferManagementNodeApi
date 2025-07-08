import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("listofvalues", { schema: "dbo" })
export class Listofvalues {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Value", length: 500 })
  value: string;

  @Column("varchar", { name: "Type", length: 255 })
  type: string;
}
