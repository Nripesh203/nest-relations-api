import { Controller, Get } from '@nestjs/common';
import { PostService } from './posts.service';

@Controller('api')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('posts')
  async getPosts() {
    return this.postService.getPosts();
  }
}
