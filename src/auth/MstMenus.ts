import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mst_menus", { schema: "dow_new" })
export class MstMenus {
  @PrimaryGeneratedColumn({ type: "int", name: "menuId" })
  menuId: number;

  @Column("varchar", { name: "menuName", nullable: true, length: 45 })
  menuName: string | null;

  @Column("varchar", { name: "menuPath", nullable: true, length: 45 })
  menuPath: string | null;

  @Column("int", { name: "menuRoleId", nullable: true })
  menuRoleId: number | null;

  @Column("varchar", { name: "menuLable", nullable: true, length: 45 })
  menuLable: string | null;

  @Column("int", { name: "isActive", nullable: true })
  isActive: number | null;
}
