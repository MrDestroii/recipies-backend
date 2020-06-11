import { RecipeModule } from './../recipe/recipe.module';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './../config/config.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';

import { AppController } from './app.controller';
import { ConfigService } from '../config/config.service';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { AlternativeIngredientEntity } from 'src/entity/alternative-ingredient.entity';
import { LikeEntity } from 'src/entity/like.entity';

@Module({
  imports: [
    RecipeModule,
    AuthModule,
    UserModule,
    NestConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dataEnvDatabase = configService.getDatabaseEnvVariables();
        return {
          type: 'postgres',
          host: dataEnvDatabase.host,
          port: dataEnvDatabase.port,
          username: dataEnvDatabase.username,
          password: dataEnvDatabase.password,
          database: dataEnvDatabase.database,
          entities: [
            UserEntity,
            RecipeEntity,
            IngredientEntity,
            AlternativeIngredientEntity,
            LikeEntity
          ],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
