import { Module } from '@nestjs/common';
import { UserService } from '../public/user/user.service';
import { Pet, PetCategory, Post, Role, User, UserRoles } from 'src/models';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetService } from '../public/pet/pet.service';
import { PostService } from '../public/post/post.service';
import { PetController } from './pet/pet.controller';
import { UserController } from './user/user.controller';
import { PostsController } from './post/post.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Pet, Post, PetCategory]),
  ],
  providers: [UserService, PetService, PostService],
  controllers: [UserController, PetController, PostsController],
})
export class AdminModule {}
