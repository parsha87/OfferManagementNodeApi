import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listofvalues } from 'src/entities/entities/Listofvalues';
import { Repository } from 'typeorm';


@Injectable()
export class ListofvaluesService {

    constructor(
        @InjectRepository(Listofvalues)
        private readonly listOfValueRepo: Repository<Listofvalues>,
    ) { }

    async getAllAsync() {
        const entities = await this.listOfValueRepo.find();
        return entities;

        // return plainToInstance(Listofvalues, entities);
    }
    async create(dto: any) {
    const trimmedValue = dto.value.trim();

    const existing = await this.listOfValueRepo.findOne({
      where: {
        value: trimmedValue.toLowerCase(),
        type: dto.type.trim(),
      },
    });

    if (existing) {
      throw new BadRequestException(`Value exists for type "${dto.type}"`);
    }

    const newValue = this.listOfValueRepo.create(dto);
    return this.listOfValueRepo.save(newValue);
  }

}
