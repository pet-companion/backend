import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PostService } from 'src/modules/public/post/post.service';
import { PostsController } from './post.controller';
import { PetCategory, Post, User } from 'src/models';

@Module({
  imports: [SequelizeModule.forFeature([Post, PetCategory, User])],
  controllers: [PostsController],
  providers: [PostService],
})
export class PostsModule {}
