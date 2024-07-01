import { IsNotEmpty } from 'class-validator';
export class CreateMessageDto{

  readonly owner:string

  readonly date:string

  @IsNotEmpty()
  readonly text:string

  chatId:string

  filename:string
}