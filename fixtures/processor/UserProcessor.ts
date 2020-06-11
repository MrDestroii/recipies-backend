import { IProcessor } from 'typeorm-fixtures-cli';
import * as R from 'ramda';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from 'src/module/user/user.service';

export default class UserProcessor implements IProcessor<UserEntity> {
  preProcess(name: string, object: any): any {
    return object;
  }

  async postProcess(
    name: string,
    object: { [key: string]: any },
  ): Promise<void> {
    object.password = await new UserService(null).getHash(
      R.toString(object.password),
    );
  }
}
