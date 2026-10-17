import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
  Post,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { JwtGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from '../DTO/createPost.dto';
import { Request } from 'express';
import { UpdatePostDto } from '../DTO/updatePost.dto';
import { create } from 'domain';
import { CreateCommentDto } from '../DTO/createComment.dto';
import { UpdateCommentDto } from '../DTO/updateComment.dto';

@Controller('api')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuard)
  @Get('posts')
  async getPosts() {
    return this.postService.getPosts();
  }

  @Get('comments')
  async getComments() {
    return this.postService.getComments();
  }

  @Get('comment/:id')
  async getCommentsById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getCommentsById(id);
  }

  @Get('posts/:id/comments')
  async getCommentsInPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getCommentsInPost(id);
  }

  @Get('users/:id/posts')
  async getPostByOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostByOneUser(id);
  }

  @UseGuards(JwtGuard)
  @Post('create/posts')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req()
    req: Request & {
      user: { userId: number | string; username: string };
    },
  ) {
    return this.postService.createPost(Number(req.user.userId), createPostDto);
  }

  @UseGuards(JwtGuard)
  @Get('posts/:id')
  async getPostByID(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @UseGuards(JwtGuard)
  @Put('update/posts/:id')
  async updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatepostDto: UpdatePostDto,
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
  ) {
    return this.postService.updatePost(
      Number(req.user.userId),
      postId,
      updatepostDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('delete/posts/:id')
  async deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
  ) {
    return this.postService.deletePost(postId, Number(req.user.userId));
  }

  @UseGuards(JwtGuard)
  @Post('posts/:id/comments')
  async postComments(
    @Param('id', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
  ) {
    return this.postService.postComments(
      Number(req.user.userId),
      postId,
      createCommentDto,
    );
  }

  @UseGuards(JwtGuard)
  @Put('update/comments/:id')
  async upateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
  ) {
    return this.postService.updateComment(
      Number(req.user.userId),
      commentId,
      updateCommentDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('delete/comments/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req()
    req: Request & { user: { userId: number | string; username: string } },
  ) {
    return this.postService.deleteComment(Number(req.user.userId), commentId);
  }
}
