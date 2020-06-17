import { Injectable } from '@nestjs/common';

import * as R from 'ramda';

import { LikeRepository } from './like.repository';
import { CreateLikeDTO } from './create-like.dto';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async create(data: CreateLikeDTO) {
    const findedLike = await this.likeRepository.findOne({
      where: {
        user: { id: data.userId },
        recipe: { id: data.recipeId },
      },
    });

    if (R.isNil(findedLike)) {
      const createdLike = await this.likeRepository.create({
        user: { id: data.userId },
        recipe: { id: data.recipeId },
      });
      return this.likeRepository.save(createdLike);
    } else {
      await this.likeRepository.update(findedLike.id, {
        isActive: !findedLike.isActive,
      });
      return this.likeRepository.findOne(findedLike.id, {
        relations: ['user', 'recipe'],
      });
    }
  }
}
