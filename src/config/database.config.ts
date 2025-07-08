import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from 'src/common/decorators';

function typeormModuleOptions(): TypeOrmModuleOptions {
  require('dotenv').config();
  console.log('process.env', process.env);

  return {
    type: 'mysql',
    host: '97.74.85.133',
    port: 3306,
    username: 'qms',
    password: 'qms',
    database: 'dbo',
    entities: [],
    autoLoadEntities: true,

    // Implementaremos Migrations.
    /** Recursos
     *  * https://typeorm.io/#/migrations
     */
    migrationsRun: false,
    migrations: [join(__dirname, '../migration/**/*{.ts,.js}')],
    migrationsTableName: 'migrations_typeorm',
    cli: {
      migrationsDir: 'src/migration',
    },

    // Activar SOLO MANUALMENTE en DESARROLLO SI ES NECESARIO (DESACTIVAR EN PRODUCCION).
    synchronize: false,
    logging: true,
    logger: 'file',

  }
}

export default registerAs('database', () => ({
  config: typeormModuleOptions()
}));
