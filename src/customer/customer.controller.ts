import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('api/Customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Get()
  async getAllCustomers() {
    try {
      return await this.customerService.getAllCustomers();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new InternalServerErrorException('Failed to fetch customers');
    }
  }

  @Post()
  async addCustomer(@Body() dto: any) {
    return this.customerService.addCustomer(dto);
  }

  @Get(':id')
  async getCustomer(@Param('id') id: number) {
    const customer = await this.customerService.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

}
