import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './authService';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [DatabaseModule],
})
export class AuthModule {}
