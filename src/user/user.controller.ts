import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, InternalServerErrorException, Res, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { Aspnetusers } from 'src/entities/entities/Aspnetusers';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User routes')
@Controller('api/User')
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  async createUser(@Body() model: any) {
    try {
      return this.userService.createUser(model);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('get-roles')
  // @UseGuards(AuthGuard('jwt')) // If protected
  async getRoles() {
    try {
      return await this.userService.getAllRoles();
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to fetch roles');
    }
  }



  @Get('getall')
  async getUsers(@Req() req: Request, @Res() res: any) {
    //  const currentUserName = req.user.username; // assuming username in JWT payload
    const users = await this.userService.findAll();

    // const currentUser = users.find(u => u.userName === currentUserName);

    let filteredUsers = users;

    // if (currentUser?.role === 'User') {
    //   filteredUsers = users.filter(u => u.role === 'User');
    // } else if (currentUser?.role === 'Admin') {
    //   filteredUsers = users.filter(u => u.role !== 'SuperAdmin');
    // }

    return res.status(200).json(filteredUsers);
  } catch(error) {
    console.error('Error fetching users:', error);
    // return res.status(500).json({ message: 'Failed to fetch users' });
  }

  @Get('get/:id')
  // @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(id);
      return user;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  @Put('update/:id')
  // @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    try {
      const user = await this.userService.updateUser(id, dto);
      return user;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}



// @Get('get/:id')
// async getUserById(@Param('id') id: string) {
//   return this.userService.getUserById(id);
// }

// @Delete('delete/:id')
// async deleteUser(@Param('id') id: string) {
//   return this.userService.deleteUser(id);
// }

// @Put('update/:id')
// async updateUser(@Param('id') id: string, @Body() model: UserWithRolesDto) {
//   return this.userService.updateUser(id, model);
// }

// @Post('change-password/:id')
// async changePassword(@Param('id') id: string, @Body('newPassword') newPassword: string) {
//   return this.userService.changePassword(id, newPassword);
// }

// @Post('assignrole/:userId/:role')
// async assignRole(@Param('userId') userId: string, @Param('role') role: string) {
//   return this.userService.assignRole(userId, role);
// }

// @Post('create-role')
// async createRole(@Body('roleName') roleName: string) {
//   return this.userService.createRole(roleName);
// }

// @Get('get-roles')
// async getRoles() {
//   return this.userService.getRoles();
// }

// @Delete('delete-role/:roleName')
// async deleteRole(@Param('roleName') roleName: string) {
//   return this.userService.deleteRole(roleName);
// }
