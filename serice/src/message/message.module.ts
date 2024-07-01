import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MongooseModule } from "@nestjs/mongoose";
import {Message, MessageSchema} from "./message_schema";
import {JwtModule} from "@nestjs/jwt";
import {User, UserSchema} from '../user/user.schema'
import {TokenService} from "./token.service";
import {ChatService} from "../chat/chat.service";
import {Chat, ChatSchema} from "../chat/chat.schema";


@Module({
  imports:[MongooseModule.forFeature([{name:Message.name, schema:MessageSchema},{name:User.name, schema:UserSchema},{name:Chat.name, schema:ChatSchema}]), JwtModule],
  providers: [MessageGateway, MessageService,TokenService, ChatService],
})
export class MessageModule{}
// export class MessageModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AuthMiddleware).exclude('/login').forRoutes(MessageGateway);
//   }
// }
