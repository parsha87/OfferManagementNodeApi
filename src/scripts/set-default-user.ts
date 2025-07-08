import { getRepository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD } from '../config/constants';
import { Aspnetusers } from 'src/entities/entities/Aspnetusers';

const setDefaultUser = async (config: ConfigService) => {
  const userRepository = getRepository<Aspnetusers>(Aspnetusers);

  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('user_name = :name', {
      name: config.get<string>('DEFAULT_USER_NAME'),
    })
    .getOne();

  if (!defaultUser) {
    // const adminUser = userRepository.create({
    //   name: config.get<string>(DEFAULT_USER_NAME),
    //   password: config.get<string>(DEFAULT_USER_PASSWORD),
    //   roleId: 1,
    // });

    // return await userRepository.save(adminUser);
  }
};

export default setDefaultUser; 
