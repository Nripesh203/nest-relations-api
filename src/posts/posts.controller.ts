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
} from '@nestjs/common';
import { PostService } from './posts.service';
import { JwtGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from '../DTO/createPost.dto';
import { Request } from 'express';
import { UpdatePostDto } from '../DTO/updatePost.dto';

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
}
