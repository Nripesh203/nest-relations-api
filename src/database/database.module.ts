import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Module({
  imports: [ConfigModule],
  exports: ['PG_POOL'],
  controllers: [],
  providers: [
    {
      provide: 'PG_POOL',
      useFactory: (config: ConfigService) =>
        new Pool({
          host: config.get<string>('PG_HOST'),
          port: config.get<string>('PG_PORT')
            ? Number(config.get<string>('PG_PORT'))
            : 5432,
          database: config.get<string>('PG_DATABASE'),
          password: config.get<string>('PG_PASSWORD'),
          user: config.get<string>('PG_USER'),
        }),
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
