import { MinLength, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateUserDTO {
  @MinLength(5, {
    message: 'Name is less than 5',
  })
  @MaxLength(15, {
    message: 'Name is longer than 15',
  })
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  password: string;
}
