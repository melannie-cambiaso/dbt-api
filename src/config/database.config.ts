import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USERNAME', 'dbtuser'),
  password: configService.get<string>('DATABASE_PASSWORD', 'dbtpass123'),
  database: configService.get<string>('DATABASE_NAME', 'dbtapp_dev'),
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: false, // Disabled to prevent schema conflicts
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});
