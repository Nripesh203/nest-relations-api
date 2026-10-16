import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../DTO/Register.dto';
import { LoginDto } from '../DTO/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdatePostDto } from '../DTO/updatePost.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('PG_POOL') private pool: Pool,
    private jwtService: JwtService,
  ) {}

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

  async login(loginDto: LoginDto) {
    const query = `SELECT user_id, username, password_hash
                  FROM users
                  WHERE username = $1`;

    const result = await this.pool.query(query, [loginDto.username]);
    const user = result.rows[0];

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.password_hash))
    ) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const token = await this.jwtService.signAsync({
      sub: user.user_id,
      username: user.username,
    });

    return { access_token: token };
  }
}
