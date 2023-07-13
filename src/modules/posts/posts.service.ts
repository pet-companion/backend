import { FindOptions } from 'sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from 'src/models/post/post.model';
import { PetCategory } from 'src/models';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postModel: typeof Post,
    @InjectModel(PetCategory) private petCategoryModel: typeof PetCategory,
  ) {}

  private readonly findOptions: FindOptions<Post> = {
    include: [{ model: PetCategory }],
  };

  async create(createPostDto: CreatePostDto, userId: number) {
    const petCategory = await this.petCategoryModel.findOne({
      where: { id: createPostDto.petCategoryId },
    });

    if (!petCategory) throw new BadRequestException('Pet category not found');

    const post = await this.postModel.create({
      ...createPostDto,
      userId,
    });

    return post;
  }

  async findAll() {
    const posts = await this.postModel.findAll({
      ...this.findOptions,
      where: { isPublished: true },
    });

    if (!posts.length) throw new BadRequestException('No posts found.');

    return posts;
  }

  async findOne(id: number) {
    const post = await this.postModel.findOne({
      ...this.findOptions,
      where: { id, isPublished: true },
    });

    if (!post) throw new BadRequestException('Post not found.');

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findOne({
      where: { id },
    });

    if (!post) throw new BadRequestException('Post not found.');

    if (updatePostDto.petCategoryId) {
      const petCategory = await this.petCategoryModel.findOne({
        where: { id: updatePostDto.petCategoryId },
      });

      if (!petCategory) throw new BadRequestException('Pet category not found');
    }
    await post.update(updatePostDto);

    return post;
  }

  async remove(id: number) {
    const post = await this.postModel.findOne({
      where: { id },
    });

    if (!post) throw new BadRequestException('Post not found.');

    await post.destroy();

    return { message: 'Post deleted successfully.' };
  }
}
