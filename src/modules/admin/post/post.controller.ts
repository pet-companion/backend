import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { PostService } from 'src/modules/public/post/post.service';
import { CreatePostDto, UpdatePostDto } from 'src/dtos/post';

import { RoleEnum } from 'src/enums';
import { Roles, UserInformation } from 'src/decorators';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from 'src/modules/public/auth/guards';

@ApiTags('Admin - Posts')
@Controller('admin/posts')
@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post()
  @ApiCreatedResponse({
    description: 'Post created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Post title',
        description: 'Post description',
        content: 'Post content',
        isPublished: true,
        petCategoryId: 1,
        userId: 1,
        updatedAt: '2023-07-14T03:44:44.591Z',
        createdAt: '2023-07-14T03:44:44.591Z',
      },
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        content: { type: 'string' },
        isPublished: { type: 'boolean' },
        petCategoryId: { type: 'integer' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'title should not be empty',
          'description should not be empty',
          'isPublished should not be empty',
        ],
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createPostDto: CreatePostDto, @UserInformation() user: any) {
    return this.postService.create(createPostDto, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
