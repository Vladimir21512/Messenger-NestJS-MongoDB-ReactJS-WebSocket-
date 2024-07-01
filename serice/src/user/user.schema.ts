import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User {
  @Prop()
  name: string;

  @Prop({type:[{chatId:{type:String}, messageIndex:{type:Number}}]})
  chats: { chatId: string; messageIndex: number }[];

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  nickname: string;

  @Prop()
  refreshtoken: string;

  @Prop()
  LastVisit: string;

  @Prop({
    type:[{name:{type:String}, userId:{type:String}}]
  })
  contacts: { name: number; userId: string }[];

  @Prop()
  AvatarName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);