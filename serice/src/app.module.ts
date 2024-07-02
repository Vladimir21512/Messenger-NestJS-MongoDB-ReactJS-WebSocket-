import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [MongooseModule.forRoot('MONGODB_URL'), ConfigModule.forRoot({isGlobal:true,}),UserModule, ChatModule, MessageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','src', 'images'),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
