import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("aspnetuserroles", { schema: "dbo" })
export class Aspnetuserroles {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "UserId", nullable: true })
  userId: number | null;

  @Column("varchar", { name: "RoleId", nullable: true, length: 256 })
  roleId: string | null;
}
