import { ConfigService } from '@nestjs/config';
import configs from 'src/configs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const configService = new ConfigService(configs());

const options = {
  type: configService.get('database.type'),
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  synchronize: false,
  dropSchema: false,
  logging: true,
  entities: [__dirname + '/../entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true,
} as DataSourceOptions;

export const dataSource = new DataSource(options);

export default options;
