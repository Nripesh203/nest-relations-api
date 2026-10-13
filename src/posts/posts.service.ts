import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async getPosts() {
    const query = `select u.username, p.post_id, p.description, COUNT(pl.user_id)::int AS like_count
                  FROM posts p
                  LEFT JOIN users u ON p.user_id = u.user_id
                  LEFT JOIN post_likes pl ON p.post_id = pl.post_id
                  GROUP BY p.post_id, u.username, p.description
                  ORDER BY p.post_id`;

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getComments() {
    const query = `SELECT p.post_id, p.description, u.username, c.comment_text 
                  FROM comments c 
                  INNER JOIN users u ON c.user_id = u.user_id
                  INNER JOIN posts p ON c.post_id = p.post_id`;

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getCommentsById(id: number) {
    const query = `SELECT * FROM comments WHERE comment_id = $1`;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) throw new NotFoundException();

    return result.rows[0];
  }

  async getCommentsInPost(id: number) {
    const query = `SELECT * FROM comments WHERE post_id = $1`;

    const result = await this.pool.query(query, [id]);

    return result.rows;
  }

  async getPostByOneUser(id: number) {
    const query = `SELECT  * FROM posts WHERE user_id = $1`;

    const result = await this.pool.query(query, [id]);

    return result.rows;
  }
}
