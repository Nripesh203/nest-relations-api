import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostController } from "./posts.controller";
import { PostService } from "./posts.service";
import { DatabaseModule } from "../database/database.module";

@Module({
    controllers: [PostController],
    providers: [PostService],
    imports: [DatabaseModule],
})
export class PostModule {}