import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./chat.schema";
import { User,UserSchema } from "../user/user.schema";
import { Message, MessageSchema } from "../message/message_schema";

@Module({
  imports:[MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema },{ name: User.name, schema: UserSchema },{ name: Message.name, schema: MessageSchema }])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
