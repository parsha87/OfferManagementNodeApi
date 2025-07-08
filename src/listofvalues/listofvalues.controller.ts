import { Body, Controller, Get, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';
import { ListofvaluesService } from './listofvalues.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('ListOfValues')
@Controller('api/ListOfValues')
export class ListofvaluesController {
  constructor(private readonly listofvaluesService: ListofvaluesService) { }

  @Get()
  async getListOfValues() {
    try {
      const list = await this.listofvaluesService.getAllAsync();
      return list;
    } catch (error) {
      console.error('Error fetching list of values:', error);
      throw new InternalServerErrorException('Failed to fetch list of values');
    }
  }

  @Post()
  async create(@Body() dto: any) {
    try {
      return this.listofvaluesService.create(dto);
    } catch (error) {
      console.error('Error fetching list of values:', error);
      throw new InternalServerErrorException('Failed to fetch list of values');
    }
  }
}
