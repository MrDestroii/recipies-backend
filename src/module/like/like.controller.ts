import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';

import { CreateLikeDTO } from './create-like.dto'
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() data: CreateLikeDTO) {
    return this.likeService.create(data)
  }
}
