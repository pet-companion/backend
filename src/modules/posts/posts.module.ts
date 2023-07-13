import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetCategory, Post, User } from 'src/models';

@Module({
  imports: [SequelizeModule.forFeature([Post, PetCategory, User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
