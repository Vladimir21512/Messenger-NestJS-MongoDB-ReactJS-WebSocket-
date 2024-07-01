import { IsEmail, IsNotEmpty } from 'class-validator';
export class FindUserDto{
  @IsNotEmpty()
  readonly name:string

  @IsNotEmpty()
  readonly email:string
}