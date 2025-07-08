import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customer", { schema: "dbo" })
export class Customer {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "CustomerName", length: 500 })
  customerName: string;

  @Column("varchar", { name: "firstname", nullable: true, length: 500 })
  firstname: string | null;

  @Column("varchar", { name: "lastname", nullable: true, length: 500 })
  lastname: string | null;

  @Column("varchar", { name: "Address", nullable: true, length: 500 })
  address: string | null;

  @Column("varchar", { name: "Region", nullable: true, length: 500 })
  region: string | null;

  @Column("varchar", { name: "City", nullable: true, length: 100 })
  city: string | null;

  @Column("varchar", { name: "Email", nullable: true, length: 100 })
  email: string | null;

  @Column("varchar", { name: "PhoneNo", nullable: true, length: 50 })
  phoneNo: string | null;
}
