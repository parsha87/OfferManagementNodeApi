import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("brands", { schema: "dbo" })
export class Brands {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "BrandName", length: 200 })
  brandName: string;

  @Column("tinyint", { name: "IsActive", width: 1, default: () => "'1'" })
  isActive: boolean;

  @Column("varchar", { name: "Description", nullable: true, length: 255 })
  description: string | null;
}
