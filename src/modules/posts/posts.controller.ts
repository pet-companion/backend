import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../auth/guards';
import { RoleEnum } from 'src/enums';
import { Roles, UserInformation } from 'src/decorators';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    return this.postsService.create(createPostDto, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
