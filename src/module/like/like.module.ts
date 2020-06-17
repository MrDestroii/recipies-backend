import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LikeEntity } from 'src/entity/like.entity';

import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, LikeRepository])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
