import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("aspnetusers", { schema: "dbo" })
export class Aspnetusers {
  @PrimaryGeneratedColumn({ type: "int", name: "UserId" })
  userId: number;

  @Column("varchar", { name: "UserName", nullable: true, length: 256 })
  userName: string | null;

  @Column("varchar", {
    name: "NormalizedUserName",
    nullable: true,
    length: 256,
  })
  normalizedUserName: string | null;

  @Column("varchar", { name: "Email", nullable: true, length: 256 })
  email: string | null;

  @Column("varchar", { name: "NormalizedEmail", nullable: true, length: 256 })
  normalizedEmail: string | null;

  @Column("tinyint", { name: "EmailConfirmed", width: 1, default: () => "'0'" })
  emailConfirmed: boolean;

  @Column("varchar", { name: "PasswordHash", nullable: true, length: 256 })
  passwordHash: string | null;

  @Column("varchar", { name: "SecurityStamp", nullable: true, length: 256 })
  securityStamp: string | null;

  @Column("varchar", { name: "ConcurrencyStamp", nullable: true, length: 256 })
  concurrencyStamp: string | null;

  @Column("varchar", { name: "PhoneNumber", nullable: true, length: 256 })
  phoneNumber: string | null;

  @Column("tinyint", {
    name: "PhoneNumberConfirmed",
    width: 1,
    default: () => "'0'",
  })
  phoneNumberConfirmed: boolean;

  @Column("tinyint", {
    name: "TwoFactorEnabled",
    width: 1,
    default: () => "'0'",
  })
  twoFactorEnabled: boolean;

  @Column("datetime", { name: "LockoutEnd", nullable: true })
  lockoutEnd: Date | null;

  @Column("tinyint", { name: "LockoutEnabled", width: 1, default: () => "'0'" })
  lockoutEnabled: boolean;

  @Column("int", { name: "AccessFailedCount", default: () => "'0'" })
  accessFailedCount: number;

  @Column("varchar", { name: "FirstName", nullable: true, length: 256 })
  firstName: string | null;

  @Column("varchar", { name: "LastName", nullable: true, length: 256 })
  lastName: string | null;

  @Column("tinyint", { name: "IsActive", nullable: true, width: 1 })
  isActive: boolean | null;
}
