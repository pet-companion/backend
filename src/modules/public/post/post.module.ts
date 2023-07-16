import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostsController } from './post.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetCategory, Post, User } from 'src/models';

@Module({
  imports: [SequelizeModule.forFeature([Post, PetCategory, User])],
  controllers: [PostsController],
  providers: [PostService],
})
export class PostsModule {}
