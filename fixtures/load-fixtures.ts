import * as path from 'path';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';
import { createConnection, getRepository, Connection } from 'typeorm';
import { ConfigService } from 'src/module/config/config.service';
import { UserEntity } from 'src/entity/user.entity';
import { RecipeEntity } from 'src/entity/recipe.entity';
import { IngredientEntity } from 'src/entity/ingredient.entity';
import { AlternativeIngredientEntity } from 'src/entity/alternative-ingredient.entity';
import { LikeEntity } from 'src/entity/like.entity';
import { StepEntity } from 'src/entity/step.entity';

const dbConfig = new ConfigService().getDatabaseEnvVariables();

const loadFixtures = async (fixturesPath: string) => {
  let connection: Connection;

  try {
    connection = await createConnection({
      type: 'postgres',
      ...dbConfig,
      entities: [
        UserEntity,
        RecipeEntity,
        IngredientEntity,
        AlternativeIngredientEntity,
        LikeEntity,
        StepEntity
      ],
    });
    await connection.synchronize(true);

    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      console.log({ name: entity.constructor.name });
      await getRepository(entity.constructor.name).save(entity);
    }
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

loadFixtures('./fixtures/list')
  .then(() => {
    console.log('Fixtures are successfully loaded.');
  })
  .catch(err => console.log(err));
