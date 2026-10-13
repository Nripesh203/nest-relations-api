import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostService } from './posts.service';

@Controller('api')
export class PostController {
  constructor(private readonly postService: PostService) {}

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
}
