import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ collection: 'message' })
export class Message {
  @Prop()
  owner: string;

  @Prop()
  date: string;

  @Prop()
  text: string;

  @Prop()
  filename: string;

  @Prop()
  chatId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);