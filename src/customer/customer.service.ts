import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/entities/Customer';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
    ) { }


    async getAllCustomers() {
        return this.customerRepo.find();
    }

    async addCustomer(dto: any){
    const trimmedName = dto.customerName.trim().toLowerCase();

    const existing = await this.customerRepo.findOne({
      where: { customerName: trimmedName },
    });

    if (existing) {
      throw new Error('Customer with the same name already exists.');
    }

    const newCustomer = this.customerRepo.create(dto);

    return await this.customerRepo.save(newCustomer);
  }

  async findOne(id: number) {
    return this.customerRepo.findOne({ where: { id } });
  }
}
