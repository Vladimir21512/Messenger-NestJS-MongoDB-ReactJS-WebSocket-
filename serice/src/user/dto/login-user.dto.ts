import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginUserDto{
  @IsNotEmpty()
  readonly password:string

  @IsEmail()
  readonly email:string

}