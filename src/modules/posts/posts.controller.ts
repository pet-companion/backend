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
  AccessTokenGuard,
  EmailVerificationGuard,
  RolesGuard,
} from '../auth/guards';
import { RoleEnum } from 'src/enums';
import { Roles, UserInformation } from 'src/decorators';

@Controller('posts')
@UseGuards(new AccessTokenGuard(), new EmailVerificationGuard())
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post()
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
