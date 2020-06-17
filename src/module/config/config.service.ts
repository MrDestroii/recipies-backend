import { Injectable } from '@nestjs/common';
import { parse as dotenvParse, DotenvParseOutput } from 'dotenv';
import * as fs from 'fs';
import * as R from 'ramda';

interface DatabaseVariables {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: DotenvParseOutput;

  constructor() {
    this.envConfig = dotenvParse(fs.readFileSync(`.env`));
  }

  getEnvConfig(): DotenvParseOutput {
    return this.envConfig;
  }

  getEnvVariableByKey(key: string): string {
    return R.propOr('', key, this.envConfig);
  }

  getDatabaseEnvVariables(): DatabaseVariables {
    return {
      host: this.getEnvVariableByKey('DATABASE_HOST'),
      port: parseInt(this.getEnvVariableByKey('DATABASE_PORT')),
      username: this.getEnvVariableByKey('DATABASE_USERNAME'),
      password: this.getEnvVariableByKey('DATABASE_PASSWORD'),
      database: this.getEnvVariableByKey('DATABASE'),
    };
  }
}
