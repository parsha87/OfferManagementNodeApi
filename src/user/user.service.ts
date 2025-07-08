import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Aspnetusers } from 'src/entities/entities/Aspnetusers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aspnetroles } from 'src/entities/entities/Aspnetroles';
import * as bcrypt from 'bcryptjs';
import { Aspnetuserroles } from 'src/entities/entities/Aspnetuserroles';

@Injectable()
export class UserService {


  constructor(
    @InjectRepository(Aspnetusers)
    private readonly aspnetusers: Repository<Aspnetusers>,
    @InjectRepository(Aspnetroles)
    private readonly roleRepo: Repository<Aspnetroles>,
    @InjectRepository(Aspnetuserroles)
    private readonly userRoleRepo: Repository<Aspnetuserroles>,
  ) { }

  async findAll() {
    const usersWithRoles = await this.aspnetusers
      .createQueryBuilder('user')
      .leftJoin('aspnetUserRoles', 'userRole', 'user.userId = userRole.userId')
      .leftJoin('aspnetRoles', 'role', 'userRole.roleId = role.roleId')
      .select([
        'user.userId AS id',
        'user.userName AS userName',
        'user.email AS email',
        'user.phoneNumber AS phoneNumber',
        'user.firstName AS firstName',
        'user.lastName AS lastName',
        'user.isActive AS isActive',
        'role.name AS role',
      ])
      .getRawMany();

    return usersWithRoles.map(row => ({
      id: row.id,
      userName: row.userName,
      email: row.email,
      phoneNumber: row.phoneNumber,
      firstName: row.firstName,
      lastName: row.lastName,
      isActive: row.isActive,
      role: row.role || null,
      password: null, // Don't return passwords in public responses
    }));
  }

  async getAllRoles() {
    const roles = await this.roleRepo.find(); // TypeORM repository
    return roles;
    // return roles.map(role => ({
    //   id: role.roleId,
    //   name: role.name,
    //   normalizedName: role.normalizedName,
    // }));
  }

  async getUserRole(id: any) {
    const userRoleMappings = await this.userRoleRepo.findOne({
      where: { userId: id },
    });
    if (userRoleMappings) {
      const roles = await this.roleRepo.findOne({
        where: { roleId: userRoleMappings.roleId },
      });
      return roles.name;
    }
  }

  async findUserById(userId: any) {
    const user = await this.aspnetusers.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRole = await this.userRoleRepo.findOne({ where: { userId } });
    let roleName = null;

    if (userRole) {
      const role = await this.roleRepo.findOne({ where: { roleId: userRole.roleId } });
      roleName = role?.name || null;
    }

    return {
      id: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: roleName,
      password: null,
    };
  }


  async findOne(email: any): Promise<Aspnetusers | null> {
    return await this.aspnetusers.findOne({
      where: { email: email },
    });
  }

  async updateUser(id: string, dto: any) {
    const user = await this.aspnetusers.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update fields
    user.userName = dto.userName;
    user.email = dto.email;
    user.phoneNumber = dto.phoneNumber;
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.isActive = dto.isActive;

    await this.aspnetusers.save(user);

    // Handle role
    const existingUserRole = await this.userRoleRepo.findOne({ where: { userId: id } });

    if (existingUserRole) {
      await this.userRoleRepo.delete({ userId: dto.id }); // remove current role
    }

    const role = await this.roleRepo.findOne({ where: { name: dto.role } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.userRoleRepo.save({ userId: dto.id, roleId: role.roleId });

    return {
      id: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: dto.role,
    };
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByToken(data: any) {
    return await this.aspnetusers
      .createQueryBuilder('user')
      .where({ sessionId: data })
      .select([
        'user.id',
        'user.name',
      ])
      .getOne();
  }

  async createUser(dto: any) {
    // Check if role exists
    let role = await this.roleRepo.findOne({ where: { name: dto.role } });

    if (!role) {
      role = this.roleRepo.create({ name: dto.role });
      try {
        await this.roleRepo.save(role);
      } catch (e) {
        throw new BadRequestException('Failed to create role.');
      }
    }

    const existingUser = await this.aspnetusers.findOne({
      where: [{ email: dto.email }, { userName: dto.userName }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.aspnetusers.create({
      userName: dto.userName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isActive: dto.isActive,
      passwordHash, // include passwordHash
    });



    await this.aspnetusers.save(user);

    const userRole = this.userRoleRepo.create({
      userId: user.userId,
      roleId: role.roleId
    })

    await this.userRoleRepo.save(userRole);

    return { message: 'User created and role assigned successfully.' };
  }


}
