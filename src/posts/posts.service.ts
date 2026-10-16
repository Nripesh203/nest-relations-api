import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreatePostDto } from '../DTO/createPost.dto';
import { UpdatePostDto } from '../DTO/updatePost.dto';
import { CreateCommentDto } from '../DTO/createComment.dto';

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

  async createPost(userId: number, createPost: CreatePostDto) {
    const query = `INSERT INTO posts (user_id, description)
                    VALUES ($1, $2) RETURNING user_id, description`;

    const result = await this.pool.query(query, [
      userId,
      createPost.description,
    ]);

    return result.rows;
  }

  async getPostById(id: number) {
    const query = `SELECT u.username, p.post_id, p.description, p.created_at
                    FROM users u
                    INNER JOIN posts p ON u.user_id = p.user_id
                    WHERE p.post_id = $1`;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Post with ID ${id} not found.`);

    return result.rows[0];
  }

  async updatePost(
    userId: number,
    postId: number,
    updatepostDto: UpdatePostDto,
  ) {
    const query = `UPDATE posts
                   SET description = $1
                   WHERE post_id = $2 AND user_id = $3
                    RETURNING post_id, user_id, description, created_at`;

    const result = await this.pool.query(query, [
      updatepostDto.description,
      postId,
      userId,
    ]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Post with ID ${postId} not found.`);

    return result.rows[0];
  }

  async deletePost(userId: number, postId: number) {
    const query = `DELETE FROM posts WHERE post_id = $1 and user_id = $2 RETURNING post_id`;

    const result = await this.pool.query(query, [postId, userId]);

    if (result.rows.length === 0)
      throw new NotFoundException(`Post with Id ${postId} not found.`);

    return `Post with ID ${postId} deleted successfully.`;
  }

  async postComments(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const query = `INSERT INTO comments (user_id, post_id, comment_text)
                    VALUES ($1, $2, $3) 
                    RETURNING comment_id, user_id, post_id, comment_text`;

    const result = await this.pool.query(query, [
      userId,
      postId,
      createCommentDto.comment_text,
    ]);

    return result.rows[0];
  }
}
