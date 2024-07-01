import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ collection: 'chat' })
export class Chat {
  @Prop()
  owner_1_id: string;

  @Prop()
  owner_2_id: string;

  @Prop()
  typeId: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);