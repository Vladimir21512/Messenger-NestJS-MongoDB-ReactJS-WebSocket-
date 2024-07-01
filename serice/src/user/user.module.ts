import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import {JwtModule} from "@nestjs/jwt";
import {User, UserSchema} from './user.schema';
import {TokenService} from "./token.service";
import { AuthMiddleware } from "../middleware/auth.middleware";

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), JwtModule],
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(AuthMiddleware).forRoutes({ path: "add", method: RequestMethod.POST  });
    consumer.apply(AuthMiddleware).exclude('user/create', 'user/login', 'user/refresh').forRoutes(UserController);
  }
}
