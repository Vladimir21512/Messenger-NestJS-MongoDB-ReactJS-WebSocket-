import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto{
  @IsNotEmpty()
  readonly name:string

  @IsNotEmpty()
  readonly nickname:string

  @IsEmail()
  readonly email:string

  @IsNotEmpty()
  password:string

  AvatarName:string
  // @IsNotEmpty()
  // LastVisit:string

  refreshtoken:string
}