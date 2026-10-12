import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async getPosts() {
    const query = `SELECT p.post_id, p.description, u.username FROM users u INNER JOIN posts p ON u.user_id = p.user_id`;
    const result = await this.pool.query(query);

    return result.rows;
  }
}
