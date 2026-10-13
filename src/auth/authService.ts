import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../DTO/Register.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async register(registerDto: RegisterDto) {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const query = `INSERT INTO users (username, password_hash) 
                    VALUES ($1, $2) RETURNING username, user_id`;

    const result = await this.pool.query(query, [
      registerDto.username,
      passwordHash,
    ]);

    return result.rows;
  }
}
