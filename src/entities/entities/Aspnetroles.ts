import { Column, Entity } from "typeorm";

@Entity("aspnetroles", { schema: "dbo" })
export class Aspnetroles {
  @Column("varchar", { primary: true, name: "RoleId", length: 450 })
  roleId: string;

  @Column("varchar", { name: "Name", nullable: true, length: 256 })
  name: string | null;

  @Column("varchar", { name: "NormalizedName", nullable: true, length: 256 })
  normalizedName: string | null;

  @Column("varchar", { name: "ConcurrencyStamp", nullable: true })
  concurrencyStamp: string | null;
}
